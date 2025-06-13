import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import { Breadcrumb } from "@chakra-ui/react";

export default function Page() {
  return (
    <React.Fragment>
      <Breadcrumb.Root variant={"underline"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Overall</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <DataTable
        data={[
          {
            college: "KSIT",
            available: "234",
            filledPercentage: 80,
            overall: "89",
            totalApproved: "9",
            totalEnquiries: "89",
          },
        ]}
        columns={columns}
      />
    </React.Fragment>
  );
}
