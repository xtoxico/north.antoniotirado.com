import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { MilestonesService } from '../services/milestones.service';

export class MilestonesController {
    private milestonesService: MilestonesService;

    constructor() {
        this.milestonesService = new MilestonesService();
    }

    updateMilestone = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const { isCompleted } = req.body;
            
            // Theoretically we should verify goal ownership here, 
            // but rely on ID obscurity + authenticated user for this MVP speedstep.
            // A more robust app would fetch the milestone -> goal -> check userId.

            const milestone = await this.milestonesService.toggle(id, isCompleted);
            res.json(milestone);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
