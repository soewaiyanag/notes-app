import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const noteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export async function getNotes(req: AuthRequest, res: Response): Promise<void> {
  const { archived, tag, q } = req.query;

  const notes = await prisma.note.findMany({
    where: {
      userId: req.userId!,
      isArchived: archived === 'true',
      ...(tag ? { tags: { some: { name: String(tag) } } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: String(q) } },
              { content: { contains: String(q) } },
              { tags: { some: { name: { contains: String(q) } } } },
            ],
          }
        : {}),
    },
    include: { tags: true },
    orderBy: { updatedAt: 'desc' },
  });

  res.json(notes);
}

export async function getNote(req: AuthRequest, res: Response): Promise<void> {
  const note = await prisma.note.findFirst({
    where: { id: Number(req.params.id), userId: req.userId! },
    include: { tags: true },
  });

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  res.json(note);
}

export async function createNote(req: AuthRequest, res: Response): Promise<void> {
  const parsed = noteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    return;
  }

  const { title, content, tags = [] } = parsed.data;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: req.userId!,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });

  res.status(201).json(note);
}

export async function updateNote(req: AuthRequest, res: Response): Promise<void> {
  const note = await prisma.note.findFirst({
    where: { id: Number(req.params.id), userId: req.userId! },
  });

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  const parsed = noteSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });
    return;
  }

  const { title, content, tags } = parsed.data;

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && {
        tags: {
          set: [],
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      }),
    },
    include: { tags: true },
  });

  res.json(updated);
}

export async function deleteNote(req: AuthRequest, res: Response): Promise<void> {
  const note = await prisma.note.findFirst({
    where: { id: Number(req.params.id), userId: req.userId! },
  });

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  await prisma.note.delete({ where: { id: note.id } });
  res.status(204).send();
}

export async function toggleArchive(req: AuthRequest, res: Response): Promise<void> {
  const note = await prisma.note.findFirst({
    where: { id: Number(req.params.id), userId: req.userId! },
    include: { tags: true },
  });

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: { isArchived: !note.isArchived },
    include: { tags: true },
  });

  res.json(updated);
}
