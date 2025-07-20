import '../../src/configs/env';
import { PrismaClient } from '@prisma/client';
import { PasswordUtils } from '../../src/utils/password-utils';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

export const userSeeder = async () => {
  const id = `USR-${uuid()}`;
  const name = 'Test User';
  const password = await PasswordUtils.hashPassword('test1234');
  const email = 'testuser@example.com';

  await prisma.user.create({
    data: {
      id,
      name,
      email,
      password,
    },
  });
};