"use client";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {Link} from "@chakra-ui/next-js";
import {
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloudDownload,
  AiOutlineLogout,
  AiOutlinePlusCircle,
  AiOutlinePlusSquare,
  AiOutlineSearch,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import ISelect from "../ui/utils/ISelect";
import { InfoCard } from "../ui/utils/InfoCard";
import { UnAprrovedColumns } from "../mock-data/admission-meta";
import { AgGridReact } from "ag-grid-react";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchUnApprovedAdmissions,
} from "@/store/admissions.slice";
import { useParams } from "next/navigation";
import AddCouncelAddmissionModel from "../modals/AddCouncelAdmissionModal";
import { SC } from "@/utils/supabase";
import { useSupabase } from "@/app/supabase-provider";
import ViewAdmissionDetailsModal from "../drawers/ViewAdmissionDetailsModal";
import ViewUnApprovedAdmModal from "../drawers/ViewUnApprovedAdmModal";
import { toast } from "react-hot-toast";
import axios from "axios";

interface AttendanceLayoutProps {
  children: React.ReactNode;
  showDownloadFile?: boolean;
}

export default function AdmissionLayout({
  children,
  showDownloadFile,
}: AttendanceLayoutProps) {
  const router = useParams();

  const { college, branch } = router;

  const [ubranch, setBranch] = useState<string | undefined>("");
  const [ucollege, setCollege] = useState<string | undefined>("");
  const [adno, setAdno] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branchList, setBranchList] = useState<[]>([]);

  const data = useAppSelector(
    (state) => state.admissions.unapproved_matrix.data
  ) as [];
  const Error = useAppSelector(
    (state) => state.admissions.unapproved_matrix.error
  ) as [];
  const selectedMatrixError = useAppSelector(
    (state) => state.admissions.selectedMatrix.error
  ) as string | null;
  const dispatch = useAppDispatch();

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

  const { user } = useSupabase();

  return (
    <div className="bg-primary relative overflow-hidden w-full  h-full flex flex-col">
      <HStack
        w={"full"}
        position={"fixed"}
        top={"0"}
        left={"0"}
        px={"5"}
        justifyContent={"space-between"}
        h={"14"}
        bg={"whiteAlpha.100"}
        className="border-b border-b-lightgray backdrop-blur-sm"
      >
        <HStack color={"blue.600"}>
          <AiOutlineUsergroupAdd className="text-3xl" />
          <Heading size={"md"}>Admissions Matrix</Heading>
        </HStack>
        <HStack>
          <Input
            onChange={(e) => setAdno(e.target.value)}
            value={adno}
            size={"sm"}
            variant={"filled"}
            w={"72"}
            type={"number"}
            placeholder="Search admission no."
          />
          <ViewAdmissionDetailsModal admissionno={adno!}>
            {({ onOpen }) => (
              <ViewUnApprovedAdmModal admissionno={adno!}>
                {({ onOpen: onUnapprovedOpen }) => (
                  <IconButton
                  isLoading={isLoading}
                    onClick={async () => {
                      setIsLoading(true)
                      try {
                        const formData = new FormData();
                        formData.append("admissionno", adno);
                        const response = await axios({
                          url:
                            process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                            "searchbyid.php",
                          method: "POST",
                          data: formData,
                        });

                        const resData = response.data.status as
                          | "APPROVED"
                          | "NOT APPROVED";
                        if (resData == "APPROVED" && !selectedMatrixError)
                          onOpen();
                        else if (resData == "NOT APPROVED" && !selectedMatrixError)
                          onUnapprovedOpen();
                        else
                          toast.error("No record found !",{position:"top-right"})  
                      } catch (e: any) {
                        toast.error(e.response.data?.msg,{position:"top-right"});
                      }
                      setIsLoading(false)
                    }}
                    colorScheme="facebook"
                    size={"sm"}
                    aria-label="search"
                    icon={<AiOutlineSearch className="text-lg" />}
                  />
                )}
              </ViewUnApprovedAdmModal>
            )}
          </ViewAdmissionDetailsModal>
        </HStack>
        <HStack>
          <Tooltip bg={"whiteAlpha.800"} className="backdrop-blur-sm" color={"black"} placement="bottom" hasArrow label={user?.email}>
          <HStack>
            <Heading size={"sm"}>{user?.username}</Heading>
            <Avatar size={"sm"}></Avatar></HStack>
          </Tooltip>
          <Button
            variant={"ghost"}
            colorScheme="blue"
            rightIcon={<AiOutlineLogout className="text-md" />}
            onClick={async () => await SC().auth.signOut()}
          >
            Sign Out
          </Button>
        </HStack>
      </HStack>
      <Tabs
        mt={"14"}
        size={"sm"}
        variant={"line"}
        h={"92vh"}
        w={"full"}
        px={"0"}
      >
        <TabList className="px-5">
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tab
                as={Button}
                rounded={"none"}
                colorScheme="green"
                variant={"ghost"}
                size={"lg"}
                py={"2"}
                _selected={{
                  color: "green.400",
                  borderBottom: "2px",
                  borderBottomColor: "green.400",
                }}
                leftIcon={<AiOutlineCheckCircle className="text-lg" />}
              >
                Approved
              </Tab>
              <Tab
                as={Button}
                py={"2"}
                colorScheme="orange"
                variant={"ghost"}
                rounded={"none"}
                size={"lg"}
                _selected={{
                  color: "orange.400",
                  borderBottom: "2px",
                  borderBottomColor: "orange.400",
                }}
                leftIcon={<AiOutlineClockCircle className="text-lg" />}
              >
                Un-Approved
              </Tab>
            </HStack>
            <HStack>
              <AddCouncelAddmissionModel>
                {({ onOpen }) => (
                  <Button
                    leftIcon={<AiOutlinePlusCircle className="text-lg" />}
                    onClick={onOpen}
                    size={"sm"}
                    colorScheme="facebook"
                  >
                    Add Enquiry
                  </Button>
                )}
              </AddCouncelAddmissionModel>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels px={"0"} h={"full"}>
          <TabPanel p={"0"} h={"100vh"}>
            <HStack
              className="bg-secondary"
              px={"5"}
              py={"3"}
              borderBottom={"1px"}
              borderColor={"gray.200"}
            >
              <HStack w={"full"}>
                <Link href={"/dashboard"}>
                  <Box
                    as={Tag}
                    colorScheme="gray"
                    size={"lg"}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Overall
                  </Box>
                </Link>
                {college && (
                  <>
                    <AiOutlineArrowRight />
                    <Link href={"/dashboard/" + college}>
                      <Box
                        as={Tag}
                        colorScheme="gray"
                        size={"lg"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {college}
                      </Box>
                    </Link>
                  </>
                )}
                {college && branch && (
                  <>
                    <AiOutlineArrowRight />
                    <Box
                      as={Tag}
                      colorScheme="gray"
                      size={"lg"}
                      _hover={{ textDecoration: "underline" }}
                    >
                      {branch}
                    </Box>
                  </>
                )}
              </HStack>
              <HStack>
                {showDownloadFile && (
                  <>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `dowloadclassexcel.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"green"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download Excel
                    </Button>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `downloadclasspdf.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"orange"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download PDF
                    </Button>
                  </>
                )}
              </HStack>
            </HStack>
            <VStack h={"100vh"} w={"full"}>
              {children}
            </VStack>
          </TabPanel>
          <TabPanel p={"0"} h={"full"}>
            <div className="w-full flex border-b py-2 space-x-3 px-5">
              <ISelect
                placeHolder="Select College"
                value={ucollege}
                onChange={(value) => setCollege(value)}
                options={[
                  { value: "KSIT", option: "KSIT" },
                  { value: "KSPT", option: "KSPT" },
                  { value: "KSPU", option: "KSPU" },
                  { value: "KSSA", option: "KSSA" },
                  { value: "KSSEM", option: "KSSEM" },
                ]}
              />
              {ucollege ? (
                <ISelect
                  placeHolder="Select Branch"
                  value={ubranch}
                  onChange={(value) => setBranch(value)}
                  options={branchList}
                />
              ) : null}
            </div>
            <VStack className="w-full h-full" spacing={0}>
              {!ucollege ? (
                <InfoCard message="Select College" />
              ) : ucollege && !ubranch ? (
                <InfoCard message="Select Branch" />
              ) : null}
              <VStack
                spacing={0}
                className={
                  "justify-start items-start flex w-full h-full overflow-scroll"
                }
              >
                {/* displaying admin childrens */}
                {ubranch && ucollege && data.length > 0 ? (
                  <AgGridReact
                    alwaysShowHorizontalScroll
                    animateRows={true}
                    className="w-full h-full  pb-6 ag-theme-material"
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
