"use client";

import { Link as ChakraLink, IconButton } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight } from "react-icons/lu";

export type College = {
  college: string;
  branch: string;
  appId: string;
  name: string;
  phone: string;
  fatherName: string;
  fatherPhone: string;
};

export const columns: ColumnDef<College>[] = [
  {
    accessorKey: "appId",
    header: "App. ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const original = props.row.original;

      return <ChakraLink>{original.name}</ChakraLink>;
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "phone",
    header: "Student Phone",
  },
  {
    accessorKey: "fatherName",
    header: "Father Name",
  },
  {
    accessorKey: "fatherPhone",
    header: "Father Phone",
  },
  {
    id: "view",
    header: "View",
    cell(props) {
      return (
        <IconButton variant={"ghost"}>
          <LuArrowRight />
        </IconButton>
      );
    },
  },
];
