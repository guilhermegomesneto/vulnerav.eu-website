"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, type AuthActionState } from "@/app/actions/auth";
import { inputClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { ErrorToast } from "@/app/_components/error-toast";

const initialState: AuthActionState = { status: "idle" };

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state.status !== "success") return;
    router.refresh();
    if (onSuccess) onSuccess();
    else router.push("/");
  }, [state, router, onSuccess]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <ErrorToast state={state} />
      <input
        name="email"
        type="email"
        placeholder="e-mail"
        required
        autoComplete="email"
        aria-invalid={!!fieldErrors?.email}
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        placeholder="senha"
        required
        autoComplete="current-password"
        aria-invalid={!!fieldErrors?.password}
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
