import { auth } from "@/utils/auth-server";
import { redirect } from "next/navigation";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await auth();

  if (isLoggedIn) redirect("/dashboard");
  return <>{children}</>;
}
