"use client";
import { EditBusRouteDrawer } from "@/components/drawers/edit-bus-route-drawer";
import { IconButton, Link as ChakraLink, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { LuPanelLeft } from "react-icons/lu";

type BusRoute = {
  created_at: string;
  driver_name: string;
  driver_number: string;
  id: string;
  last_point: string;
  route_no: string;
  updated_at: string;
};

export const columns: ColumnDef<BusRoute>[] = [
  {
    accessorKey: "route_no",
    header: "Route No",
    cell(props) {
      return (
        <ChakraLink asChild>
          <Link href={`/dashboard/settings/bus/${props.row.original.id}`}>
            {props.getValue() as string}
          </Link>
        </ChakraLink>
      );
    },
  },
  {
    accessorKey: "last_point",
    header: "Last Point",
  },
  {
    accessorKey: "total_boarding_points",
    header: "Total Boarding Points",
  },
  {
    accessorKey: "driver_name",
    header: "Driver Name",
  },
  {
    accessorKey: "driver_number",
    header: "Driver Phone",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell(props) {
      return (
        <Text color={"fg.muted"} fontSize={"xs"}>
          {formatDistanceToNowStrict(new Date(props.row.original.created_at), {
            addSuffix: true,
          })}
        </Text>
      );
    },
  },

  {
    id: "view-button",
    cell(props) {
      return (
        <EditBusRouteDrawer id={props.row.original.id}>
          <IconButton
            opacity={0}
            _groupHover={{ opacity: 1 }}
            size={"sm"}
            variant={"ghost"}
          >
            <LuPanelLeft />
          </IconButton>
        </EditBusRouteDrawer>
      );
    },
  },
];
