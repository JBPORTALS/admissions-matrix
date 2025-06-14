"use client";

import BusAdmissionDetailsDrawer from "@/components/drawers/bus-admission-details-drawer";
import ViewAdmissionDetailsModal from "@/components/drawers/ViewAdmissionDetailsModal";
import { IconButton, Link } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight } from "react-icons/lu";

export type Payment = {
  admission_id: string;
  sl_no: string;
  name: string;
  father_name: string;
  phone_no: string;
  fee_fixed: string;
  fee_paid: string;
  remaining_amount: string;
  referenced_by: string;
  approved_by: string;
  acadyear: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "admission_id",
    header: "App No.",
    cell(props) {
      return (
        <BusAdmissionDetailsDrawer>
          <Link>{props.row.getValue("admission_id")}</Link>
        </BusAdmissionDetailsDrawer>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      return (
        <BusAdmissionDetailsDrawer>
          <Link>{props.row.getValue("name")}</Link>
        </BusAdmissionDetailsDrawer>
      );
    },
  },

  {
    accessorKey: "phone_no",
    header: "Phone No.",
  },
  {
    accessorKey: "fee_fixed",
    header: "Boarding Point",
  },
  {
    id: "menu",
    header: "View",
    cell(props) {
      return (
        <BusAdmissionDetailsDrawer>
          <IconButton variant={"ghost"} aria-label="View">
            <LuArrowRight />
          </IconButton>
        </BusAdmissionDetailsDrawer>
      );
    },
  },
];
