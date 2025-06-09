"use client";

import ViewAdmissionDetailsModal from "@/components/drawers/ViewAdmissionDetailsModal";
import { Avatar, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight } from "react-icons/lu";

export type UnApproved = {
  admission_id: string;
  sl_no: string;
  name: string;
  email: string;
  father_name: string;
  phone_no: string;
  fee_fixed: string;
  fee_paid: string;
  remaining_amount: string;
  referenced_by: string;
  approved_by: string;
  acadyear: string;
};

export const columns: ColumnDef<UnApproved>[] = [
  {
    accessorKey: "slno",
    header: "Sl No.",
  },
  {
    accessorKey: "admission_id",
    header: "App No.",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const row = props.row.original;
      return (
        <HStack>
          <Avatar.Root size={"sm"}>
            <Avatar.Icon />
          </Avatar.Root>
          <VStack gap={"0"} alignItems={"start"}>
            <Text>{row.name}</Text>
            <Text fontSize={"sm"} color={"fg.muted"}>
              {row.email}
            </Text>
          </VStack>
        </HStack>
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
    header: "View",
    cell(props) {
      return (
        <ViewAdmissionDetailsModal
          admissionno={props.row.original.admission_id}
          isUnapproved
        >
          <IconButton variant={"ghost"} aria-label="View">
            <LuArrowRight />
          </IconButton>
        </ViewAdmissionDetailsModal>
      );
    },
  },
];
