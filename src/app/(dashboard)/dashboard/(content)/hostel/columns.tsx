"use client";

import { Link as ChakraLink } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export type College = {
  college: string;
  totalApproved: string;
  totalEnquiries: string;
  overall: string;
  available: string;
  filledPercentage: number;
};

export const columns: ColumnDef<College>[] = [
  {
    accessorKey: "college",
    header: "College",
    cell(props) {
      const original = props.row.original;
      const searchParams = useSearchParams();
      const queryString = searchParams.toString();

      return (
        <ChakraLink asChild>
          <Link
            href={`/dashboard/hostel/${original.college}${
              queryString && "?" + queryString
            }`}
          >
            {original.college}
          </Link>
        </ChakraLink>
      );
    },
  },
  {
    accessorKey: "totalApproved",
    header: "Total Approved",
  },
  {
    accessorKey: "totalEnquiries",
    header: "Total Enquiries",
  },
  {
    accessorKey: "overall",
    header: "Overall",
  },
  {
    accessorKey: "available",
    header: "Availalbe",
  },
  {
    accessorKey: "filledPercentage",
    header: "Filled Percentage",
  },
];
