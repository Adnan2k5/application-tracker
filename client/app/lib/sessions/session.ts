import { cookies } from "next/headers";
import { prisma } from "../db/prisma";
import crypto from "crypto";

export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  return sessionId;
}

export async function getCurrentUser() {
  const sessionId = (await cookies()).get("sessionId")?.value;
  if (!sessionId) {
    return null;
  }
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  return session.user;
}
