import { db } from "@/lib/db";
import { PostListItem } from "@/app/_components/post-list-item";

// TODO: post real ainda não existe (sem tela de escrever publicada). Remover
// esse mock assim que houver conteúdo de verdade — hoje ele só entra quando
// a query real volta vazia, pra dar pra visualizar o layout.
const MOCK_POSTS = [
  {
    id: "mock-1",
    slug: "mock-1",
    title: "Lorem ipsum dolor sit amet",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus.",
    author: "fulano",
    createdAt: new Date("2026-08-20"),
  },
  {
    id: "mock-2",
    slug: "mock-2",
    title: "Consectetur adipiscing elit",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    author: "ciclana",
    createdAt: new Date("2026-08-14"),
  },
  {
    id: "mock-3",
    slug: "mock-3",
    title: "Sed ut perspiciatis unde omnis",
    excerpt:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.",
    author: "beltrano",
    createdAt: new Date("2026-08-02"),
  },
] as const;

export default async function Home() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      createdAt: true,
      author: { select: { nickname: true } },
    },
  });

  const items =
    posts.length > 0
      ? posts.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.body,
          author: post.author.nickname,
          createdAt: post.createdAt,
        }))
      : MOCK_POSTS.map((post) => ({ ...post, author: post.author }));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-8 pt-8 pb-16">
      <p className="mx-auto max-w-xl text-center font-body text-xl italic leading-relaxed text-ink">
        eu quase me perdi.
        <br />
        agora me conto em voz alta.
      </p>

      <ul className="mx-auto mt-8 flex w-full max-w-3xl flex-col">
        {items.map((post) => (
          <li key={post.id} className="border-b border-line py-12 first:pt-0 last:border-b-0">
            <PostListItem
              slug={post.slug}
              title={post.title}
              author={post.author}
              createdAt={post.createdAt}
              excerpt={post.excerpt}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
