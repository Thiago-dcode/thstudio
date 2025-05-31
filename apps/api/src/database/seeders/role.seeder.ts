import { EnumRole, PrismaClient } from '../generated/prisma';

export const roleSeeder = async (prisma: PrismaClient) => {
  const ROLES: EnumRole[] = ['ADMIN', 'USER', 'CLIENT', 'EDITOR'];
  await prisma.role.createMany({
    data: ROLES.map((role) => ({
      name: role,
    })),
  });
};
