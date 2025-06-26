import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { GenderSegmentControl } from "./gender-segment-control";
import { LuPlus } from "react-icons/lu";
import AddHostelAdmissionDetailsDrawer from "@/components/drawers/add-hostel-addmission-drawer";

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

        <HStack gap={"6"}>
          <GenderSegmentControl />

          <AddHostelAdmissionDetailsDrawer>
            <Button>
              New <LuPlus />
            </Button>
          </AddHostelAdmissionDetailsDrawer>
        </HStack>
      </HStack>
      {children}
    </React.Fragment>
  );
}
