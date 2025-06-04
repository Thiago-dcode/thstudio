import { PrismaClient } from '../generated/prisma';
import { roleSeeder } from './role.seeder';
import { userSeeder } from './user.seeder';
import { projectStatusSeeder } from './projectStatus.seeder';
import { languageSeeder } from './language.seeder';
import { countrySeeder } from './country.seeder';
(async () => {
  const prisma = new PrismaClient();
  await languageSeeder(prisma);
  await countrySeeder(prisma);
  await roleSeeder(prisma);
  await userSeeder(prisma);
  await projectStatusSeeder(prisma);
})();
