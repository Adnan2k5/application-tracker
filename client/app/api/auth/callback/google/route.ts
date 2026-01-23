import { NextRequest, NextResponse } from "next/server";
import { getGoogleToken, decodeIdToken } from "@/app/lib/auth/google";
import { findOrCreateUserFromGoogle } from "@/app/lib/users/service";
import { cookies } from "next/headers";
import { createSession } from "../../../../lib/sessions/session";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 },
    );
  }

  try {
    const tokens = await getGoogleToken(code);
    const googleUser = decodeIdToken(tokens.id_token);

    const user = await findOrCreateUserFromGoogle({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      refreshToken: tokens.refresh_token,
    });
    const token = await createSession(user.id);
    (await cookies()).set("sessionId", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
