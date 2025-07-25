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
  Heading,
  Text,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useCallback } from "react";
import axios from "axios";
import {
  Formik,
  Field as FormikField,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { toaster } from "@/components/ui/toaster";
import { LuSettings2, LuSquareMousePointer } from "react-icons/lu";
import { useUser } from "@/utils/auth";
import { categoryOptions } from "@/utils/constants";

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
  category: "",
  cet: "",
  comedk: "",
};

export default function Page() {
  const acadYear = useAppSelector((state) => state.admissions.acadYear);
  const user = useUser();

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
    [acadYear]
  );

  if (user?.college !== "MANAGEMENT")
    return (
      <Center w={"full"} h={"64"}>
        <VStack>
          <Heading>You don&apos;t have permission for this setting</Heading>
          <Text color={"fg.muted"}>
            If you need any changes contact your admin / office with respective
            college to manage intake & fee.
          </Text>
        </VStack>
      </Center>
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
      <VStack w={"full"} px={"32"} alignItems={"start"} gap={"8"}>
        <VStack gap={"0"} alignItems={"start"}>
          <Heading>Manage Intake & Fee Settings</Heading>
          <Text>Manage all colleges intake of admissions</Text>
        </VStack>
        <FormikContextProvider />
      </VStack>
    </Formik>
  );
}

const FormikContextProvider = () => {
  const {
    values,
    setFieldValue,
    handleReset,
    handleSubmit,
    isSubmitting,
    handleChange,
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

      if (values.category === "REGULAR") {
        setFieldValue("comedk", response.data[0].comedk ?? 0);
        setFieldValue("cet", response.data[0].cet ?? 0);
      }
    } catch (e) {
      handleReset();
      console.error(e);
      toaster.error({ title: "Something went wrong" });
    }
  }, [
    values.branch,
    values.college,
    values.category,
    acadYear,
    handleReset,
    setFieldValue,
  ]);

  useEffect(() => {
    if (values.college && values.branch && values.category) fetchDetails();
  }, [values.college, values.branch, fetchDetails, values.category]);

  useEffect(() => {
    setFieldValue("remaining", +(+values.intake - +values.alloted));
  }, [values.intake, values.alloted, setFieldValue]);

  useEffect(() => {
    setFieldValue("total", +(+values.intake + +values.cet + +values.comedk));
  }, [values.intake, values.cet, values.comedk, setFieldValue]);

  return (
    <VStack gap={"2.5"} w={"full"}>
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
      <Field.Root>
        <Field.Label>Category</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field name="category" onChange={handleChange}>
            <option value={""}>Select</option>
            {categoryOptions.items.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Separator size={"sm"} w={"full"} />

      {!values.branch || !values.college || !values.category ? (
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

                  {values.category === "REGULAR" && (
                    <>
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
                  )}
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
