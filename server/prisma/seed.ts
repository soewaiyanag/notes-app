import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import seedData from './seed.json';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@notes.app';
const DEMO_PASSWORD = 'password123';

async function main() {
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: { email: DEMO_EMAIL, password: hashed },
  });

  await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  await prisma.note.deleteMany({ where: { userId: user.id } });

  for (const note of seedData.notes) {
    const editedAt = new Date(note.lastEdited);

    await prisma.note.create({
      data: {
        title: note.title,
        content: note.content,
        isArchived: note.isArchived,
        userId: user.id,
        createdAt: editedAt,
        updatedAt: editedAt,
        tags: {
          connectOrCreate: note.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
  }

  console.info(`Seeded ${seedData.notes.length} notes for ${DEMO_EMAIL} (password: ${DEMO_PASSWORD})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
