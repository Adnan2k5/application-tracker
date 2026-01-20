import jwt from "jsonwebtoken";

type GoogleToken = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
};

export async function getGoogleToken(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables",
    );
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: "http://localhost:3000/api/auth/callback/google",
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errorData = await tokenRes.json();
    console.error("Google token exchange error:", errorData);
    throw new Error(
      `Failed to exchange code for tokens: ${errorData.error} - ${errorData.error_description}`,
    );
  }

  return (await tokenRes.json()) as GoogleToken;
}

export function decodeIdToken(idToken: string) {
  const decode = jwt.decode(idToken) as jwt.JwtPayload | null;

  if (!decode || !decode.email || !decode.sub) {
    throw new Error("Invalid ID token");
  }
  return {
    googleId: decode.sub,
    email: decode.email,
    name: decode.name,
    picture: decode.picture,
  };
}
