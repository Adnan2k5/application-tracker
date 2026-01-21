import { cookies } from "next/headers";
import { prisma } from "../db/prisma";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

  const token = jwt.sign({ sessionId, userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
}

export async function getCurrentUser() {
  const token = (await cookies()).get("sessionId")?.value;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sessionId: string;
      userId: string;
    };

    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  } catch (error) {
    return null;
  }
}
