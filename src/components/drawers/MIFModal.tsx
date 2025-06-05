"use client";

import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchBaseColleges, fetchBranchList } from "@/store/admissions.slice";
import {
  Button,
  Card,
  Separator,
  HStack,
  Input,
  InputGroup,
  VStack,
  Field,
  NativeSelect,
  EmptyState,
} from "@chakra-ui/react";
import { useEffect, useCallback } from "react";
import axios from "axios";
import {
  Formik,
  Field as FormikField,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { toaster } from "../ui/toaster";
import {
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { LuSquareMousePointer } from "react-icons/lu";

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

export function MIFModalButton() {
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
          toaster.success({ title: "Seat Matrix Updated." });
      } catch (e: any) {
        toaster.error({ title: "Something went wrong!" });
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
      <DrawerRoot size={"sm"}>
        <DrawerTrigger asChild>
          <Button>MIF Settings</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <VStack gap={"0"}>
              <DrawerTitle>Manage Intake & Fee Settings</DrawerTitle>
              <DrawerDescription>
                Manage all colleges intake of admissions
              </DrawerDescription>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <FormikContextProvider />
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
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
      toaster.error({ title: "Something went wrong" });
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
    <VStack>
      {/* <pre>{JSON.stringify(errors)}</pre> */}

      <Field.Root>
        <Field.Label>College</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field name="college" onChange={handleChange}>
            <option value={""}>Select</option>
            {colleges.map((value: any, index) => (
              <option value={value.value} key={value.value}>
                {value.option}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>Branch</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field name="branch" onChange={handleChange}>
            <option value={""}>Select</option>
            {branches.map((value: any, index) => (
              <option value={value.value} key={value.value}>
                {value.option}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>
      <Separator size={"sm"} />
      {!values.branch || !values.college ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuSquareMousePointer />
            </EmptyState.Indicator>
            <VStack align={"center"}>
              <EmptyState.Title textAlign={"center"}>
                Select College & Branch
              </EmptyState.Title>
              <EmptyState.Description>
                You need select the inputs to retrieve the data
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Card.Root w={"full"}>
          <Card.Header>
            <Card.Title>Details</Card.Title>
          </Card.Header>
          <Card.Body>
            <VStack gap={"3"}>
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Fee</b>{" "}
                <Field.Root invalid={!!touched.fee && !!errors.fee} w={"40"}>
                  <InputGroup startAddon={"₹"}>
                    <FormikField
                      as={Input}
                      name={"fee"}
                      type="number "
                      textAlign={"right"}
                    />
                  </InputGroup>
                  <Field.ErrorText fontSize={"xs"}>
                    {errors.fee}
                  </Field.ErrorText>
                </Field.Root>
              </HStack>
              {values.college === "KSIT" ||
              values.college === "KSSEM" ||
              values.college === "KSDC" ? (
                <>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <b>Total Seats</b>
                    <Field.Root readOnly w={"40"}>
                      <FormikField
                        as={Input}
                        isReadOnly
                        name={"total"}
                        type="number"
                        textAlign={"right"}
                      />
                    </Field.Root>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <b>CET & SNQ</b>
                    <Field.Root
                      w={"40"}
                      invalid={!!touched.cet && !!errors.cet}
                    >
                      <FormikField
                        as={Input}
                        name={"cet"}
                        type="number"
                        textAlign={"right"}
                      />
                      <Field.ErrorText fontSize={"xs"}>
                        {errors.cet}
                      </Field.ErrorText>
                    </Field.Root>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <b>COMEDK</b>
                    <Field.Root
                      w={"40"}
                      invalid={!!touched.comedk && !!errors.comedk}
                    >
                      <FormikField
                        as={Input}
                        name={"comedk"}
                        type="number"
                        textAlign={"right"}
                      />
                      <Field.ErrorText fontSize={"xs"}>
                        {errors.comedk}
                      </Field.ErrorText>
                    </Field.Root>
                  </HStack>
                </>
              ) : null}
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Management</b>
                <Field.Root
                  w={"40"}
                  invalid={!!touched.intake && !!errors.intake}
                >
                  <FormikField
                    as={Input}
                    name={"intake"}
                    type="number"
                    textAlign={"right"}
                  />
                  <Field.ErrorText fontSize={"xs"}>
                    {errors.intake}
                  </Field.ErrorText>
                </Field.Root>
              </HStack>
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Alloted Seats</b>
                <Field.Root readOnly w={"40"}>
                  <FormikField
                    as={Input}
                    isReadOnly
                    name={"alloted"}
                    type="number"
                    textAlign={"right"}
                  />
                </Field.Root>
              </HStack>
              <HStack w={"full"} justifyContent={"space-between"}>
                <b>Remaining Seats</b>
                <Field.Root readOnly w={"40"}>
                  <FormikField
                    as={Input}
                    isReadOnly
                    type="number"
                    name="remaining"
                    textAlign={"right"}
                  />
                </Field.Root>
              </HStack>

              <HStack w={"full"}>
                <Button
                  disabled={!isValid}
                  loading={isSubmitting}
                  onClick={() => handleSubmit()}
                  colorScheme="facebook"
                  w={"full"}
                >
                  Update
                </Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </VStack>
  );
};
