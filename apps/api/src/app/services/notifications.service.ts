import * as admin from 'firebase-admin';
import { prisma } from '../prisma/prisma.service';

// Initialize Firebase Admin with credentials from env or default
// Ideally: admin.initializeApp({ credential: admin.credential.applicationDefault() });
// For now, we wrap in try/catch or check if already initialized to avoid errors during development without credentials
if (admin.apps.length === 0) {
    try {
        admin.initializeApp(); 
        console.log('Firebase Admin initialized');
    } catch (e) {
        console.warn('Firebase Admin init failed (expected if no credentials provided in env):', e);
    }
}

export class NotificationsService {
    
    async subscribe(userId: string, token: string): Promise<void> {
        // Upsert token
        const existing = await prisma.deviceToken.findFirst({
            where: { token }
        });

        if (existing) {
            if (existing.userId !== userId) {
                 await prisma.deviceToken.update({
                     where: { id: existing.id },
                     data: { userId }
                 });
            }
        } else {
             await prisma.deviceToken.create({
                 data: { token, userId }
             });
        }
    }

    async sendPushToUser(userId: string, title: string, body: string): Promise<void> {
        const tokens = await prisma.deviceToken.findMany({
            where: { userId }
        });

        if (!tokens.length) return;

        const tokenStrings = tokens.map(t => t.token);
        
        try {
            const message = {
                notification: { title, body },
                tokens: tokenStrings
            };
            
            // Multicast
            const response = await admin.messaging().sendEachForMulticast(message);
            
            if (response.failureCount > 0) {
                 const failedTokens: string[] = [];
                 response.responses.forEach((resp, idx) => {
                     if (!resp.success) {
                         const error = resp.error;
                         if (error?.code === 'messaging/invalid-registration-token' ||
                             error?.code === 'messaging/registration-token-not-registered') {
                                 failedTokens.push(tokenStrings[idx]);
                             }
                     }
                 });

                 if (failedTokens.length > 0) {
                     await prisma.deviceToken.deleteMany({
                         where: { token: { in: failedTokens } }
                     });
                 }
            }

        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    }
}
