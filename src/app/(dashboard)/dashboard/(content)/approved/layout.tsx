import { MIFModalButton } from "@/components/drawers/MIFModal";
import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <HStack justifyContent={"space-between"} w={"full"}>
        <Box>
          <Heading size={"2xl"} fontWeight={"medium"}>
            Approved Seats
          </Heading>
          <Text fontSize={"sm"} color={"fg.muted"}>
            {"Manage admission details of students approved by the college"}
          </Text>
        </Box>

        <MIFModalButton />
      </HStack>
      {children}
    </React.Fragment>
  );
}
