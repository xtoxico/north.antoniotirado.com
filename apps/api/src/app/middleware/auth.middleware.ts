import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/prisma.service';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    // Mock Auth: Hardcoded lookup for seed user
    const user = await prisma.user.findUnique({
        where: { email: 'test@antoniotirado.com' },
    });

    if (!user) {
        res.status(401).json({ message: 'Mock user not found' });
        return;
    }

    req.user = { id: user.id, email: user.email };
    next();
};
