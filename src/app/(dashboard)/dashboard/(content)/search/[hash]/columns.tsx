"use client";

import ViewAdmissionDetailsModal from "@/components/drawers/ViewAdmissionDetailsModal";
import { IconButton, Link, Tag } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight, LuCheck } from "react-icons/lu";

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
  status: "APPROVED" | "NOT APPROVED";
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
          isUnapproved={props.row.original.status !== "APPROVED"}
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
          isUnapproved={props.row.original.status !== "APPROVED"}
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
    accessorKey: "status",
    header: "Status",
    cell(props) {
      const status = props.row.original.status;

      if (status === "NOT APPROVED")
        return (
          <Tag.Root size={"sm"} colorPalette={"orange"} variant={"outline"}>
            <Tag.Label>Not Approved</Tag.Label>
          </Tag.Root>
        );
      if (status === "APPROVED")
        return (
          <Tag.Root size={"sm"} colorPalette={"blue"} variant={"surface"}>
            <Tag.Label>Approved</Tag.Label>
            <Tag.EndElement>
              <LuCheck />
            </Tag.EndElement>
          </Tag.Root>
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
          isUnapproved={props.row.original.status !== "APPROVED"}
        >
          <IconButton variant={"ghost"} aria-label="View">
            <LuArrowRight />
          </IconButton>
        </ViewAdmissionDetailsModal>
      );
    },
  },
];
