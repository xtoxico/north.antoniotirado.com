import { Router } from 'express';
import { GoalsController } from '../controllers/goals.controller';

const router = Router();
const goalsController = new GoalsController();

router.get('/', goalsController.getGoals);
router.get('/:id', goalsController.getGoal);
router.post('/', goalsController.createGoal);
router.post('/:id/entries', goalsController.registerEntry);

export default router;
