import { ObjectId } from "mongodb";
import { v4 as uuid4 } from 'uuid';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import fs from 'fs';

const postUpload = async (req, res) => {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (token === undefined || !userId) {
        return res.status(401).json({ error: 'Unauthorized'});
    }
    const acceptedType = ['folder', 'file', 'image'];
    const { name, type, data } = req.body;
    const { parentId = 0, isPublic = false} = req.body;
    if (name === undefined) return res.status(400).json({ error: 'Missing name' });
    if (type === undefined || acceptedType.indexOf(type) === -1) return res.status(400).json({ error: 'Missing type' });
    if (data === undefined && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
    if (parentId) {
        const file = await dbClient.findOne('files', { _id: ObjectId(parentId) });
        if (!file) return res.status(400).json({ error: 'Parent not found' });
        if (file.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }
    if (type === 'folder') {
        try {
            const result = await dbClient.insertOne('files', {
                userId: ObjectId(userId), name, type, parentId: String(parentId), isPublic,
            });
            return res.status(201).json({
                id: result.insertedId, userId, name, type, isPublic, parentId,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    const rootFolder = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileName = uuid4();
    let fileContent;
    if (type === 'image') {
        fileContent = data.replace(/^data:image\/\w+;base64,/, '');
        fileContent = Buffer.from(fileContent, 'base64');
    } else {
        fileContent = Buffer.from(data, 'base64').toString('utf8');
    }
    try {
        fs.mkdirSync(`${rootFolder}`, { recursive: true });
        const localPath = (rootFolder[-1] === '/') ? `${rootFolder}${fileName}` : `${rootFolder}/${fileName}`;
        fs.writeFileSync(localPath, fileContent);
        const result = await dbClient.insertOne('files', {
            userId: ObjectId(userId),
            name,
            type,
            parentId: (parentId !== 0) ? ObjectId(parentId) : String(parentId),
            isPublic,
            localPath,
        });
        if (type === 'image') {
            const fileQueue = new Queue('fileQueue');
            fileQueue.add({ userId, fileId: result.insertedId })
        }
        return res.status(201).json({
            id: result.insertedId, userId, name, type, isPublic, parentId,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = postUpload;