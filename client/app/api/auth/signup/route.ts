import { prisma } from "../../../lib/db/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

type LoginFormData = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

export async function POST(request: NextRequest) {
  try {
    const data: LoginFormData = await request.json();
    const { email, password, name } = data;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const extUser = await prisma.user.findUnique({
      where: { email },
    });

    if (extUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || "",
        password: hashedPassword,
      },
    });

    const session = await prisma.session.create({
      data: {
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    (await cookies()).set({
      name: "sessionId",
      value: session.id,
      httpOnly: true,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
