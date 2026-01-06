import { GoalsService } from '../services/goals.service';
import { CreateGoalDto, Goal } from '@north/shared-types';

export class GoalsFacade {
    private goalsService: GoalsService;

    constructor() {
        this.goalsService = new GoalsService();
    }

    async getUserGoals(userId: string): Promise<Goal[]> {
        return this.goalsService.findAll(userId);
    }

    async createGoal(userId: string, dto: CreateGoalDto): Promise<Goal> {
        return this.goalsService.create(userId, dto);
    }

    async registerEntry(userId: string, goalId: string): Promise<void> {
        return this.goalsService.registerEntry(userId, goalId);
    }

    async getGoal(userId: string, goalId: string): Promise<Goal | null> {
        return this.goalsService.findOne(userId, goalId);
    }
}
