import { prisma } from '../prisma/prisma.service';
import { Milestone } from '@north/shared-types';

export class MilestonesService {
    async toggle(id: string, isCompleted: boolean): Promise<Milestone> {
        const milestone = await prisma.milestone.update({
            where: { id },
            data: {
                isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
        });
        return milestone as unknown as Milestone;
    }
}
