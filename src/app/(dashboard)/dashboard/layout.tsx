import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { SideBar } from "@/components/side-bar";
import Header from "@/components/header";
import { auth } from "@/utils/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardMainLayout(props: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await auth();

  if (!isLoggedIn) redirect("/signin");

  return (
    <VStack gap={"0"} alignItems={"start"} minH={"100vh"}>
      <Header />
      <HStack
        alignItems={"start"}
        justifyItems={"start"}
        zIndex={1}
        w={"full"}
        flex={"1"}
        gap={"0"}
      >
        {/** SideBar contents */}
        <SideBar />

        {/** Main Content */}
        <Box w={"full"} flex={"1"} asChild minW={"0"}>
          <main>{props.children}</main>
        </Box>
      </HStack>
    </VStack>
  );
}
