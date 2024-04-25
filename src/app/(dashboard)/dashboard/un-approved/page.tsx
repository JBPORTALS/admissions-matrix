"use client";
import { UnAprrovedColumns } from "@/components/mock-data/admission-meta";
import ISelect from "@/components/ui/utils/ISelect";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchUnApprovedAdmissions,
} from "@/store/admissions.slice";
import { COLLEGES } from "@/utils/constants";
import { Button, Center, HStack, Heading, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";

export default function UnApproved() {
  const [ubranch, setBranch] = useState<string | undefined>("");
  const [ucollege, setCollege] = useState<string | undefined>("");
  const [branchList, setBranchList] = useState<[]>([]);
  const dispatch = useAppDispatch();
  const data = useAppSelector(
    (state) => state.admissions.unapproved_matrix.data
  ) as [];
  const Error = useAppSelector(
    (state) => state.admissions.unapproved_matrix.error
  );
  const acadyear = useAppSelector((state) => state.admissions.acadYear);

  useEffect(() => {
    if (ucollege !== undefined)
      dispatch(fetchBranchList({ college: ucollege })).then((value: any) => {
        setBranchList(value.payload);
      });
    setBranch("");
  }, [ucollege, dispatch]);

  useEffect(() => {
    ucollege &&
      ubranch &&
      dispatch(
        fetchUnApprovedAdmissions({
          college: ucollege,
          branch: ubranch,
        })
      );
  }, [ucollege, ubranch, dispatch]);

  return (
    <div className="h-full">
      <HStack
        justifyContent={"space-between"}
        className="w-full flex border-b py-2 space-x-3 px-5"
      >
        <HStack>
          <ISelect
            placeHolder="Select College"
            value={ucollege}
            onChange={(value) => setCollege(value)}
            options={COLLEGES}
          />
          {ucollege ? (
            <ISelect
              placeHolder="Select Branch"
              value={ubranch}
              onChange={(value) => setBranch(value)}
              options={branchList}
            />
          ) : null}
        </HStack>
        <HStack>
          <Button
            as={Link}
            target={"_blank"}
            download
            href={
              process.env.NEXT_PUBLIC_ADMISSIONS_URL +
              `downloadenquiryclassexcel.php?college=${ucollege}&branch=${ubranch}`
            }
            leftIcon={<AiOutlineCloudDownload className="text-lg" />}
            colorScheme={"green"}
            variant={"outline"}
            size={"sm"}
          >
            Download Excel
          </Button>
          {ucollege && ubranch && (
            <Button
              as={Link}
              target={"_blank"}
              download
              href={
                process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                `downloadenquiryclasspdf.php?college=${ucollege}&branch=${ubranch}&acadyear=${acadyear}`
              }
              leftIcon={<AiOutlineCloudDownload className="text-lg" />}
              colorScheme={"orange"}
              variant={"outline"}
              size={"sm"}
            >
              Download PDF
            </Button>
          )}
        </HStack>
      </HStack>
      <VStack className="w-full h-full" spacing={0}>
        {!ucollege ? (
          <InfoCard message="Select College" />
        ) : ucollege && !ubranch ? (
          <InfoCard message="Select Branch" />
        ) : null}
        <VStack
          spacing={0}
          className={
            "justify-start h-[91vh] items-start flex w-full overflow-scroll"
          }
        >
          {/* displaying admin childrens */}
          {ubranch && ucollege && data.length > 0 ? (
            <AgGridReact
              alwaysShowHorizontalScroll
              animateRows={true}
              className="w-full h-full pb-20 ag-theme-material"
              rowData={data as any}
              columnDefs={UnAprrovedColumns as any}
            />
          ) : ubranch && ucollege && data.length == 0 ? (
            <Center h={"80%"}>
              <Heading size={"lg"}>{Error}</Heading>
            </Center>
          ) : null}
        </VStack>
      </VStack>
    </div>
  );
}
