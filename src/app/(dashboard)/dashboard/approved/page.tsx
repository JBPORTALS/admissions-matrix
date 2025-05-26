"use client";
import {
  LinkBox,
  Progress,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "@/utils/trpc-cleint";
import { useSupabase } from "@/app/supabase-provider";
import Link from "next/link";
import {
  ProgressBar,
  ProgressLabel,
  ProgressRoot,
} from "@/components/ui/progress";

export default function Home() {
  const { user } = useSupabase();
  const { isLoading, data } = trpc.getOverallMatrix.useQuery(
    {
      acadyear: process.env.NEXT_PUBLIC_ACADYEAR!,
      college: user?.college ?? "",
    },
    { enabled: !!user?.college, queryHash: user?.college }
  );

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
    <Stack h={"fit"} pb={"40"} w={"full"} justifyContent={"start"}>
      <Table.Root px={"5"} striped size={"lg"}>
        <Table.Body px={"5"}>
          <Table.Row>
            <Table.ColumnHeader>College</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Management Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Allotted Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Total Enquiries
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Remaining Seats
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"right"}>
              Filled Percentage
            </Table.ColumnHeader>
          </Table.Row>
          {data &&
            data.length > 0 &&
            data?.map((value, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>
                    <LinkBox asChild _hover={{ textDecor: "underline" }}>
                      <Link href={"/dashboard/approved/" + value.college}>
                        {value.college}
                      </Link>
                    </LinkBox>
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>{value.total}</Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.allotted_seats}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.total_enquiries}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {value.remaining_seats}
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <ProgressRoot size={"xs"} striped>
                      <ProgressLabel>{value.filled_percentage} %</ProgressLabel>
                      <ProgressBar defaultValue={value.filled_percentage} />
                    </ProgressRoot>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
