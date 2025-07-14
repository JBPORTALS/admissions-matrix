import { DataTable } from "@/components/ui/data-table";
import { api } from "@/utils/trpc-server";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { columns } from "./columns";
import { NewBusRouteDrawer } from "@/components/drawers/new-bus-route-drawer";

export default async function Page() {
  const data = await api.busRouteList();

  console.log(data);

  return (
    <Box w={"full"} spaceY={"6"}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Heading size={"2xl"}>All Routes</Heading>

        <NewBusRouteDrawer>
          <Button size={"xs"}>
            <LuPlus />
            Add
          </Button>
        </NewBusRouteDrawer>
      </HStack>

      <DataTable columns={columns} data={data.data} />
    </Box>
  );
}
