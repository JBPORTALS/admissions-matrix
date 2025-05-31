import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

export default function Page() {
  return (
    <React.Fragment>
      <Box>
        <Heading size={"2xl"} fontWeight={"medium"}>
          Hostel Admissions
        </Heading>
        <Text fontSize={"sm"} color={"fg.muted"}>
          Manage hostel students admmission details
        </Text>
      </Box>
    </React.Fragment>
  );
}
