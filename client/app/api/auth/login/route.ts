import { prisma } from "@/app/lib/db/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

dotenv.config();

type LoginFormData = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

export async function POST(request: Request) {
  try {
    const data: LoginFormData = await request.json();
    const email = data.email;
    const password = data.password;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const extUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
      },
    });
    if (!extUser) {
      throw new Error("User not found");
    }
    if (
      !extUser.password ||
      !(await bcrypt.compare(password, extUser.password))
    ) {
      throw new Error("Invalid credentials");
    }
    const session = await prisma.session.create({
      data: {
        userId: extUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(
      { sessionId: session.id, userId: extUser.id },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    (await cookies()).set({
      name: "sessionId",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json({
      success: true,
      redirect: "/dashboard",
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Login failed" },
      { status: 400 },
    );
  }
}
