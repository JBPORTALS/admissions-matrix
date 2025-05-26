"use client";
import {
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "@/store";
import Link from "next/link";

export default function Home() {
  const router = useParams();
  const [data, setData] = useState({ data: [], error: null });
  const [isLoading, setIsLoading] = useState(false);
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("acadyear", acadYear);
      formData.append("college", router.college as string);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievehostelbranch.php",
        {
          method: "POST",
          data: formData,
        }
      );
      if (response.status == 402)
        setData({ data: [], error: response.data?.msg });
      else setData({ data: response.data, error: null });
      setIsLoading(false);
    }

    fetchData();
  }, [router.college]);

  if (isLoading)
    return (
      <VStack gap={1} h={"full"} w={"full"}>
        <Skeleton w={"full"} h={"14"}></Skeleton>
        {new Array(8).fill(0).map((_, index) => {
          return <Skeleton key={index} w={"full"} h={"20"}></Skeleton>;
        })}
      </VStack>
    );

  return (
    <Stack h={"fit"} w={"full"} pb={"40"} justifyContent={"start"}>
      <Table
        px={"5"}
        variant={"simple"}
        bg={"white"}
        colorScheme="facebook"
        size={"lg"}
      >
        <TableBody>
          <TableRow
            position={"sticky"}
            top={"0"}
            zIndex={"banner"}
            borderBottom={"1px"}
            borderColor={"gray.300"}
            shadow={"sm"}
            className="backdrop-blur-sm bg-[rgba(255,255,255,0.6)] border-b-2"
          >
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Branch
              </div>
            </TableHeader>
            <TableHeader>
              <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                Total Students
              </div>
            </TableHeader>
          </TableRow>
          {data.data.length > 0 &&
            data.data?.map((value: any, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      href={
                        "/dashboard/hostel/" +
                        router.college +
                        `/${value.branch}`
                      }
                    >
                      <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                        {value.branch}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                      {value.total_students}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Stack>
  );
}
