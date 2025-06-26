import NewBusAdmissionDetailsDrawer from "@/components/drawers/new-bus-admision-drawer";
import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { LuPlus } from "react-icons/lu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <HStack justifyContent={"space-between"} w={"full"}>
        <Box>
          <Heading size={"2xl"} fontWeight={"medium"}>
            Bus Admissions Entry
          </Heading>
          <Text fontSize={"sm"} color={"fg.muted"}>
            {"Manage bus admission details of students."}
          </Text>
        </Box>

        <NewBusAdmissionDetailsDrawer>
          <Button>
            New <LuPlus />
          </Button>
        </NewBusAdmissionDetailsDrawer>
      </HStack>
      {children}
    </React.Fragment>
  );
}
