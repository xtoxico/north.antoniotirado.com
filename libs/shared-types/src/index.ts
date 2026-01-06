export enum GoalType {
    ELIMINATE_HABIT = 'ELIMINATE_HABIT',
    BUILD_HABIT = 'BUILD_HABIT',
    ACHIEVEMENT = 'ACHIEVEMENT',
}

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    type: GoalType;

    startDate: Date;
    targetDate?: Date | null;
    frequency?: any | null; // Typed loosely for now as JSON

    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: Date | null;
    totalActionCount: number;

    createdAt: Date;
    updatedAt: Date;

    // View Fields (Computed)
    daysSinceLastIncident?: number;
    progressPercentage?: number;
    milestones?: Milestone[];
}

export interface Milestone {
    id: string;
    goalId: string;
    title: string;
    isCompleted: boolean;
    completedAt?: Date | null;
}

export interface CreateGoalDto {
    title: string;
    description?: string;
    type: GoalType;
    startDate: string; // ISO string on wire
    targetDate?: string; // ISO string on wire
    frequency?: any;
}
