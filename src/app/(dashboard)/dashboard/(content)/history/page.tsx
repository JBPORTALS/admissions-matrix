"use client";
import { useSupabase } from "@/app/supabase-provider";
import ISelect from "@/components/ui/utils/ISelect";
import { useAppSelector } from "@/store";
import { trpc } from "@/utils/trpc-cleint";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { LuFileDown } from "react-icons/lu";

export default function UnApproved() {
  const user = useSupabase();
  const [ucollege, setCollege] = useState<string | undefined>(
    ["MANAGEMENT", "KSPT"].includes(user.user?.college ?? "")
      ? ""
      : user.user?.college
  );
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const {
    data: sdata,
    isLoading,
    isError,
    error,
  } = trpc.seatMatrix.useQuery(
    { college: ucollege ?? "", acadYear },
    {
      enabled:
        !!ucollege || ["MANAGEMENT", "KSPT"].includes(user.user?.college ?? ""),
    }
  );

  return (
    <VStack pb={"5"} w={"full"}>
      <HStack
        justifyContent={"space-between"}
        spaceX={"3"}
        px={"5"}
        pb={"2"}
        w={"full"}
        borderBottomColor={"border"}
        borderBottomWidth={"thin"}
      >
        <HStack>
          {["MANAGEMENT", "KSPT"].includes(user.user?.college ?? "") && (
            <ISelect
              placeHolder="Select College"
              value={ucollege}
              onChange={(value) => setCollege(value)}
              options={[
                { value: "KSIT", option: "KSIT" },
                { value: "KSPT", option: "KSPT" },
                { value: "KSPU", option: "KSPU" },
                { value: "KSDC", option: "KSDC" },
                { value: "KSSEM", option: "KSSEM" },
              ]}
            />
          )}
        </HStack>
        {ucollege && (
          <Heading size={"lg"} color={"gray.700"} fontWeight={"semibold"}>
            Seat Matrix - {ucollege}
          </Heading>
        )}
        <Box>
          {ucollege && (
            <Button size={"sm"} asChild colorPalette="teal" variant={"ghost"}>
              <Link
                target="_blank"
                href={
                  process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                  "seatmatrixdownload.php?college=" +
                  ucollege
                }
              >
                <LuFileDown /> Download Matrix
              </Link>
            </Button>
          )}
        </Box>
      </HStack>

      <VStack w={"full"} gap={0}>
        <VStack gap={0} px={"10"} w={"full"} justifyContent={"start"}>
          {/* displaying admin childrens */}
          {ucollege && user.user?.college && sdata && (
            <ol className="relative border-l py-10 pb-16 border-gray-200 h-fit w-full">
              {sdata.map((history: any, index) => {
                return (
                  <li
                    key={history.date + index}
                    className="mb-10 ml-6 border-gray-200 border-b pb-5"
                  >
                    <h3 className="flex pb-3 px-3 items-center mb-1 text-lg font-semibold text-gray-900 ">
                      {moment(history.date).format("MMM DD, YYYY")}
                    </h3>
                    <StatGroup width={"50%"} px={"0"}>
                      <Stat.Root size={"md"}>
                        <Stat.Label textAlign={"center"}>
                          Total Seats
                        </Stat.Label>
                        <Stat.ValueUnit
                          fontSize={"3xl"}
                          textAlign={"center"}
                          color={"purple.700"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.total}
                        </Stat.ValueUnit>
                      </Stat.Root>
                      <Stat.Root>
                        <StatLabel textAlign={"center"}>
                          Total Admissions
                        </StatLabel>
                        <Stat.ValueUnit
                          fontSize={"3xl"}
                          textAlign={"center"}
                          color={"green.500"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.allotted_seats}
                        </Stat.ValueUnit>
                      </Stat.Root>
                      <Stat.Root>
                        <StatLabel textAlign={"center"}>
                          Today Admissions
                        </StatLabel>
                        <Stat.ValueUnit
                          textAlign={"center"}
                          fontSize={"3xl"}
                          color={"teal.700"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.today_admissions}
                        </Stat.ValueUnit>
                        <StatHelpText textAlign={"center"}>
                          {history.today_admissions > 0 && (
                            <>
                              <Stat.UpIndicator /> Got increased
                            </>
                          )}
                        </StatHelpText>
                      </Stat.Root>
                      <Stat.Root>
                        <StatLabel textAlign={"center"}>
                          Remaining Seats
                        </StatLabel>
                        <Stat.ValueUnit
                          textAlign={"center"}
                          fontSize={"3xl"}
                          color={"red.600"}
                          fontWeight={"semibold"}
                          textShadow={"lg"}
                        >
                          {history.remaining_seats}
                        </Stat.ValueUnit>
                      </Stat.Root>
                    </StatGroup>
                  </li>
                );
              })}
            </ol>
          )}
        </VStack>
        {isError && (
          <Center h={"80%"}>
            <Heading size={"lg"}>{error.message}</Heading>
          </Center>
        )}
        {isLoading && (
          <Center h={"80%"}>
            <Spinner size={"xl"} />
          </Center>
        )}
      </VStack>
    </VStack>
  );
}
