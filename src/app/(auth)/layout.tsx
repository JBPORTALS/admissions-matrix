import { auth } from "@/utils/auth-server";
import { Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await auth();

  if (isLoggedIn) redirect("/dashboard");

  return (
    <Flex minH={"100svh"} align={"center"} justify={"center"}>
      {children}
    </Flex>
  );
}
