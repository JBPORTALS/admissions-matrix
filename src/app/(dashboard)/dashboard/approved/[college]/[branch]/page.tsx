"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";
import { useAppDispatch } from "@/hooks";
import { fetchSearchClass } from "@/store/admissions.slice";
import { Center, Heading, Stack, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useParams } from "next/navigation";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";
import { AgGridReact } from "ag-grid-react";
import { trpc } from "@/utils/trpc-cleint";
import { columns } from "@/components/mock-data/admission-meta";

export default function Home() {
  const router = useParams();
  const { data } = trpc.searchClass.useQuery({
    acadyear: process.env.NEXT_PUBLIC_ACADYEAR!,
    branch: router.branch as string,
    college: router.college as string,
  });

  return (
    <VStack h={"77vh"} w={"full"} pr={"3"} className="ag">
      <VStack h={"80vh"} w={"100%"}>
        {data?.data && data.data.length > 0 ? (
          <AgGridReact
            alwaysShowHorizontalScroll
            animateRows={true}
            className="w-full h-full  pb-6 ag-theme-material"
            rowData={data.data as any}
            columnDefs={columns as any}
          />
        ) : data && !data.ok ? (
          <Center h={"80%"}>
            <Heading size={"lg"}>{data?.data.msg}</Heading>
          </Center>
        ) : null}
      </VStack>
    </VStack>
  );
}
