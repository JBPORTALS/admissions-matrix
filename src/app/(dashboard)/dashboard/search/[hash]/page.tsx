"use client";
import { SearchColumns } from "@/components/mock-data/admission-meta";
import { Image } from "@chakra-ui/next-js";
import { Center, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [data, setData] = useState<[]>();
  const [isError, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const p = useParams();

  async function getSearchData(
    type: "ENQUIRY" | "SOURCE" | "APPROVAL" | "QUERY",
    date: string,
    source: string,
    query: string
  ) {
    setIsLoading(true);
    setData([]);
    try {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("source", source);
      formData.append("query", query);
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
          `${
            type == "ENQUIRY"
              ? "searchbydate"
              : type == "APPROVAL"
              ? "searchbyapprovaldate"
              : "searchbysource"
          }.php`,
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

  let render = 0;

  useEffect(() => {
    render++;

    if (render == 1) {
      getSearchData(
        params.get("type") as "SOURCE" | "ENQUIRY" | "APPROVAL" | "QUERY",
        params.get("date")!,
        params.get("source")!,
        params.get("query")!
      );
      render++;
    }

    console.log(render);
  }, [p.hash, params]);

  if (!params.has("type") || params.get("type") == "")
    return (
      <Center h={"full"} pb={"36"}>
        <Heading size={"lg"}>Not Valid Search Request !</Heading>
      </Center>
    );

  if (isLoading)
    return (
      <VStack
        justifyContent={"start"}
        alignItems={"start"}
        h={"full"}
        spacing={0.5}
        w={"100vw"}
      >
        {new Array(16).fill(0).map((value, index) => {
          return <Skeleton w={"100%"} h={"12"} key={index} />;
        })}
      </VStack>
    );

  if (isError)
    return (
      <Center h={"75vh"} pb={"28"}>
        <VStack>
          <Image
            src={"/empty-box.png"}
            width={120}
            height={120}
            alt={"empty-box"}
          />
          <Heading size={"lg"} color={"gray.600"} fontWeight={"semibold"}>
            {isError} !
          </Heading>
        </VStack>
      </Center>
    );

  return (
    <VStack
      h={"80vh"}
      overflow={"scroll"}
      w={"100vw"}
      className="ag-theme-material"
    >
      <AgGridReact
        alwaysShowHorizontalScroll
        animateRows={true}
        className="w-full h-full ag-theme-material"
        rowData={data as any}
        columnDefs={SearchColumns as any}
      />
    </VStack>
  );
}
