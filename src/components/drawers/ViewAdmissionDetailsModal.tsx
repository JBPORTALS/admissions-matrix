import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchFeeQouted,
  fetchSearchClass,
  fetchSelectedMatrix,
  SelectedMatrix,
  updateMatrix,
  updateSelectedMatrix,
} from "@/store/admissions.slice";
import {
  Alert,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  Select,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";
import IModal from "../ui/utils/IModal";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { useSupabase } from "@/app/supabase-provider";
import { exams } from "./ViewUnApprovedAdmModal";
import { trpc } from "@/utils/trpc-cleint";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { LuChevronUp, LuFileDown } from "react-icons/lu";
import Link from "next/link";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { collegesOptions } from "@/utils/constants";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

interface props {
  children: React.ReactNode;
  admissionno: string;
}

export default function ViewAdmissionDetailsModal({
  children,
  admissionno,
}: props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    open: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();
  const { open, onClose, onOpen: onModalOpen } = useDisclosure();
  const selectedAdmissionDetails = useAppSelector(
    (state) => state.admissions.selectedMatrix.data
  ) as SelectedMatrix[];
  const isLoading = useAppSelector(
    (state) => state.admissions.selectedMatrix.pending
  ) as boolean;
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const { data: branch_list } = trpc.retrieveBranchList.useQuery(
    { acadYear, college: selectedAdmissionDetails[0]?.college },
    {
      enabled: open && !!selectedAdmissionDetails[0]?.college,
    }
  );
  const dispatch = useAppDispatch();
  const [dueDate, setDueDate] = useState(new Date());
  const { user } = useSupabase();

  const [state, setState] = useState({
    fee_quoted: selectedAdmissionDetails[0]?.fee_quoted,
    fee_fixed: selectedAdmissionDetails[0]?.fee_fixed,
  });
  const fee = useAppSelector((state) => state.admissions.fee);
  const params = useParams();
  let intialRender = true;

  useEffect(() => {
    if (open) {
      console.log("triggered");
      setState({
        fee_fixed: selectedAdmissionDetails[0]?.fee_fixed,
        fee_quoted: selectedAdmissionDetails[0]?.fee_quoted,
      });
      intialRender = false;
    }
  }, [
    open,
    selectedAdmissionDetails[0]?.fee_fixed,
    selectedAdmissionDetails[0]?.fee_quoted,
  ]);

  useEffect(() => {
    if (
      open &&
      selectedAdmissionDetails[0]?.admission_id == admissionno &&
      intialRender
    ) {
      dispatch(
        fetchFeeQouted({
          college: selectedAdmissionDetails[0]?.college,
          branch: selectedAdmissionDetails[0]?.branch,
        })
      ).then((action) => {
        setState({
          fee_fixed: fee as string,
          fee_quoted: fee as string,
        });
      });
    }
  }, [
    selectedAdmissionDetails[0]?.college,
    selectedAdmissionDetails[0]?.branch,
    selectedAdmissionDetails[0]?.admission_id,
    fee,
    dispatch,
    open,
    intialRender,
  ]);

  useEffect(() => {
    if (
      open &&
      selectedAdmissionDetails[0]?.admission_id == admissionno &&
      intialRender
    ) {
      dispatch(updateSelectedMatrix({ branch: "" }));
    }
  }, [
    dispatch,
    open,
    selectedAdmissionDetails[0]?.admission_id,
    selectedAdmissionDetails[0]?.college,
  ]);

  const runSetDueDate = useCallback(() => {
    setDueDate(new Date(selectedAdmissionDetails[0]?.due_date + "T00:00:00Z"));
    console.log(dueDate);
  }, [selectedAdmissionDetails[0]?.due_date]);

  useEffect(() => {
    open && runSetDueDate();
  }, [open]);

  const onOpen = () => {
    onModalOpen();
    dispatch(fetchSelectedMatrix({ admissionno }));
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("admissionno", selectedAdmissionDetails[0].admission_id);
      formData.append("user_college", user?.college!);
      formData.append("acadyear", acadYear);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "deletestudent.php",
        method: "POST",
        data: formData,
      });
      dispatch(
        fetchSearchClass({
          college: selectedAdmissionDetails[0].college,
          branch: selectedAdmissionDetails[0].branch,
        })
      );
      toast.success(response.data?.msg, { position: "top-right" });
    } catch (e: any) {
      toast.error(e.response?.data?.msg, { position: "top-right" });
    }
    setIsDeleting(false);
  };

  useEffect(() => {
    open &&
      selectedAdmissionDetails[0]?.admission_id == admissionno &&
      dispatch(
        updateSelectedMatrix({
          remaining_amount: (
            parseInt(state.fee_fixed) -
            parseInt(selectedAdmissionDetails[0]?.fee_paid)
          ).toString(),
        })
      );
  }, [
    // eslint-disable-line
    state.fee_fixed, // eslint-disable-line
    selectedAdmissionDetails[0]?.fee_paid, // eslint-disable-line
    selectedAdmissionDetails[0]?.admission_id,
    admissionno,
    open,
    dispatch,
  ]); // eslint-disable-line

  const onsubmit = async () => {
    await dispatch(
      updateMatrix({
        fee_fixed: state.fee_fixed,
        fee_quoted: state.fee_quoted,
        user_college: user?.college!,
      })
    );
    params.college &&
      params.branch &&
      dispatch(
        fetchSearchClass({
          college: params.college as string,
          branch: params.branch as string,
        })
      );
  };

  return (
    <DrawerRoot>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Admission Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody asChild>
          <VStack w={"full"} h={"full"} px={"5"} gap={"3"} py={"5"}>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Application No.
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.admission_id}
                className={"shadow-md shadow-lightBrand"}
              />
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Enquiry Date
                </Heading>
              </VStack>
              {selectedAdmissionDetails[0]?.enquiry_date && (
                <Box w={"60%"}>
                  <ReactDatePicker
                    className="px-3 flex justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                    selected={
                      new Date(selectedAdmissionDetails[0]?.enquiry_date)
                    }
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => {}}
                    readOnly
                  />
                </Box>
              )}
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Register Number
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.reg_no}
                className={"shadow-md shadow-lightBrand"}
              />
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Name
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.name}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ name: e.target.value })); // eslint-disable-line
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Student Phone No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.phone_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ phone_no: e.target.value }));
                }}
              />
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Overall Percentage / CGPA
                </Heading>
              </VStack>
              <InputGroup
                endElement={"%"}
                w={"60%"}
                className={"shadow-md shadow-lightBrand"}
              >
                <Input
                  variant={"outline"}
                  bg={"white"}
                  type="number"
                  value={parseFloat(
                    selectedAdmissionDetails[0]?.percentage
                  ).toString()}
                  onChange={(e) => {
                    dispatch(
                      updateSelectedMatrix({
                        percentage:
                          e.target.value == ""
                            ? 0
                            : parseInt(e.target.value) > 100
                            ? Math.trunc(100)
                            : parseFloat(e.target.value),
                      })
                    );
                  }}
                />
              </InputGroup>
            </Flex>
            {selectedAdmissionDetails[0]?.course === "ENGINEERING" && (
              <>
                <Flex
                  className="w-full justify-between"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <VStack flex={"1"} alignItems={"start"}>
                    <Heading fontSize={"sm"} fontWeight={"medium"}>
                      PCM Aggregate
                    </Heading>
                  </VStack>
                  <InputGroup
                    w={"60%"}
                    endElement={"%"}
                    className={"shadow-md shadow-lightBrand"}
                  >
                    <Input
                      variant={"outline"}
                      bg={"white"}
                      type="number"
                      value={parseFloat(
                        selectedAdmissionDetails[0]?.pcm
                      ).toString()}
                      onChange={(e) => {
                        dispatch(
                          updateSelectedMatrix({
                            pcm:
                              e.target.value == ""
                                ? 0
                                : parseInt(e.target.value) > 100
                                ? Math.trunc(100)
                                : parseFloat(e.target.value),
                          })
                        );
                      }}
                    />
                  </InputGroup>
                </Flex>
              </>
            )}

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  College
                </Heading>
              </VStack>
              <SelectRoot
                w={"60%"}
                collection={collegesOptions}
                defaultValue={[selectedAdmissionDetails[0]?.college]}
                onValueChange={(e) => {
                  dispatch(updateSelectedMatrix({ college: e.value }));
                }}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select..." />
                </SelectTrigger>

                <SelectContent>
                  {collegesOptions.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Branch
                </Heading>
              </VStack>
              <Field.Root
                w={"60%"}
                invalid={!selectedAdmissionDetails[0]?.branch}
              >
                <SelectRoot
                  w={"60%"}
                  collection={branch_list?.map((branch: any) => ({
                    value: branch.value,
                    label: branch.value,
                  }))}
                  defaultValue={[selectedAdmissionDetails[0]?.college]}
                  onValueChange={(e) => {
                    dispatch(updateSelectedMatrix({ college: e.value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select..." />
                  </SelectTrigger>
                  <option value={""}>Select Branch</option>
                  {branch_list &&
                    branch_list.map((branch: any) => {
                      return (
                        <option key={branch.value} value={branch.value}>
                          {branch.option}
                        </option>
                      );
                    })}
                </SelectRoot>
                {selectedAdmissionDetails[0]?.branch == "" && (
                  <Field.ErrorText>Branch is required !</Field.ErrorText>
                )}
              </Field.Root>
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Father Name
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.father_name}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ father_name: e.target.value })
                  );
                }}
              />
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Father Mobile No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.father_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ father_no: e.target.value }));
                }}
              />
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Mother Name
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.mother_name}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ mother_name: e.target.value })
                  );
                }}
              />
            </Flex>
            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Mother Mobile No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.mother_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ mother_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Aadhar Card No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.aadhar_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ aadhar_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Pan Card No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.pan_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ pan_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Address
                </Heading>
              </VStack>
              <Textarea
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.address}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ address: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  E-Mail
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.email}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ email: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Exam
                </Heading>
              </VStack>
              <Select.Root
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.exam}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ exam: e.target.value }));
                }}
              >
                <option value={""}>Select Exam</option>
                {exams.map((option, key) => (
                  <option key={key + option.value} value={option.value}>
                    {option.option}
                  </option>
                ))}
              </Select.Root>
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Rank
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.rank}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ rank: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Management Fee
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                type={"number"}
                variant={"outline"}
                bg={"white"}
                value={state.fee_quoted}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    fee_quoted: e.target.value,
                  }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Fee Fixed
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                type={"number"}
                readOnly={!user?.can_update_total}
                variant={"outline"}
                bg={"white"}
                value={state.fee_fixed}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    fee_fixed: e.target.value,
                  }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Fee Paid
                </Heading>
              </VStack>
              <Input
                min={0}
                w={"60%"}
                type={"number"}
                variant={"outline"}
                // readOnly={!user?.can_edit}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.fee_paid}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ fee_paid: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Fee Paid Date
                </Heading>
              </VStack>
              {selectedAdmissionDetails[0]?.paid_date && (
                <Box w={"60%"}>
                  <ReactDatePicker
                    className="px-3 flex justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                    selected={
                      selectedAdmissionDetails[0]?.paid_date == "0000-00-00"
                        ? new Date()
                        : new Date(selectedAdmissionDetails[0]?.paid_date)
                    }
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => {}}
                    readOnly
                  />
                </Box>
              )}
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Mode / Remarks
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.remarks}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ remarks: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Remaining Fee
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                readOnly
                type={"number"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.remaining_amount}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({
                      remaining_amount: e.target.value,
                    })
                  );
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} w={"full"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Due Date
                </Heading>
              </VStack>
              {selectedAdmissionDetails[0]?.due_date && (
                <Box w={"60%"}>
                  <ReactDatePicker
                    calendarClassName="z-30 bg-blue-200"
                    todayButton={
                      <Button size={"sm"} colorScheme="blue" variant={"ghost"}>
                        Today Date
                      </Button>
                    }
                    className="px-3 flex shadow-md read-only:shadow-none justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                    selected={
                      selectedAdmissionDetails[0]?.due_date !==
                        "Invalid date" ||
                      selectedAdmissionDetails[0]?.due_date.toString() ==
                        "0000-00-00"
                        ? new Date(selectedAdmissionDetails[0]?.due_date)
                        : new Date()
                    }
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => {
                      dispatch(
                        updateSelectedMatrix({
                          due_date: moment(date).format("yyyy-MM-DD"),
                        })
                      );
                    }}
                  />
                </Box>
              )}
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Approved By
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                readOnly
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.approved_by}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {}}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Approved Date
                </Heading>
              </VStack>
              {selectedAdmissionDetails[0]?.approved_date && (
                <Box w={"60%"}>
                  <ReactDatePicker
                    className="px-3 flex justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                    selected={
                      new Date(selectedAdmissionDetails[0]?.approved_date)
                    }
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => {}}
                    readOnly
                  />
                </Box>
              )}
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Referred By
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.referred_by}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ referred_by: e.target.value })
                  );
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Recommended By
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.recommended_by}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ recommended_by: e.target.value })
                  );
                }}
              />
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Hostel
                </Heading>
              </VStack>
              <Field.Root
                w={"60%"}
                invalid={!selectedAdmissionDetails[0]?.hostel}
              >
                <Select
                  w={"full"}
                  variant={"outline"}
                  bg={"white"}
                  value={selectedAdmissionDetails[0]?.hostel}
                  className={"shadow-md shadow-lightBrand"}
                  onChange={(e) => {
                    dispatch(updateSelectedMatrix({ hostel: e.target.value }));
                  }}
                >
                  <option value={"NO"}>NO</option>
                  <option value={"YES"}>YES</option>
                </Select>
                {selectedAdmissionDetails[0]?.branch == "" && (
                  <Field.ErrorText>Branch is required !</Field.ErrorText>
                )}
              </Field.Root>
            </Flex>

            <Flex
              className="w-full justify-between"
              justifyContent={"space-between"}
              alignItems={"center"}
              pb={"5"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading fontSize={"sm"} fontWeight={"medium"}>
                  Status
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.status}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ remarks: e.target.value }));
                }}
              />
            </Flex>
            <VStack w={"full"}>
              <Heading
                fontSize={"sm"}
                w={"full"}
                className="w-3/4"
                fontWeight={"medium"}
              >
                Counselled & Quoted By
              </Heading>
              <Textarea
                w={"full"}
                variant={"outline"}
                bg={"white"}
                value={selectedAdmissionDetails[0]?.counselled_quoted_by ?? ""}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({
                      counselled_quoted_by: e.target.value,
                    })
                  );
                }}
              />
            </VStack>

            <HStack
              zIndex={"sticky"}
              position={"sticky"}
              bottom={"0"}
              py={"2"}
              w={"full"}
              className={"border-t border-t-lightgray bg-background"}
            >
              <IModal
                heading="Are you sure ?"
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                colorBtn="red"
                onSubmit={() => {
                  onDelete();
                  onDeleteClose();
                }}
                buttonTitle="Yes"
              >
                <VStack py={"5"}>
                  <Heading size={"md"} fontWeight={"medium"}>
                    You want to delete this record
                  </Heading>
                  <Heading size={"md"} fontWeight={"sm"} color={"gray.600"}>
                    {"This action can't be undo"}
                  </Heading>
                </VStack>
              </IModal>
              <VStack w={"full"}>
                {parseInt(selectedAdmissionDetails[0]?.remaining_amount) <
                  0 && (
                  <Alert.Root status="warning">
                    <Alert.Indicator />
                    <Box>
                      <Alert.Title fontSize={"small"}>Warning !</Alert.Title>
                      <Alert.Description fontSize={"smaller"}>
                        Remaining Amount is less than zero. You still may
                        continue to save the changes.
                      </Alert.Description>
                    </Box>
                  </Alert.Root>
                )}
                <MenuRoot>
                  <MenuTrigger
                    as={Button}
                    w={"full"}
                    colorScheme="purple"
                    asChild
                  >
                    <Button>Download Document</Button> <LuChevronUp />
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem
                      asChild
                      colorPalette={"purple"}
                      w={"full"}
                      value="counselling-form"
                    >
                      <Link
                        href={
                          process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                          `downloadapprovedenquiry.php?id=${selectedAdmissionDetails[0]?.admission_id}&acadyear=${acadYear}&college=${selectedAdmissionDetails[0]?.college}`
                        }
                        target="_blank"
                      >
                        <LuFileDown />
                        <Box flex={"1"}>Counselling Form</Box>
                      </Link>
                    </MenuItem>
                    {selectedAdmissionDetails[0]?.status === "APPROVED" && (
                      <>
                        <MenuItem asChild value="provisional">
                          <Link
                            href={
                              process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                              `downloadprovisional.php?admissionno=${selectedAdmissionDetails[0]?.admission_id}&acadyear=${acadYear}&college=${selectedAdmissionDetails[0]?.college}`
                            }
                            target="_blank"
                          >
                            <LuFileDown />
                            <Box flex={"1"}>Provisional</Box>
                          </Link>
                        </MenuItem>
                        <MenuItem value="fee-invoice" asChild>
                          {" "}
                          <Link
                            target="_blank"
                            href={
                              process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                              `feeinvoice.php?id=${selectedAdmissionDetails[0]?.admission_id}&acadyear=${acadYear}&college=${selectedAdmissionDetails[0]?.college}`
                            }
                          >
                            <LuFileDown />
                            <Box flex={"1"}>Fee Invoice</Box>
                          </Link>
                        </MenuItem>
                      </>
                    )}
                  </MenuContent>
                </MenuRoot>

                <Button
                  loading={isDeleting}
                  onClick={onDeleteOpen}
                  colorScheme={"red"}
                  w={"full"}
                >
                  Delete
                  <AiOutlineDelete />
                </Button>
              </VStack>
            </HStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button onClick={onsubmit} loading={isLoading}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}
