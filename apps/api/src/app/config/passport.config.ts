import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const configurePassport = () => {
    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
        callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await authService.validateUser(profile);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

    // JWT Strategy
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'dev_secret_key_change_me'
    },
    async (payload, done) => {
        try {
            // Payload contains { sub: userId, email: ... }
            // For extra security check if user exists in DB, 
            // but for performance we might just trust the signature.
            // Let's verify existence briefly or just pass payload
            return done(null, { id: payload.sub, email: payload.email });
        } catch (error) {
            return done(error, false);
        }
    }));
};
