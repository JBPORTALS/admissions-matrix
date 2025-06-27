import { DataTable } from "@/components/ui/data-table";
import { api } from "@/utils/trpc-server";
import { Box, Breadcrumb, Button, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { columns } from "./columns";

export default async function Page({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;
  const route = await api.busRouteView({ id: routeId });
  const data = await api.busBoardingList({ routeId });

  return (
    <Box w={"full"} spaceY={"6"}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Breadcrumb.Root variant={"underline"}>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link href={"/dashboard/settings/bus"}>All Routes</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>
                {route.route_no}-{route.last_point}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <Button size={"xs"}>
          <LuPlus />
          New Boarding Point
        </Button>
      </HStack>

      <DataTable columns={columns} data={data.data} />
    </Box>
  );
}
