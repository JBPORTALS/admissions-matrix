"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";
import { useAppDispatch } from "@/hooks";
import {
  Progress,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Link } from "@chakra-ui/next-js";
import {useParams } from "next/navigation";
import axios from "axios";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useParams();
  const [data, setData] = useState({ data: [], error: null });

  useEffect(() => {
    async function fetchData() {
      const formData = new FormData();
      formData.append("college", router.college);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievebranchmatrix.php",
        {
          method: "POST",
          data: formData,
        }
      );
      if (response.status == 402)
        setData({ data: [], error: response.data?.msg });
      else setData({ data: response.data, error: null });
    }

    fetchData()
  }, [router.college]);

  return (
    <Stack h={"full"} w={"full"} pb={"5"} justifyContent={"start"}>
          <Table px={"5"} variant={"simple"} bg={"white"} colorScheme="facebook" size={"lg"}>
            <Tbody>
              <Tr>
                <Th>Branch</Th>
                <Th>Management Seats</Th>
                <Th>Allotted Seats</Th>
                <Th>Remaining Seats</Th>
                <Th>Filled Percentage</Th>
              </Tr>
              {data.data.length>0 && data.data?.map((value: any,index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Link href={"/dashboard/" + router.college+`/${value.branch}`}>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.branch}
                        </div>
                      </Link>
                    </Td>
                    <Td>{value.total}</Td>
                    <Td>{value.allotted_seats}</Td>
                    <Td>{value.remaining_seats}</Td>
                    <Td position={"relative"} zIndex={"base"}>
                    <h3 className="text-brand drop-shadow-lg text-lg font-medium">
                      {value.filled_percentage} %
                    </h3>
                    <Progress
                      w={"full"}
                      hasStripe
                      value={value.filled_percentage}
                      rounded={"full"}
                      isAnimated
                      isIndeterminate={value.filled_percentage == undefined}
                      size="sm"
                      colorScheme="blue"
                    />
                  </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
    </Stack>
  );
}
