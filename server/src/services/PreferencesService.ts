import { prisma } from '../config/prisma';
import type { UpdatePreferencesBody } from '../schemas/preferences.schema';

export default class PreferencesService {
  static async get(userId: number) {
    return prisma.userPreferences.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  static async update(userId: number, data: UpdatePreferencesBody) {
    return prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}
