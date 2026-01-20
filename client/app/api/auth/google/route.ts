import { getCurrentUser } from "@/app/lib/sessions/session";
import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: "http://localhost:3000/api/auth/callback/google",
    response_type: "code",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.readonly",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const getUser = await getCurrentUser();
  if (getUser?.id) {
    return NextResponse.redirect("http://localhost:3000/dashboard");
  }
  return NextResponse.redirect(url);
}
