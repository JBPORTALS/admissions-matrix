"use client";

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
  updateToApprove,
} from "@/store/admissions.slice";
import {
  Box,
  Button,
  createListCollection,
  Field,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useSupabase } from "@/app/supabase-provider";
import { trpc } from "@/utils/trpc-cleint";
import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuTrigger,
} from "../ui/menu";
import { LuEllipsis, LuFileDown, LuTrash2 } from "react-icons/lu";
import Link from "next/link";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  collegesOptions,
  examsOptions,
  hostelOptions,
} from "@/utils/constants";
import {
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogActionTrigger,
} from "../ui/dialog";
import { CloseButton } from "../ui/close-button";
import { format } from "date-fns";
import { toaster } from "../ui/toaster";

interface props {
  children: React.ReactNode;
  admissionno: string;
  isUnapproved?: boolean;
}

export default function ViewAdmissionDetailsModal({
  children,
  admissionno,
  isUnapproved,
}: props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { open, onToggle: onChangeOpen } = useDisclosure();
  const selectedAdmissionDetails = useAppSelector(
    (state) => state.admissions.selectedMatrix.data
  ) as SelectedMatrix[];

  const isLoading = useAppSelector(
    (state) => state.admissions.selectedMatrix.pending
  ) as boolean;
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  const matrix = selectedAdmissionDetails[0];

  // Get branch list
  const { data: branch_list } = trpc.retrieveBranchList.useQuery(
    { acadYear, college: matrix?.college },
    {
      enabled: open && !!matrix?.college,
    }
  );

  const dispatch = useAppDispatch();
  const { user } = useSupabase();

  const [state, setState] = useState({
    fee_quoted: matrix?.fee_quoted,
    fee_fixed: matrix?.fee_fixed,
  });
  const fee = useAppSelector((state) => state.admissions.fee.data.toString());
  const params = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  let intialRender = true;

  const branchCollection = useMemo(
    () =>
      createListCollection({
        items:
          branch_list?.map((b: any) => ({
            value: b.value,
            label: b.value,
          })) ?? [],
      }),
    [branch_list]
  );

  useEffect(() => {
    if (open) {
      console.log("triggered");
      setState({
        fee_fixed: matrix?.fee_fixed,
        fee_quoted: matrix?.fee_quoted,
      });
      intialRender = false;
    }
  }, [open, matrix?.fee_fixed, matrix?.fee_quoted]);

  useEffect(() => {
    if (open && matrix?.admission_id == admissionno && intialRender) {
      dispatch(
        fetchFeeQouted({
          college: matrix?.college,
          branch: matrix?.branch,
        })
      ).then((action) => {
        setState({
          fee_fixed: fee,
          fee_quoted: fee,
        });
      });
    }
  }, [
    matrix?.college,
    matrix?.branch,
    matrix?.admission_id,
    fee,
    dispatch,
    open,
    intialRender,
  ]);

  useEffect(() => {
    if (open && matrix?.admission_id == admissionno && intialRender) {
      dispatch(updateSelectedMatrix({ branch: "" }));
    }
  }, [dispatch, open, matrix?.admission_id, matrix?.college]);

  // Fetch selected matrix when dialog is open
  useEffect(() => {
    if (open) dispatch(fetchSelectedMatrix({ admissionno }));
  }, [open]);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("admissionno", matrix.admission_id);
      formData.append("user_college", user?.college!);
      formData.append("acadyear", acadYear);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "deletestudent.php",
        method: "POST",
        data: formData,
      });
      await dispatch(
        fetchSearchClass({
          college: matrix.college,
          branch: matrix.branch,
        })
      );
      toaster.success({ title: response.data?.msg });
    } catch (e: any) {
      toaster.error({ title: e.response?.data?.msg });
    }
    setIsDeleting(false);
  };

  // Update Selected Matrix
  useEffect(() => {
    open &&
      matrix?.admission_id == admissionno &&
      dispatch(
        updateSelectedMatrix({
          remaining_amount: (
            parseInt(state.fee_fixed) - parseInt(matrix?.fee_paid)
          ).toString(),
        })
      );
  }, [
    // eslint-disable-line
    state.fee_fixed, // eslint-disable-line
    matrix?.fee_paid, // eslint-disable-line
    matrix?.admission_id,
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
      (await dispatch(
        fetchSearchClass({
          college: params.college as string,
          branch: params.branch as string,
        })
      ));
  };

  async function approve() {
    setIsApproving(true);
    await dispatch(
      updateToApprove({
        username: user?.fullname!,
        fee_fixed: state.fee_fixed,
        fee_quoted: state.fee_quoted,
        user_college: user?.college!,
      })
    );
    setIsApproving(false);
  }

  return (
    <DrawerRoot open={open} onOpenChange={onChangeOpen} size={"md"}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent offset={"4"} rounded={"md"} ref={contentRef}>
        <DrawerHeader flexDir={"column"} alignItems={"start"} gap={"0"}>
          <DrawerTitle>
            {isUnapproved ? "Enquiry Details" : "Admission Details"}
          </DrawerTitle>
          <DrawerDescription fontSize={"xs"}>
            Enquired on{" "}
            {matrix?.enquiry_date &&
              format(new Date(matrix.enquiry_date), "dd MMM, yyyy")}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody asChild>
          <VStack
            w={"full"}
            alignItems={"start"}
            justifyContent={"start"}
            h={"full"}
            px={"5"}
            gap={"3"}
            py={"5"}
          >
            <Flex
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Application No.
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                value={matrix?.admission_id}
                className={"shadow-md shadow-lightBrand"}
              />
            </Flex>
            <Flex
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Register Number
                </Heading>
              </VStack>
              <Input
                placeholder="Not set yet."
                readOnly
                w={"60%"}
                value={matrix?.reg_no}
                className={"shadow-md shadow-lightBrand"}
              />
            </Flex>
            <Flex
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Name
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.name}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ name: e.target.value })); // eslint-disable-line
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Student Phone No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.phone_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ phone_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
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
                  type="number"
                  textAlign={"right"}
                  value={parseFloat(matrix?.percentage).toString()}
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

            {matrix?.course === "ENGINEERING" && (
              <>
                <Flex
                  w="full"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <VStack flex={"1"} alignItems={"start"}>
                    <Heading
                      fontSize={"sm"}
                      color={"fg.muted"}
                      fontWeight={"medium"}
                    >
                      PCM Aggregate
                    </Heading>
                  </VStack>
                  <InputGroup
                    w={"60%"}
                    endElement={"%"}
                    className={"shadow-md shadow-lightBrand"}
                  >
                    <Input
                      textAlign={"right"}
                      variant={"outline"}
                      type="number"
                      value={parseFloat(matrix?.pcm).toString()}
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
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  College
                </Heading>
              </VStack>
              <SelectRoot
                w={"60%"}
                collection={collegesOptions}
                value={[matrix?.college]}
                onValueChange={(e) => {
                  dispatch(updateSelectedMatrix({ college: e.value }));
                }}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select..." />
                </SelectTrigger>

                <SelectContent portalRef={contentRef}>
                  {collegesOptions.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Flex>
            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Branch
                </Heading>
              </VStack>
              <Field.Root w={"60%"} invalid={!matrix?.branch}>
                <SelectRoot
                  w={"full"}
                  collection={branchCollection}
                  value={[matrix?.branch]}
                  onValueChange={(e) => {
                    dispatch(updateSelectedMatrix({ branch: e.value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select Branch..." />
                  </SelectTrigger>

                  <SelectContent portalRef={contentRef}>
                    <SelectItemGroup label="Branches">
                      {branchCollection.items.map((item) => {
                        return (
                          <SelectItem key={item.value} item={item}>
                            {item.label}
                          </SelectItem>
                        );
                      })}
                    </SelectItemGroup>
                  </SelectContent>
                </SelectRoot>
                {matrix?.branch == "" && (
                  <Field.ErrorText>Branch is required !</Field.ErrorText>
                )}
              </Field.Root>
            </Flex>
            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Father Name
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.father_name}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ father_name: e.target.value })
                  );
                }}
              />
            </Flex>
            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Father Mobile No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.father_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ father_no: e.target.value }));
                }}
              />
            </Flex>
            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Mother Name
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.mother_name}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ mother_name: e.target.value })
                  );
                }}
              />
            </Flex>
            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Mother Mobile No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.mother_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ mother_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Aadhar Card No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.aadhar_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ aadhar_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Pan Card No.
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.pan_no}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ pan_no: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"start"}
              flexDir={"column"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Complete Address
                </Heading>
              </VStack>
              <Textarea
                w={"full"}
                rows={4}
                variant={"outline"}
                resize={"none"}
                value={matrix?.address}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ address: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  E-Mail
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.email}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ email: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Exam
                </Heading>
              </VStack>
              <SelectRoot
                w={"60%"}
                collection={examsOptions}
                value={[matrix?.exam]}
                className={"shadow-md shadow-lightBrand"}
                onValueChange={(e) => {
                  dispatch(updateSelectedMatrix({ exam: e.value }));
                }}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select Exam..." />
                </SelectTrigger>
                <SelectContent portalRef={contentRef}>
                  {examsOptions.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Rank
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.rank}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ rank: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Management Fee
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                type={"number"}
                variant={"outline"}
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
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Fee Fixed
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                type={"number"}
                readOnly={!user?.can_update_total}
                variant={"outline"}
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
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Fee Paid
                </Heading>
              </VStack>
              <Input
                min={0}
                w={"60%"}
                type={"number"}
                variant={"outline"}
                // readOnly={!user?.can_edit}

                value={matrix?.fee_paid}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ fee_paid: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Fee Paid Date
                </Heading>
              </VStack>
              {matrix?.paid_date && (
                <Box w={"60%"}>
                  <Input type="date" value={matrix?.paid_date} readOnly />
                </Box>
              )}
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Mode / Remarks
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.remarks}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(updateSelectedMatrix({ remarks: e.target.value }));
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Remaining Fee
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                readOnly
                type={"number"}
                variant={"outline"}
                value={matrix?.remaining_amount}
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
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} w={"full"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Due Date
                </Heading>
              </VStack>
              {matrix?.due_date && (
                <Box w={"60%"}>
                  <Input
                    type="date"
                    value={matrix?.due_date}
                    onChange={(e) => {
                      dispatch(
                        updateSelectedMatrix({
                          due_date: moment(e.target.value).format("yyyy-MM-DD"),
                        })
                      );
                    }}
                  />
                </Box>
              )}
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Approved By
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                readOnly
                variant={"outline"}
                value={matrix?.approved_by}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {}}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Approved Date
                </Heading>
              </VStack>
              {matrix?.approved_date && (
                <Box w={"60%"}>
                  <Input
                    type="date"
                    value={matrix?.approved_date}
                    onChange={(date) => {}}
                    readOnly
                  />
                </Box>
              )}
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Referred By
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.referred_by}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ referred_by: e.target.value })
                  );
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Recommended By
                </Heading>
              </VStack>
              <Input
                w={"60%"}
                variant={"outline"}
                value={matrix?.recommended_by}
                className={"shadow-md shadow-lightBrand"}
                onChange={(e) => {
                  dispatch(
                    updateSelectedMatrix({ recommended_by: e.target.value })
                  );
                }}
              />
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Hostel
                </Heading>
              </VStack>
              <Field.Root w={"60%"} invalid={!matrix?.hostel}>
                <SelectRoot
                  w={"full"}
                  collection={hostelOptions}
                  value={[matrix?.hostel]}
                  onValueChange={(e) => {
                    dispatch(updateSelectedMatrix({ hostel: e.value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef}>
                    {hostelOptions.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                {matrix?.branch == "" && (
                  <Field.ErrorText>Branch is required !</Field.ErrorText>
                )}
              </Field.Root>
            </Flex>

            <Flex
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
              pb={"5"}
            >
              <VStack flex={"1"} alignItems={"start"}>
                <Heading
                  fontSize={"sm"}
                  color={"fg.muted"}
                  fontWeight={"medium"}
                >
                  Status
                </Heading>
              </VStack>
              <Input
                readOnly
                w={"60%"}
                variant={"outline"}
                value={matrix?.status}
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
                value={matrix?.counselled_quoted_by ?? ""}
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
          </VStack>
        </DrawerBody>

        <DrawerFooter justifyContent={"space-between"}>
          {/** More Actions */}
          <MenuRoot closeOnSelect={false}>
            <MenuTrigger asChild>
              <IconButton variant={"surface"} size={"sm"}>
                <LuEllipsis />
              </IconButton>
            </MenuTrigger>

            <MenuContent portalRef={contentRef}>
              <MenuItem asChild value="counselling-form">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                    `searchenquiry.php?id=${matrix?.admission_id}&acadyear=${acadYear}&college=${matrix?.college}`
                  }
                  target="_blank"
                >
                  <LuFileDown />
                  <Box flex={"1"}>Counselling Form</Box>
                </Link>
              </MenuItem>

              {!isUnapproved && (
                <React.Fragment>
                  <MenuItem value="provisional" asChild>
                    <Link
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `downloadprovisional.php?admissionno=${matrix?.admission_id}&acadyear=${acadYear}&college=${matrix?.college}`
                      }
                      target="_blank"
                    >
                      <LuFileDown />
                      Provisional
                    </Link>
                  </MenuItem>
                  <MenuItem asChild value="fee-history">
                    <Link
                      target="_blank"
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `feeinvoice.php?id=${matrix?.admission_id}&acadyear=${acadYear}&college=${matrix?.college}`
                      }
                    >
                      <LuFileDown />
                      Fee History
                    </Link>
                  </MenuItem>
                </React.Fragment>
              )}

              <DialogRoot role="alertdialog">
                <DialogTrigger asChild>
                  <MenuItem
                    value="delete"
                    color="fg.error"
                    _hover={{ bg: "bg.error", color: "fg.error" }}
                  >
                    <LuTrash2 /> <Box flex={"1"}>Delete</Box>
                  </MenuItem>
                </DialogTrigger>

                <DialogContent portalRef={contentRef}>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <p>
                      This action cannot be undone. This will permanently delete
                      your record and remove your data from our systems.
                    </p>
                  </DialogBody>

                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button
                      colorPalette="red"
                      loading={isDeleting}
                      onClick={onDelete}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger asChild>
                    <CloseButton size="sm" />
                  </DialogCloseTrigger>
                </DialogContent>
              </DialogRoot>
            </MenuContent>
          </MenuRoot>

          <HStack>
            <Button variant={"surface"} onClick={onsubmit} loading={isLoading}>
              Save
            </Button>

            {/** Only if matrix unapproved */}

            {isUnapproved && (
              <DialogRoot>
                <DialogTrigger asChild>
                  <Button
                    colorPalette={"green"}
                    onClick={onsubmit}
                    loading={isLoading}
                  >
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent portalRef={contentRef}>
                  <DialogHeader>
                    <DialogTitle>Are you want to approve ?</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <p>
                      This will make the enquiry to approved and place in
                      approved matrix section.
                    </p>
                  </DialogBody>

                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button loading={isApproving} onClick={approve}>
                      Approve
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger asChild>
                    <CloseButton size="sm" />
                  </DialogCloseTrigger>
                </DialogContent>
              </DialogRoot>
            )}
          </HStack>
        </DrawerFooter>

        <DrawerCloseTrigger>
          <CloseButton size={"xs"} />
        </DrawerCloseTrigger>
      </DrawerContent>
    </DrawerRoot>
  );
}
