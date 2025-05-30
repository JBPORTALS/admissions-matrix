"use client";
import { DataTable } from "@/components/ui/data-table";
import { useAppSelector } from "@/store";
import { Center, Heading, Skeleton, VStack } from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { columns } from "./columns";

export default function SearchPage() {
  const [data, setData] = useState<[]>();
  const [isError, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const p = useParams();
  const acadyear = useAppSelector((state) => state.admissions.acadYear);

  const query = params.get("query") ?? "";
  const en_date = params.get("en_date") ?? "";
  const ap_date = params.get("ap_date") ?? "";
  const src = params.get("src") ?? "";

  async function getSearchData() {
    setIsLoading(true);
    setData([]);
    try {
      const formData = new FormData();
      formData.append("en_date", en_date);
      formData.append("ap_date", ap_date);
      formData.append("src", src);
      formData.append("query", query);
      formData.append("acadyear", acadyear);
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + `findAll.php`,
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
    getSearchData();
  }, [p.hash, params]);

  if (!query && !en_date && !ap_date && !src)
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
        gap={0.5}
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
    <React.Fragment h={"80vh"} w={"full"}>
      <DataTable columns={columns} data={data ?? []} />
    </React.Fragment>
  );
}
