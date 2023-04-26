"use client";
import { SearchColumns } from "@/components/mock-data/admission-meta";
import { Center, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./styles.css"

export default function Page() {
  const [data, setData] = useState();
  const [isError, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const p = useParams();

  async function getSearchData(
    type: "DATE" | "SOURCE",
    date: string,
    source: string
  ) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("source", source);
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
          `${type == "DATE" ? "searchbydate" : "searchbysource"}.php`,
        {
          method: "POST",
          data: formData,
        }
      );
      setData(res.data);
    } catch (e: any) {
      setError("No data found");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getSearchData(
      params.get("type") as "SOURCE" | "DATE",
      params.get("date")!,
      params.get("source")!
    );
    console.log(data);
  }, [p.hash]);

  if (!params.has("type") || params.get("type") == "")
    return (
      <Center h={"full"} pb={"36"}>
        <Heading size={"lg"}>Not Valid Search Request !</Heading>
      </Center>
    );

  if (isLoading)
    return (
      <VStack justifyContent={"start"} alignItems={"start"} h={"full"} spacing={0.5} w={"full"}>
        {new Array(9).fill(0).map((value, index) => {
          return <Skeleton w={"85%"} h={"12"} key={index} />;
        })}
      </VStack>
    );
  if (isError)
    return (
      <Center h={"full"} pb={"44"}>
        <VStack>
          <AiOutlineSearch className="text-brand text-6xl" />
          <Heading size={"lg"}>{isError}</Heading>
        </VStack>
      </Center>
    );

  return (
    <VStack h={"full"} w={"full"} className="ag-theme-material">
      <AgGridReact
        alwaysShowHorizontalScroll
        animateRows={true}
        className="w-full h-full  pb-6 ag-theme-material"
        rowData={data as any}
        columnDefs={SearchColumns as any}
      />
    </VStack>
  );
}
