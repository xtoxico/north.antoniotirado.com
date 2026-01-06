import * as cron from 'node-cron';
import { prisma } from '../prisma/prisma.service';
import { GoalType } from '@prisma/client';

export const initStreakMaintainer = () => {
  // Run at 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    console.log('[Job] Running Streak Maintainer...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    try {
      // Find BUILD_HABIT goals where lastActivityDate < Yesterday (start of day)
      // Actually, we want to find goals where lastActivityDate is NOT today AND NOT yesterday.
      // If lastActivityDate was yesterday, streak is kept. If it was before yesterday, streak is broken.
      // So search for lastActivityDate < yesterday (start of day)
      
      const goalsToReset = await prisma.goal.findMany({
        where: {
          type: GoalType.BUILD_HABIT,
          currentStreak: { gt: 0 },
          OR: [
              { lastActivityDate: null },
              { lastActivityDate: { lt: yesterday } }
          ]
        }
      });

      console.log(`[Job] Found ${goalsToReset.length} goals to reset streaks.`);

      for (const goal of goalsToReset) {
        await prisma.goal.update({
          where: { id: goal.id },
          data: { currentStreak: 0 }
        });
      }
      
    } catch (error) {
      console.error('[Job] Error in Streak Maintainer:', error);
    }
  });
};
