import NewHostelDrawer from "@/components/drawers/new-hostel-drawer";
import { api } from "@/utils/trpc-server";
import { Box, Button, Heading, HStack, VStack } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

export default async function Page() {
  const data = await api.hostelList();
  return (
    <Box w={"full"}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Heading size={"2xl"}>All Hostels</Heading>

        <NewHostelDrawer>
          <Button size={"sm"}>
            <LuPlus />
            Add
          </Button>
        </NewHostelDrawer>
      </HStack>

      <VStack alignItems={"start"} py={"6"}>
        {data.data.map((h) => (
          <HStack key={h.id}>{h.hostel_name}</HStack>
        ))}
      </VStack>
    </Box>
  );
}
