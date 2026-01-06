import { PrismaClient, GoalType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Create User
  const user = await prisma.user.upsert({
    where: { email: 'test@antoniotirado.com' },
    update: {},
    create: {
      email: 'test@antoniotirado.com',
      name: 'Test Project North',
    },
  });

  console.log(`Created user: ${user.name}`);

  // 2. Goal 1: Eliminate Habit (Smoking)
  // Entry: Relapse 5 days ago
  const relapseDate = new Date();
  relapseDate.setDate(relapseDate.getDate() - 5);

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Dejar de fumar',
      type: GoalType.ELIMINATE_HABIT,
      startDate: new Date(),
      currentStreak: 5, // Since relapse
      longestStreak: 5,
      lastActivityDate: relapseDate,
      entries: {
        create: [
          {
            date: relapseDate,
            notes: 'Tuve una recaída en la fiesta.',
          },
        ],
      },
    },
  });

  // 3. Goal 2: Build Habit (Read 30 mins)
  // Daily, 3 entries consecutive recent
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const dayBefore = new Date(Date.now() - 86400000 * 2);

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Leer 30 mins',
      type: GoalType.BUILD_HABIT,
      startDate: new Date(),
      frequency: { type: 'DAILY' },
      currentStreak: 3,
      longestStreak: 3,
      lastActivityDate: today,
      totalActionCount: 3,
      entries: {
        create: [
          { date: dayBefore },
          { date: yesterday },
          { date: today },
        ],
      },
    },
  });

  // 4. Goal 3: Achievement (Marathon)
  // 3 Milestones
  await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Correr Maratón de Valencia',
      type: GoalType.ACHIEVEMENT,
      startDate: new Date(),
      targetDate: new Date('2026-12-01'), // Future date
      milestones: {
        create: [
          { title: 'Correr 10k', isCompleted: true, completedAt: new Date() },
          { title: 'CorrerMedia Maratón', isCompleted: false },
          { title: 'Completar plan de entrenamiento', isCompleted: false },
        ],
      },
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
