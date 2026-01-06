import { Response } from 'express';
import { NotificationsService } from '../services/notifications.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class NotificationsController {
    private service = new NotificationsService();

    subscribe = async (req: AuthenticatedRequest, res: Response) => {
         const { token } = req.body;
         const userId = req.user?.id;

         if (!userId || !token) {
             res.status(400).json({ message: 'Missing token or user' });
             return;
         }

         await this.service.subscribe(userId, token);
         res.status(200).json({ success: true });
    }

    testMe = async (req: AuthenticatedRequest, res: Response) => {
         const userId = req.user?.id;
         if (!userId) {
             res.status(401).send();
             return;
         }

         await this.service.sendPushToUser(userId, 'North', '¡North te vigila! 👀');
         res.json({ message: 'Sent' });
    }
}
