import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService = new AuthService();

    googleCallback(req: Request, res: Response) {
        // User is already attached to req.user by passport
        const user = req.user;
        const token = this.authService.login(user);
        
        // Redirect to Frontend with token
        // Use environment variable for frontend URL in prod
        // Assuming 4201 based on user context
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4201'; 
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    }
}
