import React from "react";
import { Box, Heading, HStack, Separator } from "@chakra-ui/react";
import { Navbar } from "./nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Box>
        <Heading size={"2xl"} fontWeight={"medium"}>
          Settings
        </Heading>
      </Box>
      <Separator />
      <HStack>
        <Navbar />
        {children}
      </HStack>
    </React.Fragment>
  );
}
