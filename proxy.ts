import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// Checagem otimista: só lê o cookie, nunca bate no banco aqui (proxy roda em
// toda rota, inclusive prefetch). A checagem "de verdade" (RBAC por
// permissão) acontece no DAL, perto do dado — ver lib/dal.ts.
const PROTECTED_PREFIXES = ["/painel", "/escrever", "/admin"];
const AUTH_ROUTES = ["/login", "/registro"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const session = await decrypt(token);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
