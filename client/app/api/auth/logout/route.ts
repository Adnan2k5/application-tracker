import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/db/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionId")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
          sessionId: string;
          userId: string;
        };
        await prisma.session.delete({
          where: { id: decoded.sessionId },
        });
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
    cookieStore.delete("sessionId");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
