"use client";

import { useActionState } from "react";
import { createPost, type PostActionState } from "@/app/actions/post";
import { inputClass } from "@/app/_components/ui";
import { Button } from "@/app/_components/button";
import { ErrorToast } from "@/app/_components/error-toast";

const initialState: PostActionState = { status: "idle" };

export function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <ErrorToast state={state} />
      <input
        name="title"
        placeholder="título"
        required
        aria-invalid={!!fieldErrors?.title}
        className={inputClass}
      />
      <textarea
        name="body"
        placeholder="escreva aqui..."
        required
        rows={14}
        aria-invalid={!!fieldErrors?.body}
        className={`${inputClass} resize-y`}
      />
      <input
        name="embedUrl"
        placeholder="link do YouTube ou Instagram (opcional)"
        aria-invalid={!!fieldErrors?.embedUrl}
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Publicando..." : "Publicar"}
      </Button>
    </form>
  );
}
