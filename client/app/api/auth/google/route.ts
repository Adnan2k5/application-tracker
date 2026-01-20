import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID =
  "836719910691-265uu8104j0ok3dn7jhaqpaljni9vlom.apps.googleusercontent.com";

export async function GET() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
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

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}
