"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import React from "react";
import { Breadcrumb } from "@chakra-ui/react";
import Link from "next/link";
import { genderSearchParams } from "@/utils/searchParms";
import { useQueryStates } from "nuqs";
import { useParams } from "next/navigation";

export default function Page() {
  const [{ gender }] = useQueryStates(genderSearchParams);
  const params = useParams<{ college: string }>();

  return (
    <React.Fragment>
      <Breadcrumb.Root variant={"underline"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href={"/dashboard/hostel" + "?gender=" + gender}>
                Overall
              </Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>{params.college}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <DataTable
        columns={columns}
        data={[
          {
            appId: "234",
            name: "Mano",
            branch: "AIML",
            college: "KSIT",
            fatherName: "Pino",
            fatherPhone: "938893930",
            phone: "939304049",
          },
        ]}
      />
    </React.Fragment>
  );
}
