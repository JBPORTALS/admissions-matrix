import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import "react-datepicker/dist/react-datepicker.css";
import { fetchBaseColleges, fetchBranchList } from "@/store/admissions.slice";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import IDrawer from "../ui/utils/IDrawer";
import { AiOutlineSelect } from "react-icons/ai";
import axios from "axios";
import { Formik, Field, FormikValues, useFormikContext } from "formik";
import * as Yup from "yup";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

const Schema = Yup.object().shape({
  fee: Yup.number().required(),
  alloted: Yup.number(),
  intake: Yup.number().required().min(Yup.ref("alloted")),
  cet: Yup.number().required(),
  comedk: Yup.number().required(),
});

let initialState = {
  fee: "",
  intake: "",
  alloted: "",
  remaining: "",
  college: "",
  branch: "",
  category: "REGULAR",
  cet: "",
  comedk: "",
};

export default function MIFModal({ children }: props) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  const updateDetails = useCallback<(values: FormikValues) => Promise<void>>(
    async (values) => {
      try {
        const formData = new FormData();
        formData.append("intake", values.intake);
        formData.append("fee", values.fee);
        formData.append("alloted_seats", values.alloted);
        formData.append("remaining_seats", values.remaining);
        formData.append("college", values.college);
        formData.append("branch", values.branch);
        formData.append("category", values.category);
        formData.append("acadyear", acadYear);
        formData.append("comedk", values.comedk);
        formData.append("cet", values.cet);

        const response = await axios({
          url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "admissionupdate.php",
          method: "POST",
          data: formData,
        });

        if (response.status == 200)
          toast({
            colorScheme: "blue",
            variant: "subtle",
            title: "Seat Matrix Updated.",
            description: "Refresh the page to view the changes.",
            position: "bottom",
          });
      } catch (e: any) {
        toast({
          colorScheme: "red",
          variant: "subtle",
          title: "Something went wrong!",
          description:
            "Your action could not be completed due to a server issue. Our Nexus team is currently working on resolving it.",
          position: "bottom",
          status: "error",
        });
      }
    },
    []
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={Schema}
      initialValues={initialState}
      onSubmit={async (values) => {
        await updateDetails(values);
      }}
    >
      {() => (
        <>
          <IDrawer
            hideFooter
            isLoading={isLoading}
            isDisabled={isLoading}
            onSubmit={() => {}}
            buttonTitle="Save"
            onClose={() => {
              onClose();
            }}
            isOpen={isOpen}
            heading="⚙️ Manage Intake & Fee Settings"
          >
            <FormikContextProvider />
          </IDrawer>
          {children({ onOpen })}
        </>
      )}
    </Formik>
  );
}

const FormikContextProvider = () => {
  const {
    values,
    setFieldValue,
    handleSubmit,
    isSubmitting,
    handleChange,
    handleReset,
    isValid,
    touched,
    errors,
  } = useFormikContext<typeof initialState>();

  const colleges = useAppSelector((state) => state.admissions.colleges);
  const branches = useAppSelector((state) => state.admissions.branchlist.data);
  const acadYear = useAppSelector((state) => state.admissions.acadYear);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const AddExtraFieldsRender = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    if (
      values.college === "KSIT" ||
      values.college === "KSSEM" ||
      values.college === "KSSA"
    )
      return <>{children}</>;
  };

  useEffect(() => {
    dispatch(fetchBaseColleges());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBranchList({ college: values.college }));
  }, [values.college, dispatch]);

  const fetchDetails = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("college", values.college);
      formData.append("branch", values.branch);
      formData.append("category", values.category);
      formData.append("acadyear", acadYear);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "admissionretrieve.php",
        method: "POST",
        data: formData,
      });

      setFieldValue("alloted", response.data[0].allotted_seats ?? 0);
      setFieldValue("remaining", response.data[0].remaining_seats ?? 0);
      setFieldValue("fee", response.data[0].fee ?? 0);
      setFieldValue("intake", response.data[0].intake ?? 0);
      setFieldValue("comedk", response.data[0].comedk ?? 0);
      setFieldValue("cet", response.data[0].cet ?? 0);
    } catch (e) {
      toast({
        title: "Something went wrong!",
        status: "error",
        colorScheme: "red",
      });
    }
  }, [values.branch, values.college, values.category]);

  useEffect(() => {
    if (values.college && values.branch) fetchDetails();
  }, [values.college, values.branch]);

  useEffect(() => {
    setFieldValue("remaining", +(+values.intake - +values.alloted));
  }, [values.intake, values.alloted, setFieldValue]);

  useEffect(() => {
    setFieldValue("total", +(+values.intake + +values.cet + +values.comedk));
  }, [values.intake, values.cet, values.comedk, setFieldValue]);

  return (
    <VStack p={"5"}>
      {/* <pre>{JSON.stringify(errors)}</pre> */}

      <FormControl>
        <FormLabel>College</FormLabel>
        <Select name="college" onChange={handleChange}>
          <option value={""}>Select</option>
          {colleges.map((value: any, index) => (
            <option value={value.value} key={value.value}>
              {value.option}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Branch</FormLabel>
        <Select name="branch" onChange={handleChange}>
          <option value={""}>Select</option>
          {branches.map((value: any, index) => (
            <option value={value.value} key={value.value}>
              {value.option}
            </option>
          ))}
        </Select>
      </FormControl>
      <Divider size={"2"} />
      {!values.branch || !values.college ? (
        <Card w={"full"} height={"40"}>
          <CardBody>
            <Center h={"full"} flexDirection={"column"}>
              <AiOutlineSelect className="text-3xl" />
              <Text size={"sm"} px={8} textAlign={"center"}>
                Select College & Branch to check the details
              </Text>
            </Center>
          </CardBody>
        </Card>
      ) : (
        <Card w={"full"}>
          <CardHeader>
            <Heading color={"gray.600"} size={"md"}>
              Details
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack gap={"3"}>
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Fee</b>{" "}
                <FormControl isInvalid={!!touched.fee && !!errors.fee} w={"40"}>
                  <InputGroup>
                    <InputLeftAddon>₹</InputLeftAddon>
                    <Field
                      as={Input}
                      name={"fee"}
                      type="number "
                      textAlign={"right"}
                    />
                  </InputGroup>
                  <FormErrorMessage fontSize={"xs"}>
                    {errors.fee}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              {values.college === "KSIT" ||
              values.college === "KSSEM" ||
              values.college === "KSSA" ? (
                <>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <b>Total Seats</b>
                    <FormControl isReadOnly w={"40"}>
                      <Field
                        as={Input}
                        isReadOnly
                        name={"total"}
                        type="number"
                        textAlign={"right"}
                      />
                    </FormControl>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <b>CET & SNQ</b>
                    <FormControl
                      w={"40"}
                      isInvalid={!!touched.cet && !!errors.cet}
                    >
                      <Field
                        as={Input}
                        name={"cet"}
                        type="number"
                        textAlign={"right"}
                      />
                      <FormErrorMessage fontSize={"xs"}>
                        {errors.cet}
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <b>COMEDK</b>
                    <FormControl
                      w={"40"}
                      isInvalid={!!touched.comedk && !!errors.comedk}
                    >
                      <Field
                        as={Input}
                        name={"comedk"}
                        type="number"
                        textAlign={"right"}
                      />
                      <FormErrorMessage fontSize={"xs"}>
                        {errors.comedk}
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                </>
              ) : null}
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Management</b>
                <FormControl
                  w={"40"}
                  isInvalid={!!touched.intake && !!errors.intake}
                >
                  <Field
                    as={Input}
                    name={"intake"}
                    type="number"
                    textAlign={"right"}
                  />
                  <FormErrorMessage fontSize={"xs"}>
                    {errors.intake}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Alloted Seats</b>
                <FormControl isReadOnly w={"40"}>
                  <Field
                    as={Input}
                    isReadOnly
                    name={"alloted"}
                    type="number"
                    textAlign={"right"}
                  />
                </FormControl>
              </HStack>
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Remaining Seats</b>
                <FormControl isReadOnly w={"40"}>
                  <Field
                    as={Input}
                    isReadOnly
                    type="number"
                    name="remaining"
                    textAlign={"right"}
                  />
                </FormControl>
              </HStack>

              <HStack w={"full"}>
                <Button
                  isDisabled={!isValid}
                  isLoading={isSubmitting}
                  onClick={() => handleSubmit()}
                  colorScheme="facebook"
                  w={"full"}
                >
                  Update
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};
