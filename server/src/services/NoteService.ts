import { prisma } from '../config/prisma';
import { NotFoundException } from '../exceptions/NotFoundException';
import type { CreateNoteBody, UpdateNoteBody, NoteListQuery } from '../schemas/note.schema';

export default class NoteService {
  static async list(userId: number, query: NoteListQuery) {
    const { archived, tag, q } = query;

    return prisma.note.findMany({
      where: {
        userId,
        ...(archived !== undefined ? { isArchived: archived === 'true' } : {}),
        ...(tag ? { tags: { some: { name: tag } } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { content: { contains: q } },
                { tags: { some: { name: { contains: q } } } },
              ],
            }
          : {}),
      },
      include: { tags: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async getById(id: number, userId: number) {
    const note = await prisma.note.findFirst({
      where: { id, userId },
      include: { tags: true },
    });

    if (!note) throw new NotFoundException('Note');
    return note;
  }

  static async create(userId: number, { title, content, tags = [] }: CreateNoteBody) {
    return prisma.note.create({
      data: {
        title,
        content,
        userId,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { tags: true },
    });
  }

  static async update(id: number, userId: number, { title, content, tags }: UpdateNoteBody) {
    await NoteService.getById(id, userId);

    return prisma.note.update({
      where: { id },
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
  }

  static async delete(id: number, userId: number): Promise<void> {
    await NoteService.getById(id, userId);
    await prisma.note.delete({ where: { id } });
  }

  static async toggleArchive(id: number, userId: number) {
    const note = await NoteService.getById(id, userId);

    return prisma.note.update({
      where: { id },
      data: { isArchived: !note.isArchived },
      include: { tags: true },
    });
  }
}
