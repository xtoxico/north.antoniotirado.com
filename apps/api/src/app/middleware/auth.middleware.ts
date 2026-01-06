import * as passport from 'passport';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authMiddleware = passport.authenticate('jwt', { session: false });
