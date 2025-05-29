"use client";

import { useSupabase } from "@/app/supabase-provider";
import ISelect from "@/components/ui/utils/ISelect";
import { useAppSelector } from "@/store";
import { trpc } from "@/utils/trpc-cleint";
import {
  Badge,
  Box,
  Button,
  Center,
  FormatNumber,
  HStack,
  Heading,
  Icon,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  Timeline,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { LuCalendar, LuFileDown } from "react-icons/lu";

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
    <VStack w={"full"}>
      {/** Header */}
      <HStack
        justifyContent={"space-between"}
        w={"full"}
        borderBottomColor={"border"}
        borderBottomWidth={"thin"}
        h={"16"}
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
          {ucollege && (
            <Heading size={"lg"} color={"fg"} fontWeight={"semibold"}>
              Seat Matrix - {ucollege}
            </Heading>
          )}
        </HStack>
        <Box>
          {ucollege && (
            <Button size={"sm"} asChild variant={"surface"}>
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

      <VStack
        w={"full"}
        px={"5"}
        pt={"5"}
        justifyContent={"start"}
        alignItems={"start"}
        gap={0}
      >
        {/* displaying admin childrens */}
        {ucollege && user.user?.college && sdata && (
          <Timeline.Root size="lg" variant="subtle" maxW="2xl">
            {sdata.map((history: any, index) => {
              return (
                <Timeline.Item key={history.date + index}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>
                      <Icon fontSize="xs">
                        <LuCalendar />
                      </Icon>
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>
                      {moment(history.date).format("MMM DD, YYYY")}
                    </Timeline.Title>
                    <HStack alignItems={"start"}>
                      <Stat.Root>
                        <Stat.Label>Total Seats</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber value={history.total} style="decimal" />
                        </Stat.ValueText>
                      </Stat.Root>

                      <Stat.Root>
                        <Stat.Label>Total Admissions</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={history.allotted_seats}
                            style="decimal"
                          />
                        </Stat.ValueText>
                      </Stat.Root>

                      <Stat.Root>
                        <Stat.Label>Today Admissions</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={history.today_admissions}
                            style="decimal"
                          />
                        </Stat.ValueText>
                        {history.today_admissions > 0 && (
                          <Badge colorPalette="green" variant="plain" px="0">
                            <Stat.UpIndicator />
                            Got increased
                          </Badge>
                        )}
                      </Stat.Root>

                      <Stat.Root>
                        <Stat.Label>Remaining Admissions</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={history.remaining_seats}
                            style="decimal"
                          />
                        </Stat.ValueText>
                      </Stat.Root>
                    </HStack>
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline.Root>
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
  );
}
