import React from "react";
import { SidebarClient } from "./sidebar.client";
import { Box, HStack } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <HStack gap={"0"} alignItems={"start"}>
        <SidebarClient />

        <Box minW={"0"} w={"full"} px={"4"} py={"4"}>
          {children}
        </Box>
      </HStack>
    </React.Fragment>
  );
}
