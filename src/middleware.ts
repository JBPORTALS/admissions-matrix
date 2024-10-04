import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/utils/session";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (req.nextUrl.pathname === "/") return NextResponse.next();

  // Protect routes that require authentication
  if (!session.id && !req.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
