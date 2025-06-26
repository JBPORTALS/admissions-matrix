"use client";

import { HostelCollege } from "@/server/routers";
import { Link as ChakraLink } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const columns: ColumnDef<HostelCollege>[] = [
  {
    accessorKey: "college",
    header: "Hostel",
    cell(props) {
      const original = props.row.original;
      const searchParams = useSearchParams();
      const queryString = searchParams.toString();

      return (
        <ChakraLink asChild>
          <Link
            href={`/dashboard/hostel/${original.gender.toUpperCase()}/${
              original.id
            }${queryString && "?" + queryString}`}
          >
            {original.hostel_name}
          </Link>
        </ChakraLink>
      );
    },
  },
  {
    accessorKey: "total_students",
    header: "Total Approved",
  },
  {
    accessorKey: "total_students",
    header: "Total Enquiries",
  },
  {
    accessorKey: "fee",
    header: "Overall",
  },
  {
    accessorKey: "intake",
    header: "Availalbe",
  },
  {
    accessorKey: "filledPercentage",
    header: "Filled Percentage",
  },
];
