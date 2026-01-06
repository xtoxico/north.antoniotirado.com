import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller';

const router = Router();
const controller = new NotificationsController();

router.post('/subscribe', controller.subscribe);
router.post('/test-me', controller.testMe);

export default router;
