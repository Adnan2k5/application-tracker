import { prisma } from "../../lib/db/prisma";

type GoogleUserInput = {
  googleId: string;
  email: string;
  name?: string;
  refreshToken?: string;
};

export async function findOrCreateUserFromGoogle(input: GoogleUserInput) {
  let user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
      },
    });
  }

  await prisma.googleAccount.upsert({
    where: {
      userId_email: {
        userId: user.id,
        email: input.email,
      },
    },
    update: {
      refreshToken: input.refreshToken,
    },
    create: {
      userId: user.id,
      email: input.email,
      refreshToken: input.refreshToken,
    },
  });

  return user;
}
