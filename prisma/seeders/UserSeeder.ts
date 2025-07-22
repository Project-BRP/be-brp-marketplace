import '../../src/configs/env';
import { PrismaClient, Role } from '@prisma/client';
import { PasswordUtils } from '../../src/utils/password-utils';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

export const userSeeder = async () => {
  const users = [
    {
      id: `USR-${uuid()}`,
      name: 'Test User',
      email: 'testuser@example.com',
      password: await PasswordUtils.hashPassword('test1234'),
    },
    {
      id: `USR-${uuid()}`,
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: await PasswordUtils.hashPassword('admin1234'),
      role: Role.ADMIN,
    },
    {
      id: `USR-${uuid()}`,
      name: 'Qiqi Oberon',
      email: 'aquq1q1.farrukh@gmail.com',
      password: await PasswordUtils.hashPassword('Q1q10beron'),
      role: Role.ADMIN,
    },
    {
      id: `USR-${uuid()}`,
      name: 'Aqil Dominic',
      email: 'aquaq1l.farrukh@gmail.com',
      password: await PasswordUtils.hashPassword('Q1q10beron'),
    }
  ];

  for (const user of users) {
    try {
      await prisma.user.create({
        data: user,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        continue;
      }
      throw error;
    }
  }
};