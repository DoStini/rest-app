import { withApiAuth } from "@/helpers/auth";
import { NextRequest, NextResponse } from "next/server";

const GET = withApiAuth(async (request, _ctx, user) => {
  return NextResponse.json(user);
});

const POST = async (request: NextRequest) => {
  const { username, password } = await request.json();

  const body = {
    client_id: process.env.AUTH0_EXTERNAL_AUTH_CLIENT_ID,
    client_secret: process.env.AUTH0_EXTERNAL_AUTH_SECRET,
    audience: process.env.AUTH0_API_AUTH_AUDIENCE,
    grant_type: "password",
    scope: "read:profile read:email",
    username,
    password,
  };

  const response = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const responseBody = await response.json();

  if (response.status !== 200) {
    return NextResponse.json(
      {
        error: responseBody.error_description,
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    accessToken: responseBody.access_token,
  });
};
export { GET, POST };
