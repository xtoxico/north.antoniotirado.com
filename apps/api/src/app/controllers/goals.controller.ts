import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { GoalsFacade } from '../facades/goals.facade';

export class GoalsController {
    private goalsFacade: GoalsFacade;

    constructor() {
        this.goalsFacade = new GoalsFacade();
    }

    getGoals = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const goals = await this.goalsFacade.getUserGoals(req.user.id);
            res.json(goals);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    createGoal = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const goal = await this.goalsFacade.createGoal(req.user.id, req.body);
            res.status(201).json(goal);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    registerEntry = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            await this.goalsFacade.registerEntry(req.user.id, req.params['id']);
            res.status(201).send();
        } catch (error: any) {
            console.error(error);
            if (error.message === 'Goal not found') {
                 res.status(404).json({ message: error.message });
            } else if (error.message.includes('Cannot register')) {
                 res.status(400).json({ message: error.message });
            } else {
                 res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };

    getGoal = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const goal = await this.goalsFacade.getGoal(req.user.id, req.params['id']);
            if (!goal) {
                res.status(404).json({ message: 'Goal not found' });
                return;
            }
            res.json(goal);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
