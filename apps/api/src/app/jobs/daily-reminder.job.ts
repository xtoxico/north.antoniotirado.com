import * as cron from 'node-cron';
import { prisma } from '../prisma/prisma.service';
import { GoalType } from '@prisma/client';
import { NotificationsService } from '../services/notifications.service';

const notificationsService = new NotificationsService();

export const initDailyReminder = () => {
  // Run at 20:00 every day
  cron.schedule('0 20 * * *', async () => {
    console.log('[Job] Running Daily Reminder...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Find BUILD_HABIT goals where lastActivityDate is NOT today (or null)
      // And join with User to get tokens
      
      const goalsPending = await prisma.goal.findMany({
        where: {
          type: GoalType.BUILD_HABIT,
          OR: [
              { lastActivityDate: null },
              { lastActivityDate: { lt: today } }
          ]
        },
        include: {
            user: {
                include: { deviceTokens: true }
            }
        }
      });

      console.log(`[Job] Found ${goalsPending.length} pending goals.`);

      // Group by user to avoid spamming? Or send one per goal?
      // Let's send one per goal for now, or just one generic "Check your goals"
      // User requested: "Aún no has completado [Nombre del Hábito]"
      
      for (const goal of goalsPending) {
          if (goal.user && goal.user.deviceTokens.length > 0) {
              await notificationsService.sendPushToUser(
                  goal.userId,
                  '¡No rompas la cadena! 🔗',
                  `Aún no has completado ${goal.title}. ¡Te quedan 4 horas!`
              );
          }
      }
      
    } catch (error) {
      console.error('[Job] Error in Daily Reminder:', error);
    }
  });
};
