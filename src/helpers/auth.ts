import { AuthUser } from "@/types/User";
import {
  AppRouteHandlerFn,
  AppRouteHandlerFnContext,
  getSession,
} from "@auth0/nextjs-auth0";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";

export type ApiRouteWithAuthHandlerFn = (
  req: NextRequest,
  ctx: AppRouteHandlerFnContext,
  user: AuthUser
) => Promise<Response> | Response;

export const apiWithAuth =
  (handler: ApiRouteWithAuthHandlerFn) =>
  async (request: NextRequest, ctx: AppRouteHandlerFnContext) => {
    const data = await getSession();

    if (data) {
      return handler(request, ctx, {
        name: data.user.name,
        email: data.user.email,
      });
    }

    const token = headers().get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({}, { status: 401 });
    }

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      return NextResponse.json({}, { status: 401 });
    }

    const kid = decoded.header.kid;

    const jwks = new JwksClient({
      jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
      timeout: 30000,
      cache: true,
      cacheMaxAge: 600000,
    });

    const publicKey = (await jwks.getSigningKey(kid)).getPublicKey();

    try {
      const data = jwt.verify(token, publicKey) as JwtPayload;
      const nameKey = Object.keys(data).find((key) => key.includes("name"));
      const emailkey = Object.keys(data).find((key) => key.includes("email"));

      return handler(request, ctx, {
        name: nameKey && data[nameKey],
        email: emailkey && data[emailkey],
      });
    } catch (error) {
      return NextResponse.json({}, { status: 401 });
    }
  };
