/**
 * Assigns Handlers to Routes
 */
import { Router } from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStatus);
router.post('/users', UserController.postNew);
router.get('/users/me', UserController.getMe);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files/', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.put('/files/:id/data', FilesController.getFile);

export default router;
