import { prisma } from '../prisma/prisma.service';
import { CreateGoalDto, Goal } from '@north/shared-types';

export class GoalsService {
    async findAll(userId: string): Promise<Goal[]> {
        const goals = await prisma.goal.findMany({
            where: { userId },
            include: {
                entries: { orderBy: { date: 'desc' }, take: 1 },
                milestones: true,
            }
        });

        return goals.map(g => {
            const goal = { ...g } as any;

            // Logic: Eliminate Habit
            if (goal.type === 'ELIMINATE_HABIT') {
                let lastDate = new Date(goal.startDate);
                if (goal.entries.length > 0) {
                    lastDate = new Date(goal.entries[0].date);
                }
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - lastDate.getTime());
                goal.daysSinceLastIncident = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            }

            // Logic: Achievement
            if (goal.type === 'ACHIEVEMENT') {
                if (goal.milestones.length > 0) {
                    const completed = goal.milestones.filter((m: any) => m.isCompleted).length;
                    goal.progressPercentage = Math.round((completed / goal.milestones.length) * 100);
                } else {
                    goal.progressPercentage = 0;
                }
            }

            return goal;
        }) as unknown as Goal[];
    }

    async create(userId: string, data: CreateGoalDto): Promise<Goal> {
        const goal = await prisma.goal.create({
            data: {
                ...data,
                userId,
                startDate: new Date(data.startDate),
                targetDate: data.targetDate ? new Date(data.targetDate) : null,
            },
        });
        return goal as unknown as Goal;
    }

    async registerEntry(userId: string, goalId: string): Promise<void> {
        const goal = await prisma.goal.findUnique({
            where: { id: goalId },
        });

        if (!goal || goal.userId !== userId) {
            throw new Error('Goal not found');
        }

        if (goal.type === 'ACHIEVEMENT') {
            throw new Error('Cannot register entries for Achievement goals. Use milestones.');
        }

        await prisma.$transaction(async (tx) => {
            // Create Entry
            await tx.entry.create({
                data: {
                    goalId,
                    date: new Date(),
                },
            });

            // Update Goal Logic
            if (goal.type === 'BUILD_HABIT') {
                await tx.goal.update({
                    where: { id: goalId },
                    data: {
                        currentStreak: { increment: 1 },
                        lastActivityDate: new Date(),
                        totalActionCount: { increment: 1 }
                    }
                });
            } else if (goal.type === 'ELIMINATE_HABIT') {
                 // Resetting streak/days free is implicit by having a recent entry, 
                 // but we update lastActivityDate to be explicit about the "incident".
                 await tx.goal.update({
                    where: { id: goalId },
                    data: {
                        lastActivityDate: new Date(),
                         // currentStreak could be used as "longest streak without incident" logic elsewhere, 
                         // but for "daysSinceLastIncident" calculation, the entry presence is enough.
                    }
                });
            }
        });
    }

    async findOne(userId: string, goalId: string): Promise<Goal | null> {
         const goal = await prisma.goal.findUnique({
            where: { id: goalId },
            include: {
                entries: { orderBy: { date: 'desc' }, take: 1 },
                milestones: true,
            }
        });

        if (!goal || goal.userId !== userId) return null;

        // Apply View Logic (Reuse logic?)
        // Ideally extract this to a private mapper method, but duplicating briefly for speed
        const g = { ...goal } as any;

         if (g.type === 'ELIMINATE_HABIT') {
            let lastDate = new Date(g.startDate);
            if (g.entries.length > 0) {
                lastDate = new Date(g.entries[0].date);
            }
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastDate.getTime());
            g.daysSinceLastIncident = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        if (g.type === 'ACHIEVEMENT') {
            if (g.milestones.length > 0) {
                const completed = g.milestones.filter((m: any) => m.isCompleted).length;
                g.progressPercentage = Math.round((completed / g.milestones.length) * 100);
            } else {
                g.progressPercentage = 0;
            }
        }

        return g as unknown as Goal;
    }
}
