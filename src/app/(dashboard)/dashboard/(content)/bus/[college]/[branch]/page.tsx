"use client";
import { Breadcrumb } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc-cleint";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import React from "react";

export default function Home() {
  const params = useParams<{ college: string; branch: string }>();
  const { data, isLoading } = trpc.searchClass.useQuery({
    acadyear: process.env.NEXT_PUBLIC_ACADYEAR!,
    branch: params.branch,
    college: params.college,
  });

  return (
    <React.Fragment>
      {/* BreadCrumbs  */}
      <Breadcrumb.Root variant={"underline"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={"/dashboard/bus"}>Overall</Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={`/dashboard/bus/${params.college}`}>
                {params.college}
              </Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>{params.branch}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <DataTable columns={columns} data={data?.data ?? []} />
    </React.Fragment>
  );
}
