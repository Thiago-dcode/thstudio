import { PrismaClient } from '../generated/prisma';

export const userSeeder = async (prisma: PrismaClient) => {
  const roles = await prisma.role.findMany();
  if (!roles.length) {
    throw new Error('No roles found');
  }
  roles.forEach(async (role) => {
    switch (role.name) {
      case 'ADMIN':
        const name = process.env.ADMIN_USER_NAME;
        const email = process.env.ADMIN_USER_EMAIL;
        const password = process.env.ADMIN_USER_PASSWORD;
        if (!name || !email || !password) {
          throw new Error('Admin user credentials not found');
        }
        await prisma.user.create({
          data: {
            name,
            email,
            roleId: role.id,
          },
        });
        break;
    }
  });
};
