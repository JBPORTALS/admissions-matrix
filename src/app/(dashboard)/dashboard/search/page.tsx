"use client";
import { Center, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function page() {
  const [data, setData] = useState();
  const [isError, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();

  if (!params.has("type") || params.get("type") == "")
    return (
      <Center h={"full"} pb={"36"}>
        <Heading size={"lg"}>Not Valid Search Request !</Heading>
      </Center>
    );

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
  }, [params.get("type"), params.get("date"), params.get("source")]);

  if (isError)
    return (
      <Center h={"full"} pb={"44"}>
        <VStack>
          <AiOutlineSearch className="text-brand text-6xl" />
          <Heading size={"lg"}>{isError}</Heading>
        </VStack>
      </Center>
    );

  return <VStack></VStack>;
}
