import { redirect } from "next/navigation";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = createServerComponentSupabaseClient({
    headers,
    cookies,
  });
  const { data } = await auth.getSession();
  if (!data.session) redirect("/signin");
  return <>{children}</>;
}
