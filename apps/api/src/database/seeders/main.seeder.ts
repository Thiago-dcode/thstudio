import { PrismaClient } from '../generated/prisma';
import { roleSeeder } from './role.seeder';
import { userSeeder } from './user.seeder';
import { projectStatusSeeder } from './projectStatus.seeder';
(async () => {
  const prisma = new PrismaClient();

  await roleSeeder(prisma);
  await userSeeder(prisma);
  await projectStatusSeeder(prisma);
})();
