"use client";

import BusAdmissionDetailsDrawer from "@/components/drawers/bus-admission-details-drawer";
import { IconButton, Link } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight } from "react-icons/lu";

export type BusStudent = {
  branch: string;
  bus_fee: string;
  fname: string;
  fphone_no: string;
  id: string;
  name: string;
  college: string;
  sphone_no: string;
  boarding_point_id: string;
  fee_fixed: string;
  fee_quoted: string;
  fee_paid: string;
};

export const columns: ColumnDef<BusStudent>[] = [
  {
    accessorKey: "id",
    header: "App No.",
    cell(props) {
      return (
        <BusAdmissionDetailsDrawer appId={props.row.original.id}>
          <Link>{props.row.getValue("id")}</Link>
        </BusAdmissionDetailsDrawer>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      return (
        <BusAdmissionDetailsDrawer appId={props.row.original.id}>
          <Link>{props.row.getValue("name")}</Link>
        </BusAdmissionDetailsDrawer>
      );
    },
  },

  {
    accessorKey: "sphone_no",
    header: "Phone No.",
  },
  {
    accessorKey: "bus_fee",
    header: "Bus Fee",
  },
  {
    id: "menu",
    header: "View",
    cell(props) {
      return (
        <BusAdmissionDetailsDrawer appId={props.row.original.id}>
          <IconButton variant={"ghost"} aria-label="View">
            <LuArrowRight />
          </IconButton>
        </BusAdmissionDetailsDrawer>
      );
    },
  },
];
