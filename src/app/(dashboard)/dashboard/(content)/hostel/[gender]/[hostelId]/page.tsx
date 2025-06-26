"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import React from "react";
import { Breadcrumb } from "@chakra-ui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc-cleint";

export default function Page() {
  const { gender, hostelId } = useParams<{
    hostelId: string;
    gender: string;
  }>();
  const { data: hostel } = trpc.getHostelById.useQuery({ hostelId });
  const { data } = trpc.getHostelMatrixBranch.useQuery({ hostelId });

  return (
    <React.Fragment>
      <Breadcrumb.Root variant={"underline"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={"/dashboard/hostel/" + gender}>Overall</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>
              {hostel?.hostel_name}
            </Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <DataTable columns={columns} data={data ?? []} />
    </React.Fragment>
  );
}
