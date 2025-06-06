"use client";

import ViewAdmissionDetailsModal from "@/components/drawers/ViewAdmissionDetailsModal";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Box, IconButton } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { LuEllipsis, LuEye, LuFileDown } from "react-icons/lu";

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
    accessorKey: "sl_no",
    header: "Sl No.",
  },
  {
    accessorKey: "admission_id",
    header: "App No.",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "father_name",
    header: "Father Name",
  },
  {
    accessorKey: "phone_no",
    header: "Phone No.",
  },
  {
    accessorKey: "fee_fixed",
    header: "Fixed",
  },
  {
    accessorKey: "fee_paid",
    header: "Paid",
  },
  {
    accessorKey: "remaining_amount",
    header: "Payable",
  },
  {
    accessorKey: "referred_by",
    header: "Referred By",
  },
  {
    accessorKey: "approved_by",
    header: "Approved By",
  },
  {
    id: "menu",
    cell(props) {
      return (
        <MenuRoot closeOnSelect={false}>
          <MenuTrigger>
            <IconButton variant={"ghost"}>
              <LuEllipsis />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <ViewAdmissionDetailsModal
              admissionno={props.row.original.admission_id}
            >
              <MenuItem value="view">
                <LuEye /> <Box flex={"1"}> View</Box>
              </MenuItem>
            </ViewAdmissionDetailsModal>
            <MenuItem asChild value="download-provisional">
              <Link
                href={
                  process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                  `downloadprovisional.php?admissionno=${props.row.original.admission_id}&acadyear=${props.row.original.acadyear}`
                }
                target="_blank"
              >
                <LuFileDown /> <Box flex={"1"}>Download Provisional</Box>
              </Link>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      );
    },
  },
];
