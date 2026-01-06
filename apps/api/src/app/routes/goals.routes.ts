import { Router } from 'express';
import { GoalsController } from '../controllers/goals.controller';

const router = Router();
const goalsController = new GoalsController();

/**
 * @openapi
 * /api/goals:
 *   get:
 *     summary: Retrieve all goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGoalDto'
 *     responses:
 *       201:
 *         description: Created goal
 */
router.get('/', goalsController.getGoals);
router.get('/:id', goalsController.getGoal);
router.post('/', goalsController.createGoal);
router.post('/:id/entries', goalsController.registerEntry);

export default router;
