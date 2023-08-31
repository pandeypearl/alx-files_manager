/**
 * Defines Handler for Users Route
 */
import Queue from 'bull';
import hash from '../utils/hash';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const postNew = async (req, res) => {
    const { email, password } = req.body;
    if (email === undefined) return res.status(400).json({ error: 'Missing email' });
    if (password === undefined) return res.status(400).json({ error: 'Missing password' });
    try {
        const hashPassword = hash(password);
        const result = await dbClient.insertOne('users', { email, password: hashPassword });
        const userQueue = new Queue('userQueue');
        userQueue.on('global:completed', (jobId, result) => {
            console.log(`JOb ${jobId} completed!`);
            userQueue.getJob(jobId).then((job) => {
                console.log(`Welcome email has been sent to user ${job.data.userId}`);
                job.remove();
            }); 
        });
        userQueue.add({ userId: result.insertedId });
        return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ error: 'Already exist' });
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = postNew;