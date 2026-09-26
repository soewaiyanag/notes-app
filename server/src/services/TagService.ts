import { prisma } from '../config/prisma';

export default class TagService {
  // Tags are a shared namespace in the schema, so scope the listing through
  // the user's own notes rather than reading the Tag table directly —
  // otherwise another user's tag names would leak into this list.
  static async list(userId: number) {
    return prisma.tag.findMany({
      where: { notes: { some: { userId } } },
      orderBy: { name: 'asc' },
    });
  }
}
