/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import { authMiddleware } from './app/middleware/auth.middleware';
import { configurePassport } from './app/config/passport.config';
import goalsRoutes from './app/routes/goals.routes';
import milestonesRoutes from './app/routes/milestones.routes';
import authRoutes from './app/routes/auth.routes';
import notificationsRoutes from './app/routes/notifications.routes';
import { initStreakMaintainer } from './app/jobs/streak-maintainer.job';
import { initDailyReminder } from './app/jobs/daily-reminder.job';

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

import * as swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './app/config/swagger.config';

// Cron Jobs
initStreakMaintainer();
initDailyReminder();

// Swagger
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Auth Init
app.use(passport.initialize());
configurePassport();

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/goals', authMiddleware, goalsRoutes);
app.use('/api/milestones', authMiddleware, milestonesRoutes);
app.use('/api/notifications', authMiddleware, notificationsRoutes);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
