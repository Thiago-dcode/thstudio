import { EnumProjectStatus, PrismaClient } from '../generated/prisma';

export const projectStatusSeeder = async (prisma: PrismaClient) => {
  const STATUSES: EnumProjectStatus[] = [
    'NOT_STARTED',
    'PLANNING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
  ];
  await prisma.projectStatus.deleteMany();
  await prisma.projectStatus.createMany({
    data: STATUSES.map((status) => ({
      name: status,
    })),
  });
};
