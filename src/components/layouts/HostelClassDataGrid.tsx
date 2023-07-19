"use client";

import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import { hostelcolumns } from "../mock-data/admission-meta";
import { Center, Heading, VStack } from "@chakra-ui/react";
import "../../app/globals.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function HostelClassDataGrid() {
  const data = useAppSelector(
    (state) => state.admissions.search_class.data
  ) as [];
  const Error = useAppSelector(
    (state) => state.admissions.search_class.error
  ) as null | string;
  
  return (
    <VStack h={"80vh"} w={"100vw"}>
      {data.length > 0 ? (
        <AgGridReact
          alwaysShowHorizontalScroll
          animateRows={true}
          className="w-full h-full  pb-6 ag-theme-material"
          rowData={data as any}
          columnDefs={hostelcolumns as any}
        />
      ) : data.length == 0 && Error ? (
        <Center h={"80%"}>
          <Heading size={"lg"}>{Error}</Heading>
        </Center>
      ) : null}
    </VStack>
  );
}

export default HostelClassDataGrid;
