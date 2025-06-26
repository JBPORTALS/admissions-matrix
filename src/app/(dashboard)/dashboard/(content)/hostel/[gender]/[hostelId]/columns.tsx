"use client";

import HostelAdmissionDetailsDrawer from "@/components/drawers/hostel-admission-details-drawer";
import { HostelStudent } from "@/server/routers";
import { Link as ChakraLink, IconButton } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight } from "react-icons/lu";

export const columns: ColumnDef<HostelStudent>[] = [
  {
    accessorKey: "id",
    header: "App. ID",
  },
  {
    accessorKey: "student_name",
    header: "Name",
    cell(props) {
      const original = props.row.original;

      return (
        <HostelAdmissionDetailsDrawer>
          <ChakraLink>{original.student_name}</ChakraLink>
        </HostelAdmissionDetailsDrawer>
      );
    },
  },
  {
    accessorKey: "college",
    header: "College",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    id: "view",
    header: "View",
    cell(props) {
      return (
        <HostelAdmissionDetailsDrawer>
          <IconButton variant={"ghost"}>
            <LuArrowRight />
          </IconButton>
        </HostelAdmissionDetailsDrawer>
      );
    },
  },
];
