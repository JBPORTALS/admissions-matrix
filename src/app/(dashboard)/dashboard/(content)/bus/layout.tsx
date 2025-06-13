import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Heading size={"2xl"} fontWeight={"medium"}>
            Bus
          </Heading>
          <Text fontSize={"sm"} color={"fg.muted"}>
            Manage hostel students admmission details
          </Text>
        </Box>
      </HStack>
      {children}
    </React.Fragment>
  );
}
