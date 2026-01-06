import { Router } from 'express';
import { MilestonesController } from '../controllers/milestones.controller';

const router = Router();
const milestonesController = new MilestonesController();

router.patch('/:id', milestonesController.updateMilestone);

export default router;
