import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchCollegeList,
  fetchFeeQouted,
  fetchUnApprovedAdmissions,
} from "@/store/admissions.slice";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import IModal from "../ui/utils/IModal";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

interface StateProps {
  [key: string]: string;
}

interface FormDataProps {
  name: string;
  type: string;
  label: string;
  max?: number;
  isReadonly?: boolean;
  option?: { value: string; option: string }[];
  value?:string;
}

export default function AddCouncelAddmissionModel({ children }: props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [state, setState] = useState<StateProps>({
    name: "",
    fname: "",
    phone: "",
    email: "",
    college: "",
    branch: "",
    counselled: "",
    entry: "REGULAR",
    fee_quoted:"",
  });
  const [isLoading, setIsLoading] = useState(false);
  const branchList = useAppSelector(
    (state) => state.admissions.branchlist.data
  ) as [];
  const collegeList = useAppSelector(
    (state) => state.admissions.collegeList.data
  ) as [];
  const feeOn = useAppSelector(
    (state) => state.admissions.fee
  ) as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    state.course && dispatch(fetchCollegeList({ course: state.course }));
    setState(prev=>({...prev,college:"",branch:""}))
  }, [state.course, dispatch]);

  useEffect(() => {
    state.college && dispatch(fetchBranchList({ college: state.college }));
  }, [state.college, dispatch]);

  useEffect(() => {
    state.college&&state.branch && dispatch(fetchFeeQouted({ college: state.college,branch:state.branch })).then(()=>{
      setState(prev=>({...prev,fee_quoted:feeOn}))
    })
  }, [state.college,state.branch, dispatch]);

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
      option: collegeList
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
      label: "Percentage/CGPA",
      type: "number",
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
      name: "exam",
      label: "Exam",
      type: "select",
      option: [
        {
          option: "CET/DCET",
          value: "CET/DCET",
        },
        {
          option: "COMEDK",
          value: "COMEDK",
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
      ],
    },
    {
      name: "rank",
      label: "Rank",
      type: "number",
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
        }
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
      fd.append("course", state.course);
      fd.append("reg_no", state.regno);
      fd.append("name", state.name);
      fd.append("gender", state.gender);
      fd.append("fname", state.fname);
      fd.append("father_no", state.fmobile);
      fd.append("mother_name", state.mname);
      fd.append("mother_no", state.mmobile);
      fd.append("college", state.college);
      fd.append("branch", state.branch);
      fd.append("phone", state.phone);
      fd.append("email", state.email);
      fd.append("city", state.city);
      fd.append("state", state.state);
      fd.append("school_college", state.peducation);
      fd.append("source", state.source);
      fd.append("percentage", state.percentage);
      fd.append("board", state.board);
      fd.append("exam", state.exam);
      fd.append("rank", state.rank);
      fd.append("hostel", state.hostel_facility);
      fd.append("transport", state.trasport_facility);
      fd.append("counselled", state.counselled);
      fd.append("category", state.category);
      fd.append("fee_quoted", state.fee_quoted);
      fd.append("quoted_by", state.quoted_by);
      await axios(
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
        `downloadenquiry.php?regno=${state.regno}`;
      link.setAttribute("download", "Enquiry Copy.pdf");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      dispatch(
        fetchUnApprovedAdmissions({
          college: state.college,
          branch: state.branch,
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
    <VStack>
      <IModal
        size={"6xl"}
        buttonTitle="Add"
        heading="Add Enquiry"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onSubmit={() => onSubmit()}
      >
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
                !["ENGINEERING", "MBA", "ARCHITECTURE"].includes(state.course)
              )
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
                        value={state[field.name]}
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
                  ) : (
                    <Input
                      isReadOnly={field?.isReadonly}
                      type={field.type}
                      boxShadow={"md"}
                      bg={"white"}
                      w={"64"}
                      maxLength={field?.max}
                      value={field.value ? field.value : state[field.name]}
                      onChange={(e) => {
                        if (field.max && field.type == "number") {
                          if (e.target.value.length <= field.max) {
                            const value = Math.max(0, Math.min(9999999999, Number(e.target.value)));
                              setState((prev) => ({
                                ...prev,
                                [field.name]: value.toString(),
                              }))
                          }
                        } else if (field.type == "number" && field.name=="percentage") {
                          const value = Math.max(0, Math.min(100.00, Number(e.target.value)));
                              setState((prev) => ({
                                ...prev,
                                [field.name]: value.toString(),
                              }))
                        }else if (field.type == "number" && field.name=="rank") {
                          const value = Math.round(Math.max(0, Math.min(999999999, Number(e.target.value))));
                              setState((prev) => ({
                                ...prev,
                                [field.name]: value.toString(),
                              }))
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
      </IModal>
      {children({ onOpen })}
    </VStack>
  );
}
