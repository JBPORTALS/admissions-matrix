import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import { Breadcrumb } from "@chakra-ui/react";
import { api } from "@/utils/trpc-server";

export default async function Page({
  params,
}: {
  params: Promise<{ gender: "MALE" | "FEMALE" }>;
}) {
  const { gender } = await params;
  const data = await api.getHostelOverallMatrix({ gender });

  return (
    <React.Fragment>
      <Breadcrumb.Root variant={"underline"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Overall</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <DataTable data={data} columns={columns} />
    </React.Fragment>
  );
}
