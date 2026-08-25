import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionToken, decrypt } from "@/lib/session";
import { db } from "@/lib/db";

export const verifySession = cache(async () => {
  const token = await getSessionToken();
  const payload = await decrypt(token);

  if (!payload?.userId) {
    redirect("/login");
  }

  return { userId: payload.userId };
});

// Como o proxy.ts (optimistic check) só lê o cookie, use esta versão quando
// só precisar saber se há sessão, sem forçar redirect (ex: layouts públicos).
export const getOptionalSession = cache(async () => {
  const token = await getSessionToken();
  const payload = await decrypt(token);
  return payload?.userId ? { userId: payload.userId } : null;
});

export const getUser = cache(async () => {
  const session = await getOptionalSession();
  if (!session) return null;

  return db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, role: { select: { name: true } } },
  });
});

export const getPermissions = cache(async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: {
        select: { permissions: { select: { permission: { select: { key: true } } } } },
      },
    },
  });

  return new Set(user?.role.permissions.map((p) => p.permission.key) ?? []);
});

export async function requirePermission(key: string) {
  const session = await verifySession();
  const permissions = await getPermissions(session.userId);

  if (!permissions.has(key)) {
    redirect("/painel");
  }

  return session;
}
