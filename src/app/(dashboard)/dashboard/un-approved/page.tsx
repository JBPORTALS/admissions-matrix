"use client";
import { useSupabase } from "@/app/supabase-provider";
import {
  UnAprrovedColumns,
  UnAprrovedColumnsWithRemarks,
} from "@/components/mock-data/admission-meta";
import ISelect from "@/components/ui/utils/ISelect";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchUnApprovedAdmissions } from "@/store/admissions.slice";
import { COLLEGES } from "@/utils/constants";
import { trpc } from "@/utils/trpc-cleint";
import { Button, Center, HStack, Heading, VStack } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";

export default function UnApproved() {
  const [ubranch, setBranch] = useState<string | undefined>("");
  const [ucollege, setCollege] = useState<string | undefined>("");
  const user = useSupabase();
  const acadyear = useAppSelector(
    (state) => state.admissions.acadYear
  ) as string;
  const { data: branchList } = trpc.retrieveBranchList.useQuery(
    { college: ucollege ?? "", acadYear: acadyear },
    {
      enabled: !!ucollege,
    }
  );
  const dispatch = useAppDispatch();
  const data = useAppSelector(
    (state) => state.admissions.unapproved_matrix.data
  ) as [];
  const Error = useAppSelector(
    (state) => state.admissions.unapproved_matrix.error
  );

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
            options={COLLEGES()}
          />
          {ucollege ? (
            <ISelect
              placeHolder="Select Branch"
              value={ubranch}
              onChange={(value) => setBranch(value)}
              options={branchList ? branchList : []}
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
              columnDefs={
                user.user?.college === "KSPT"
                  ? (UnAprrovedColumnsWithRemarks as any)
                  : (UnAprrovedColumns as any)
              }
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
