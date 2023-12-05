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
import { COLLEGES } from "@/utils/constants";
import { AiOutlineSelect } from "react-icons/ai";
import axios from "axios";
import { Formik, Field, FormikValues, useFormikContext } from "formik";

interface props {
  children: ({ onOpen }: { onOpen: () => void }) => JSX.Element;
}

let initialState = {
  fee: "",
  intake: "",
  alloted: "",
  remaining: "",
  college: "",
  branch: "",
  category: "",
};

export default function MIFModal({ children }: props) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [college, setCollege] = useState("");
  const [category, setCategory] = useState("REGULAR");
  const [branch, setBranch] = useState("");
  const [details, setDetails] = useState([]);

  const colleges = useAppSelector((state) => state.admissions.colleges);
  const branches = useAppSelector((state) => state.admissions.branchlist.data);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBaseColleges());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBranchList({ college }));
  }, [college, dispatch]);

  const fetchDetails = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("college", college);
      formData.append("branch", branch);
      formData.append("category", category);
      const response = await axios({
        url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "admissionretrieve.php",
        method: "POST",
        data: formData,
      });

      setDetails(response.data);
      initialState.alloted = response.data[0].allotted_seats ?? 0;
      initialState.remaining = response.data[0].remaining_seats ?? 0;
      initialState.fee = response.data[0].fee ?? 0;
      initialState.intake = response.data[0].intake ?? 0;
      console.log(response.data);
    } catch (e) {}
  }, [college, branch]);

  useEffect(() => {
    if (college && branch) fetchDetails();
  }, [college, branch]);
  return (
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
        <Tabs
          variant={"solid-rounded"}
          size={"sm"}
          lazyBehavior="unmount"
          fill={"Background"}
          colorScheme="gray"
          isFitted
        >
          <TabList mb={0} p={"3"} px={"5"}>
            <Tab>Regular</Tab>
            <Tab>Lateral Entry</Tab>
          </TabList>
          <TabPanels px={5}>
            <TabPanel>
              <VStack>
                <FormControl>
                  <FormLabel>College</FormLabel>
                  <Select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  >
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
                  <Select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value={""}>Select</option>
                    {branches.map((value: any, index) => (
                      <option value={value.value} key={value.value}>
                        {value.option}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Divider size={"2"} />
                {!branch || !college ? (
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
                  <DetailsCard {...{ college, branch, category }} />
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </IDrawer>
      {children({ onOpen })}
    </>
  );
}

const FormikContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { values, setFieldValue } = useFormikContext<typeof initialState>();

  useEffect(() => {
    setFieldValue("remaining", +(+values.intake - +values.alloted));
  }, [values.intake, values.alloted, setFieldValue]);

  return <>{children}</>;
};

function DetailsCard({
  college,
  branch,
  category,
}: {
  college: string;
  branch: string;
  category: string;
}) {
  const toast = useToast();

  const updateDetails = useCallback<(values: FormikValues) => Promise<void>>(
    async (values) => {
      try {
        const formData = new FormData();
        formData.append("intake", values.intake);
        formData.append("fee", values.fee);
        formData.append("alloted_seats", values.alloted);
        formData.append("remaining_seats", values.remaining);
        formData.append("college", college);
        formData.append("branch", branch);
        formData.append("category", category);

        const response = await axios({
          url: process.env.NEXT_PUBLIC_ADMISSIONS_URL + "admissionupdate.php",
          method: "POST",
          data: formData,
        });

        if (response.status == 200)
          toast({
            colorScheme: "blue",
            variant: "subtle",
            title: "Detiails Updated",
            description:
              "You have to refresh the page to see the updated details.",
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
    <Card w={"full"}>
      <CardHeader>
        <Heading color={"gray.600"} size={"md"}>
          Details
        </Heading>
      </CardHeader>
      <CardBody>
        <Formik
          enableReinitialize
          initialValues={initialState}
          onSubmit={async (values) => {
            await updateDetails(values);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <FormikContextProvider>
              <VStack divider={<Divider />}>
                <HStack w={"full"} justifyContent={"space-between"}>
                  <b>Fee</b>{" "}
                  <FormControl w={"40"}>
                    <InputGroup>
                      <InputLeftAddon>₹</InputLeftAddon>
                      <Field
                        as={Input}
                        name={"fee"}
                        type="number "
                        textAlign={"right"}
                      />
                    </InputGroup>
                  </FormControl>
                </HStack>
                <HStack w={"full"} justifyContent={"space-between"}>
                  <b>Intake</b>
                  <FormControl w={"40"}>
                    <Field
                      as={Input}
                      name={"intake"}
                      type="number"
                      textAlign={"right"}
                    />
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
                    isLoading={isSubmitting}
                    onClick={() => handleSubmit()}
                    colorScheme="facebook"
                    w={"full"}
                  >
                    Update
                  </Button>
                </HStack>
              </VStack>
            </FormikContextProvider>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
}
