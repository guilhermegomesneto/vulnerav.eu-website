import { getUser } from "@/lib/dal";
import { HeaderBar } from "@/app/_components/header-bar";

export async function Header() {
  const user = await getUser();

  return <HeaderBar user={user ? { nickname: user.nickname } : null} />;
}
