/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { authMiddleware } from './app/middleware/auth.middleware';
import goalsRoutes from './app/routes/goals.routes';
import milestonesRoutes from './app/routes/milestones.routes';

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware
app.use(authMiddleware as any); // Type assertion for Express compatibility with custom request type

// Routes
app.use('/api/goals', goalsRoutes);
app.use('/api/milestones', milestonesRoutes);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
