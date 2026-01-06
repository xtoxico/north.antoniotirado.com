import { prisma } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    async validateUser(googleProfile: any): Promise<any> {
        const { id, emails, displayName, photos } = googleProfile;
        const email = emails[0].value;
        const avatarUrl = photos && photos.length > 0 ? photos[0].value : null;

        // Upsert user based on Google ID or Email
        // Note: For simplicity, we assume email is unique and trustworthy from Google.
        // In a real app we might handle account linking more carefully.
        
        // Check if user exists by googleId
        let user = await prisma.user.findUnique({
            where: { googleId: id }
        });

        if (!user) {
            // Check if user exists by email (legacy or pre-created?)
            user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                // Link Google ID
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: id, avatarUrl: avatarUrl || user.avatarUrl }
                });
            } else {
                // Create new user
                user = await prisma.user.create({
                    data: {
                        googleId: id,
                        email,
                        name: displayName,
                        avatarUrl
                    }
                });
            }
        } else {
            // Update avatar/name on login? Optional.
            // await prisma.user.update(...)
        }

        return user;
    }

    login(user: any): string {
        const payload = { sub: user.id, email: user.email };
        const secret = process.env.JWT_SECRET || 'dev_secret_key_change_me';
        return jwt.sign(payload, secret, { expiresIn: '7d' });
    }
}
