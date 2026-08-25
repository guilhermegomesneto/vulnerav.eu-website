import type { EmbedProvider } from "@/generated/prisma/client";

type ParsedEmbed = { provider: EmbedProvider; externalId: string };

/**
 * Extrai o provider + id de uma URL do YouTube/Instagram, validado no
 * servidor. Nunca renderize HTML/iframe vindo do usuário — só o
 * provider+id validados aqui, que o componente de embed transforma na
 * src de um iframe a partir de um template fixo.
 */
export function parseEmbedUrl(url: string): ParsedEmbed | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") return null;

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.searchParams.get("v");
    if (id && /^[\w-]{11}$/.test(id)) return { provider: "YOUTUBE", externalId: id };
    return null;
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    if (/^[\w-]{11}$/.test(id)) return { provider: "YOUTUBE", externalId: id };
    return null;
  }

  if (host === "instagram.com") {
    const match = parsed.pathname.match(/^\/(reel|p)\/([\w-]+)\/?$/);
    if (match) return { provider: "INSTAGRAM", externalId: match[1] + ":" + match[2] };
    return null;
  }

  return null;
}

/**
 * Monta a src do iframe a partir de dados já validados (provider + externalId
 * vindos do banco) — nunca a partir de uma URL crua fornecida pelo usuário.
 */
export function embedSrc({ provider, externalId }: ParsedEmbed) {
  switch (provider) {
    case "YOUTUBE":
      return `https://www.youtube-nocookie.com/embed/${externalId}`;
    case "INSTAGRAM": {
      // externalId no formato "p:ABC123" ou "reel:ABC123" — ver parseEmbedUrl.
      const [kind, id] = externalId.split(":");
      return `https://www.instagram.com/${kind}/${id}/embed`;
    }
  }
}
