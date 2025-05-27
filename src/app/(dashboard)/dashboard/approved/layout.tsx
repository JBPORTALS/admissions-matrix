import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Box>
        <Box>
          <Heading size={"2xl"} fontWeight={"medium"}>
            Approved Seats
          </Heading>
          <Text fontSize={"sm"} color={"fg.muted"}>
            {"Manage admission details of students approved by the college"}
          </Text>
        </Box>
      </Box>
      {children}
    </React.Fragment>
  );
}
