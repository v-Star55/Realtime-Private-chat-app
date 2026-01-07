import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";
import { nanoid } from "nanoid";

// Check if user is allowed to join the room. If not, redirect back to the lobby.
export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // Match `/room/<roomId>` where roomId is one or more non-slash characters
  const roomMatch = pathName.match(/^\/room\/([^/]+)$/);
  if (!roomMatch) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const roomId = roomMatch[1];

  // Fetch room metadata from Redis
  const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
    `meta:${roomId}`,
  );

  if (!meta) {
    return NextResponse.redirect(
      new URL("/?error=room-not-found", request.url),
    );
  }

  const existingToken = request.cookies.get("x-auth-token")?.value;

  // user is allowed
  if (existingToken && meta.connected.includes(existingToken)) {
    return NextResponse.next();
  }

  // user is not allowed

  if(meta.connected.length>=2){
    return NextResponse.redirect(new URL("/?error=room-full",request.url));
  }



  const response = NextResponse.next();

  // Set auth token cookie
  const token = nanoid();
  response.cookies.set("x-auth-token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Add the user to the connected array of the room
  const currentConnected = Array.isArray(meta.connected)
    ? meta.connected
    : meta.connected
      ? [meta.connected as unknown as string]
      : [];

  await redis.hset(`meta:${roomId}`, {
    connected: [...currentConnected, token],
  });

  return response;
}

export const config = {
  matcher: "/room/:path*",
};