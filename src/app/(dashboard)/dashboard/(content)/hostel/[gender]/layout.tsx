import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { GenderSegmentControl } from "./gender-segment-control";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Heading size={"2xl"} fontWeight={"medium"}>
            Hostel Admissions
          </Heading>
          <Text fontSize={"sm"} color={"fg.muted"}>
            Manage hostel students admmission details
          </Text>
        </Box>

        <GenderSegmentControl />
      </HStack>
      {children}
    </React.Fragment>
  );
}
