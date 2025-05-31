import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';
export const userSeeder = async (prisma: PrismaClient) => {
  const roles = await prisma.role.findMany();
  if (!roles.length) {
    throw new Error('No roles found');
  }
  roles.forEach(async (role) => {
    switch (role.name) {
      case 'ADMIN':
        const name = process.env.ADMIN_USER_NAME;
        const username = process.env.ADMIN_USER_USERNAME;
        const email = process.env.ADMIN_USER_EMAIL;
        const password = process.env.ADMIN_USER_PASSWORD;

        if (!name || !username || !email || !password) {
          throw new Error('Admin user credentials not found');
        }
        await prisma.user.deleteMany({
          where: {
            username,
          },
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
          data: {
            name,
            username,
            email,
            password: hashedPassword,
            roleId: role.id,
          },
        });
        return;
    }
  });
};
