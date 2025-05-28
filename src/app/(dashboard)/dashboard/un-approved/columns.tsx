"use client";

import ViewAdmissionDetailsModal from "@/components/drawers/ViewAdmissionDetailsModal";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Avatar,
  AvatarFallback,
  AvatarIcon,
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { LuEllipsis, LuEye, LuFileDown } from "react-icons/lu";

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
