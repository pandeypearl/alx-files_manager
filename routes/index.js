/**
 * Assigns Handlers to Routes
 */
import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStatus);
router.post('/users', UsersControllers.postNew);

export default router;