import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchCollegeList,
  fetchFeeQouted,
  fetchUnApprovedAdmissions,
} from "@/store/admissions.slice";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactDatePicker from "react-datepicker";
import { useSearchParams } from "next/navigation";

interface props {
  onClose: () => void;
  isOpen: boolean;
  reg_no?: string;
  father_no?: string;
  mother_no?: string;
  student_no?: string;
}

interface StateProps {
  [key: string]: string | Date | null | number;
}

interface FormDataProps {
  name: string;
  type: string;
  label: string;
  max?: number;
  isReadonly?: boolean;
  option?: { value: string; option: string }[];
  value?: string | Date | undefined | null;
  onChange?: (e: string) => void;
}

export default function AddCouncelAddmissionModel({
  onClose,
  isOpen,
  father_no,
  mother_no,
  reg_no,
  student_no,
}: props) {
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const searchParams = useSearchParams();
  const [state, setState] = useState<StateProps>({
    name: "",
    fname: "",
    email: "",
    college: "",
    branch: "",
    counselled: "",
    entry: "REGULAR",
    fee_quoted: "",
    regno: "",
    fmobile: "",
    mmobile: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const branchList = useAppSelector(
    (state) => state.admissions.branchlist.data
  ) as [];
  const collegeList = useAppSelector(
    (state) => state.admissions.collegeList.data
  ) as [];
  const feeOn = useAppSelector((state) => state.admissions.fee) as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    state.course &&
      dispatch(fetchCollegeList({ course: state.course as string }));
    setState((prev) => ({ ...prev, college: "", branch: "" }));
  }, [state.course, dispatch]);

  useEffect(() => {
    state.college &&
      dispatch(fetchBranchList({ college: state.college as string }));
  }, [state.college, dispatch]);

  useEffect(() => {
    state.college &&
      state.branch &&
      dispatch(
        fetchFeeQouted({
          college: state.college as string,
          branch: state.branch as string,
        })
      );
  }, [state.college, state.branch, dispatch]);

  useEffect(() => {
    setState({
      ...state,
      regno: reg_no ?? "",
      mmobile: mother_no ?? "",
      fmobile: father_no ?? "",
      phone: student_no ?? "",
    });
  }, [reg_no, father_no, mother_no, student_no]);

  const formData: FormDataProps[] = [
    {
      name: "regno",
      label: "Register No.",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      option: [
        {
          option: "MALE",
          value: "MALE",
        },
        {
          option: "FEMALE",
          value: "FEMALE",
        },
        {
          option: "OTHERS",
          value: "OTHERS",
        },
      ],
    },
    {
      name: "phone",
      label: "Phone No.",
      type: "number",
      max: 10,
    },
    {
      name: "source",
      label: "Referral Source",
      type: "select",
      option: [
        {
          option: "MANAGEMENT",
          value: "MANAGEMENT",
        },
        {
          option: "COLLEGE WEBSITE",
          value: "COLLEGE WEBSITE",
        },
        {
          option: "STUDENT REFERENCE",
          value: "STUDENT REFERENCE",
        },
        {
          option: "PARENT/RELATIVE REFERENCE",
          value: "PARENT/RELATIVE REFERENCE",
        },
        {
          option: "FACULTY REFERENCE",
          value: "FACULTY REFERENCE",
        },
        {
          option: "NEWS PAPER AD",
          value: "NEWS PAPER AD",
        },
        {
          option: "TV OR RADIO AD",
          value: "TV OR RADIO AD",
        },
        {
          option: "METRO BRANDING",
          value: "METRO BRANDING",
        },
        {
          option: "BUS BRANDING",
          value: "BUS BRANDING",
        },
        {
          option: "EDUCATION FAIR",
          value: "EDUCATION FAIR",
        },
        {
          option: "PHONE OR SMS OR WHATSAPP",
          value: "PHONE OR SMS OR WHATSAPP",
        },
        {
          option: "SOCAIL MEDIA",
          value: "SOCAIL MEDIA",
        },
        {
          option: "OTHERS",
          value: "OTHERS",
        },
      ],
    },
    {
      name: "course",
      label: "Course",
      type: "select",
      option: [
        {
          option: "PU",
          value: "PU",
        },
        {
          option: "DIPLOMA",
          value: "DIPLOMA",
        },
        {
          option: "MBA",
          value: "MBA",
        },
        {
          option: "MTECH",
          value: "MTECH",
        },
        {
          option: "ARCHITECTURE",
          value: "ARCHITECTURE",
        },
        {
          option: "ENGINEERING",
          value: "ENGINEERING",
        },
      ],
    },
    {
      name: "college",
      label: "College",
      type: "select",
      option: collegeList,
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      option: branchList,
    },
    {
      name: "fee_quoted",
      label: "Fee",
      type: "number",
      isReadonly: true,
      value: feeOn,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "fname",
      label: "Father Name",
      type: "text",
    },
    {
      name: "fmobile",
      label: "Father Mobile No.",
      type: "number",
      max: 10,
    },
    {
      name: "mname",
      label: "Mother Name",
      type: "text",
    },
    {
      name: "mmobile",
      label: "Mother Mobile No.",
      type: "number",
      max: 10,
    },
    {
      name: "city",
      label: "City",
      type: "text",
    },
    {
      name: "state",
      label: "State",
      type: "text",
    },
    {
      name: "peducation",
      label: "Previous School/College",
      type: "text",
    },

    {
      name: "board",
      label: "Board",
      type: "select",
      option: [
        {
          option: "SSLC OR 10th",
          value: "SSLC",
        },
        {
          option: "PUC",
          value: "PUC",
        },
        {
          option: "CBSE",
          value: "CBSE",
        },
        {
          option: "ICSE",
          value: "ICSE",
        },
        {
          option: "OTHERS",
          value: "OTHERS",
        },
      ],
    },

    {
      name: "percentage",
      label: "Overall Percentage / CGPA",
      type: "number",
    },
    {
      name: "pcm",
      label: "PCM Aggregate",
      type: "number",
    },

    {
      name: "exam",
      label: "Exam",
      type: "select",
      option: [
        {
          option: "CET",
          value: "CET",
        },
        {
          option: "COMEDK",
          value: "COMEDK",
        },
        {
          option: "CET AND COMEDK",
          value: "CET AND COMEDK",
        },
        {
          option: "DCET",
          value: "DCET",
        },
        {
          option: "JEE (M)",
          value: "JEE (M)",
        },
        {
          option: "NATA",
          value: "NATA",
        },
        {
          option: "OTHERS",
          value: "OTHERS",
        },
        {
          option: "NONE",
          value: "NONE",
        },
      ],
    },
    {
      name: "rank",
      label: "Rank",
      type: "text",
    },
    {
      name: "hostel_facility",
      label: "Hostel Facility Required",
      type: "select",
      option: [
        {
          option: "YES",
          value: "YES",
        },
        {
          option: "NO",
          value: "No",
        },
      ],
    },
    {
      name: "trasport_facility",
      label: "Transport Facility Required",
      type: "select",
      option: [
        {
          option: "YES",
          value: "YES",
        },
        {
          option: "NO",
          value: "NO",
        },
      ],
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      option: [
        {
          option: "REGULAR",
          value: "REGULAR",
        },
        {
          option: "LATERAL ENTRY",
          value: "LATERAL_ENTRY",
        },
      ],
    },
    {
      name: "counselled",
      label: "Counselled By",
      type: "text",
    },
  ];

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("acadyear", "2024");
      fd.append("course", state.course as string);
      fd.append("reg_no", state.regno as string);
      fd.append("name", state.name as string);
      fd.append("gender", state.gender as string);
      fd.append("fname", state.fname as string);
      fd.append("father_no", state.fmobile as string);
      fd.append("mother_name", state.mname as string);
      fd.append("mother_no", state.mmobile as string);
      fd.append("college", state.college as string);
      fd.append("branch", state.branch as string);
      fd.append("phone", state.phone as string);
      fd.append("email", state.email as string);
      fd.append("city", state.city as string);
      fd.append("state", state.state as string);
      fd.append("school_college", state.peducation as string);
      fd.append("source", state.source as string);
      fd.append("percentage", state.percentage as string);
      fd.append("pcm", state.pcm as string);
      fd.append("board", state.board as string);
      fd.append("exam", state.exam as string);
      fd.append("rank", state.rank as string);
      fd.append("hostel", state.hostel_facility as string);
      fd.append("transport", state.trasport_facility as string);
      fd.append("counselled", state.counselled as string);
      fd.append("category", state.category as string);
      fd.append("fee_quoted", feeOn as string);
      fd.append("quoted_by", state.quoted_by as string);
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "createenquiry.php",
        {
          data: fd,
          method: "POST",
        }
      );
      toast.success("Enquiry details updated");
      const link = document.createElement("a");
      link.href =
        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
        `downloadenquiry.php?id=${res.data?.id}&acadyear=${acadYear}`;
      link.setAttribute("download", "Enquiry Copy.pdf");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      dispatch(
        fetchUnApprovedAdmissions({
          college: state.college as string,
          branch: state.branch as string,
        })
      );
      // @ts-ignore
      setState(Object.keys(state).map((key: string) => ({ [key]: "" })));
      onClose();
    } catch (e: any) {
      console.log(e);
      toast.error(e.response?.data?.msg);
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} size={"6xl"} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Student Enquiry Form</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack w={"full"} h={"full"}>
            <SimpleGrid
              columns={3}
              spacingX={"5"}
              spacingY={"4"}
              w={"900px"}
              h={"full"}
            >
              {formData.map((field: FormDataProps, index) => {
                if (
                  (field.name == "exam" || field.name == "rank") &&
                  !["ENGINEERING", "MBA", "ARCHITECTURE"].includes(
                    state.course as string
                  )
                )
                  return null;
                else if (field.name == "pcm" && state.course !== "ENGINEERING")
                  return null;
                return (
                  <FormControl
                    key={index}
                    display={"flex"}
                    flexDir={"column"}
                    w={"full"}
                  >
                    <FormLabel>{field.label}</FormLabel>
                    {field.type == "select" ? (
                      <>
                        <Select
                          boxShadow={"md"}
                          bg={"white"}
                          w={"64"}
                          value={state[field.name] as string}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                        >
                          <option value={""}>Select {field.label}</option>
                          {field.option &&
                            field.option.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.option}
                              </option>
                            ))}
                        </Select>
                      </>
                    ) : field.type == "date" ? (
                      <ReactDatePicker
                        className="px-3 py-2 border w-full rounded-md outline-brand"
                        selected={field.value as Date}
                        dateFormat={"dd/MM/yyyy"}
                        onChange={(date) =>
                          setState((prev) => ({
                            ...prev,
                            [field.name]: date,
                          }))
                        }
                      />
                    ) : (
                      <Input
                        isReadOnly={field?.isReadonly}
                        type={field.type}
                        boxShadow={"md"}
                        bg={"white"}
                        w={"64"}
                        maxLength={field?.max}
                        value={
                          field.value
                            ? (field.value as string)
                            : (state[field.name] as string)
                        }
                        onChange={(e) => {
                          if (field.onChange) {
                            field.onChange(e.target.value);
                            return;
                          }
                          if (field.max && field.type == "number") {
                            if (e.target.value.length <= field.max) {
                              const value = Math.max(
                                0,
                                Math.min(9999999999, Number(e.target.value))
                              );
                              setState((prev) => ({
                                ...prev,
                                [field.name]: value.toString(),
                              }));
                            }
                          } else if (
                            field.type == "number" &&
                            (field.name == "percentage" || field.name == "pcm")
                          ) {
                            const value = Math.max(
                              0,
                              Math.min(100.0, Number(e.target.value))
                            );
                            setState((prev) => ({
                              ...prev,
                              [field.name]: value.toString(),
                            }));
                          } else if (
                            field.type == "number" &&
                            field.name == "rank"
                          ) {
                            const value = Math.round(
                              Math.max(
                                0,
                                Math.min(999999999, Number(e.target.value))
                              )
                            );
                            setState((prev) => ({
                              ...prev,
                              [field.name]: value.toString(),
                            }));
                          } else if (
                            field.type == "text" &&
                            field.name == "cheque_no"
                          ) {
                            const result = e.target.value.replace(
                              /[^a-z0-9A-Z]/gi,
                              ""
                            );
                            setState((prev) => ({
                              ...prev,
                              [field.name]: result,
                            }));
                          } else {
                            setState((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }));
                          }
                        }}
                      />
                    )}
                  </FormControl>
                );
              })}
            </SimpleGrid>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" variant={"ghost"} mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="facebook" variant="solid" onClick={onSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
