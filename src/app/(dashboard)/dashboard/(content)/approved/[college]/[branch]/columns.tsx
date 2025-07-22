"use client";

import ViewAdmissionDetailsModal from "@/components/drawers/ViewAdmissionDetailsModal";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNowStrict, isDate } from "date-fns";
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
    accessorKey: "sl_no",
    header: "Sl No.",
  },
  {
    accessorKey: "admission_id",
    header: "App No.",
    cell(props) {
      return (
        <ViewAdmissionDetailsModal
          admissionno={props.row.original.admission_id}
        >
          <Link>{props.row.getValue("admission_id")}</Link>
        </ViewAdmissionDetailsModal>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      return (
        <ViewAdmissionDetailsModal
          admissionno={props.row.original.admission_id}
        >
          <Link>{props.row.getValue("name")}</Link>
        </ViewAdmissionDetailsModal>
      );
    },
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
    accessorKey: "father_no",
    header: "Alt Phone No.",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell(props) {
      return (
        <time>
          {isDate(new Date(props.getValue() as string)) ||
          (props.getValue() as string) === "0000-00-00"
            ? format(new Date(props.getValue() as string), "dd MMM, yyyy")
            : "Invalid Date"}
        </time>
      );
    },
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
    cell(props) {
      return (
        <Box
          w={"100px"}
          maxW={"100px"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
          textWrap={"nowrap"}
        >
          {props.getValue() as string}
        </Box>
      );
    },
  },
  {
    accessorKey: "approved_by",
    header: "Approved By",
  },
  {
    id: "menu",
    header: "View",
    cell(props) {
      return (
        <ViewAdmissionDetailsModal
          admissionno={props.row.original.admission_id}
        >
          <IconButton variant={"ghost"} aria-label="View">
            <LuArrowRight />
          </IconButton>
        </ViewAdmissionDetailsModal>
      );
    },
  },
];
