"use client";

import {
  FormItem,
  Form,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchBranchList, fetchCollegeList } from "@/store/admissions.slice";
import {
  boardOptions,
  courseOptions,
  genderOptions,
  sourceOptions,
} from "@/utils/constants";
import {
  Box,
  Button,
  ButtonGroup,
  CheckboxCard,
  Float,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  NumberInput,
  RadioCard,
  SimpleGrid,
  Skeleton,
  Steps,
  Text,
  useStepsContext,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuBookA, LuBox, LuBuilding, LuBusFront } from "react-icons/lu";
import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

const studentVerificationSchema = z.object({
  regno: z.string().min(1, "Register number is required"),

  studentPhone: z
    .string()
    .regex(phoneRegex, "Invalid mobile number")
    .optional(),

  fatherPhone: z.string().regex(phoneRegex, "Invalid mobile number").optional(),

  motherPhone: z.string().regex(phoneRegex, "Invalid mobile number").optional(),
});

export function StudentVerificationForm() {
  const form = useForm<z.infer<typeof studentVerificationSchema>>({
    resolver: zodResolver(studentVerificationSchema),
  });

  const steps = useStepsContext();

  async function onSubmit(values: z.infer<typeof studentVerificationSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY={"6"}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="regno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Register Number</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Student Phone Number (Optional)"}</FormLabel>
                  <InputGroup startAddon={"+ 91"}>
                    <Input {...field} />
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Father Phone Number (Optional)"}</FormLabel>
                  <InputGroup startAddon={"+ 91"}>
                    <Input {...field} />
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <pre>{JSON.stringify(form.formState.errors, undefined, 2)}</pre> */}

            <FormField
              control={form.control}
              name="motherPhone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{"Mother Phone Number (Optional)"}</FormLabel>
                  <InputGroup startAddon={"+ 91"}>
                    <Input {...field} />
                  </InputGroup>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}

const studentDetailsSchema = z.object({
  studentName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required" })
    .array(),

  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),

  email: z.string().email("Invalid email address"),

  address: z.string().min(5, "Address is too short"),

  city: z.string().min(2, "City is required"),

  state: z.string().min(2, "State is required"),
});

export function StudentDetailsForm() {
  const form = useForm<z.infer<typeof studentDetailsSchema>>({
    resolver: zodResolver(studentDetailsSchema),
  });

  const steps = useStepsContext();

  async function onSubmit(values: z.infer<typeof studentDetailsSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY="6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <SelectRoot
                    name={field.name}
                    value={field.value}
                    collection={genderOptions}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select gender" />
                    </SelectTrigger>

                    <SelectContent>
                      {genderOptions.items.map((item) => (
                        <SelectItem key={item.value} item={item}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aadharNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Number</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Steps.PrevTrigger asChild>
                <Button variant={"subtle"}>Prev</Button>
              </Steps.PrevTrigger>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}

const academicBackgroundSchema = z.object({
  previousSchoolOrCollege: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Too long"),

  board: z
    .enum(["SSLC", "FEMALE", "OTHER"], { message: "Gender is required" })
    .array(),

  overallPercentage: z.string().regex(/^\d{3}$/, "Invalid overall percentage"),
});

export function AcademicBackgroundForm() {
  const form = useForm<z.infer<typeof academicBackgroundSchema>>({
    resolver: zodResolver(academicBackgroundSchema),
  });

  const steps = useStepsContext();

  async function onSubmit(values: z.infer<typeof academicBackgroundSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY="6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="previousSchoolOrCollege"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous School/College</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="board"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board</FormLabel>
                  <SelectRoot
                    name={field.name}
                    value={field.value}
                    collection={boardOptions}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Board" />
                    </SelectTrigger>

                    <SelectContent>
                      {boardOptions.items.map((item) => (
                        <SelectItem key={item.value} item={item}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overallPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Percentage / CGPA</FormLabel>
                  <NumberInput.Root
                    w={"full"}
                    disabled={field.disabled}
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => {
                      field.onChange(value);
                    }}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Steps.PrevTrigger asChild>
                <Button variant={"subtle"}>Prev</Button>
              </Steps.PrevTrigger>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}

const courseSelectionSchema = z.object({
  course: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Too long"),

  college: z.string().min(1, "Required"),
  branch: z.string().min(1, "Required"),
});

export function CourseSelectionForm() {
  const form = useForm<z.infer<typeof courseSelectionSchema>>({
    resolver: zodResolver(courseSelectionSchema),
    defaultValues: {
      course: courseOptions.firstValue ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const collegeList = useAppSelector(
    (state) => state.admissions.collegeList.data
  ) as { value: string; option: string }[];
  const collegeListPending = useAppSelector(
    (state) => state.admissions.collegeList.pending
  );

  const branchList = useAppSelector(
    (state) => state.admissions.branchlist.data
  ) as { value: string; option: string }[];
  const branchListPending = useAppSelector(
    (state) => state.admissions.collegeList.pending
  );

  const steps = useStepsContext();
  const course = form.watch().course;
  const college = form.watch().college;

  useEffect(() => {
    dispatch(fetchCollegeList({ course }));
    form.setValue("college", "");
    form.setValue("branch", "");
  }, [course, dispatch]);

  useEffect(() => {
    dispatch(fetchBranchList({ college }));
  }, [college, dispatch]);

  async function onSubmit(values: z.infer<typeof courseSelectionSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY="6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <RadioCard.Root
                    name={field.name}
                    value={field.value}
                    align="center"
                    variant={"surface"}
                    onValueChange={(e) => field.onChange(e.value)}
                  >
                    <RadioCard.Label asChild>
                      <FormLabel>Course</FormLabel>
                    </RadioCard.Label>
                    <HStack align="stretch">
                      {courseOptions.items.map((item) => (
                        <RadioCard.Item key={item.value} value={item.value}>
                          <RadioCard.ItemHiddenInput onBlur={field.onBlur} />
                          <RadioCard.ItemControl>
                            <Icon fontSize="lg" color="fg.muted">
                              <LuBookA />
                            </Icon>
                            <RadioCard.ItemText>
                              {item.label}
                            </RadioCard.ItemText>
                            <RadioCard.ItemIndicator />
                          </RadioCard.ItemControl>
                        </RadioCard.Item>
                      ))}
                    </HStack>
                  </RadioCard.Root>
                  <FormMessage />
                </FormItem>
              )}
            />

            {course && (
              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <RadioCard.Root
                      align="center"
                      variant={"surface"}
                      name={field.name}
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                    >
                      <RadioCard.Label asChild>
                        <FormLabel>College</FormLabel>
                      </RadioCard.Label>
                      <HStack align="stretch">
                        {collegeListPending
                          ? Array.from({ length: 4 }).map((_, i) => (
                              <Skeleton h={"14"} minW={"200px"} />
                            ))
                          : collegeList.map((item) => (
                              <RadioCard.Item
                                key={item.value}
                                value={item.value}
                              >
                                <RadioCard.ItemHiddenInput
                                  onBlur={field.onBlur}
                                />
                                <RadioCard.ItemControl>
                                  <Icon fontSize="lg" color="fg.muted">
                                    <LuBuilding />
                                  </Icon>
                                  <RadioCard.ItemText>
                                    {item.option}
                                  </RadioCard.ItemText>
                                  <RadioCard.ItemIndicator />
                                </RadioCard.ItemControl>
                              </RadioCard.Item>
                            ))}
                      </HStack>
                    </RadioCard.Root>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {course && college && (
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <RadioCard.Root
                      align="center"
                      variant={"surface"}
                      name={field.name}
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                    >
                      <RadioCard.Label asChild>
                        <FormLabel>Branch</FormLabel>
                      </RadioCard.Label>
                      <HStack flexShrink={"0"} flexWrap={"wrap"}>
                        {branchListPending
                          ? Array.from({ length: 4 }).map((_, i) => (
                              <Skeleton h={"14"} minW={"200px"} />
                            ))
                          : branchList.map((item) => (
                              <RadioCard.Item
                                key={item.value}
                                value={item.value}
                                minW={"3xs"}
                                minH={"80px"}
                              >
                                <RadioCard.ItemHiddenInput
                                  onBlur={field.onBlur}
                                />
                                <RadioCard.ItemControl>
                                  <Icon fontSize="lg" color="fg.muted">
                                    <LuBox />
                                  </Icon>
                                  <RadioCard.ItemText>
                                    {item.option}
                                  </RadioCard.ItemText>
                                  <RadioCard.ItemIndicator />
                                </RadioCard.ItemControl>
                              </RadioCard.Item>
                            ))}
                      </HStack>
                    </RadioCard.Root>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <ButtonGroup>
              <Steps.PrevTrigger asChild>
                <Button variant={"subtle"}>Prev</Button>
              </Steps.PrevTrigger>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}

const facilitiesSchema = z.object({
  fixedFee: z.number(),

  hostelFacility: z.boolean(),
  busFacility: z.boolean(),
});

export function FacilitiesForm() {
  const form = useForm<z.infer<typeof facilitiesSchema>>({
    resolver: zodResolver(facilitiesSchema),
    defaultValues: {
      hostelFacility: false,
      busFacility: false,
      fixedFee: 40000,
    },
  });

  const steps = useStepsContext();

  async function onSubmit(values: z.infer<typeof facilitiesSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY="6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fixedFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Fixed Fee Amount</FormLabel>
                  <Heading size={"4xl"}>
                    {field.value.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </Heading>
                  <FormMessage />
                </FormItem>
              )}
            />

            <VStack alignItems={"start"} w={"full"}>
              <Text>Other Facilities</Text>

              <SimpleGrid
                minBlockSize={"64px"}
                w={"xl"}
                minChildWidth={"80px"}
                gap="2"
              >
                <FormField
                  control={form.control}
                  name="busFacility"
                  render={({ field }) => (
                    <FormItem>
                      <CheckboxCard.Root
                        name={field.name}
                        align="center"
                        w={"full"}
                        orientation={"vertical"}
                        variant={"surface"}
                        checked={field.value}
                        onCheckedChange={(e) => field.onChange(e.checked)}
                      >
                        <CheckboxCard.HiddenInput onBlur={field.onBlur} />
                        <CheckboxCard.Control>
                          <CheckboxCard.Content flexDir={"row"}>
                            <Icon fontSize={"2xl"} color={"fg.muted"}>
                              <LuBusFront />
                            </Icon>
                            <CheckboxCard.Label>
                              Bus Facility
                            </CheckboxCard.Label>
                          </CheckboxCard.Content>
                          <Float placement="top-end" offset="6">
                            <CheckboxCard.Indicator />
                          </Float>
                        </CheckboxCard.Control>
                      </CheckboxCard.Root>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hostelFacility"
                  render={({ field }) => (
                    <FormItem>
                      <CheckboxCard.Root
                        name={field.name}
                        align="center"
                        orientation={"vertical"}
                        variant={"surface"}
                        w={"full"}
                        checked={field.value}
                        onCheckedChange={(e) => field.onChange(e.checked)}
                      >
                        <CheckboxCard.HiddenInput onBlur={field.onBlur} />
                        <CheckboxCard.Control>
                          <CheckboxCard.Content flexDir={"row"}>
                            <Icon fontSize={"2xl"} color={"fg.muted"}>
                              <LuBuilding />
                            </Icon>
                            <CheckboxCard.Label>
                              Hostel Facility
                            </CheckboxCard.Label>
                          </CheckboxCard.Content>
                          <Float placement="top-end" offset="6">
                            <CheckboxCard.Indicator />
                          </Float>
                        </CheckboxCard.Control>
                      </CheckboxCard.Root>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SimpleGrid>
            </VStack>
            <ButtonGroup>
              <Steps.PrevTrigger asChild>
                <Button variant={"subtle"}>Prev</Button>
              </Steps.PrevTrigger>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}

const familyInfoSchema = z.object({
  fatherName: z.string().min(1, "Required"),
  motherName: z.string().min(1, "Required"),
  fatherPhone: z.string().regex(phoneRegex),
  motherPhone: z.string().regex(phoneRegex),
});

export function FamilyInfoSchema() {
  const form = useForm<z.infer<typeof familyInfoSchema>>({
    resolver: zodResolver(familyInfoSchema),
  });

  const steps = useStepsContext();

  async function onSubmit(values: z.infer<typeof familyInfoSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY={"6"}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fatherPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father Phone Number</FormLabel>
                  <InputGroup startAddon={"+ 91"}>
                    <Input type="number" {...field} />
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motherPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother Phone Number</FormLabel>
                  <InputGroup startAddon={"+ 91"}>
                    <Input type="number" {...field} />
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Steps.PrevTrigger asChild>
                <Button variant={"subtle"}>Prev</Button>
              </Steps.PrevTrigger>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}

const referalSchema = z.object({
  referalSource: z.string().min(1, "Required").array(),
  councelledBy: z.string().min(1, "Required"),
  recommendedBy: z.string().min(1, "Required"),
});

export function ReferalForm() {
  const form = useForm<z.infer<typeof referalSchema>>({
    resolver: zodResolver(referalSchema),
  });

  const steps = useStepsContext();

  async function onSubmit(values: z.infer<typeof referalSchema>) {
    steps.goToNextStep();
  }

  return (
    <React.Fragment>
      <Form {...form}>
        <Box asChild spaceY={"6"}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="referalSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referal Source</FormLabel>
                  <SelectRoot
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                    collection={sourceOptions}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Source of Aware" />
                    </SelectTrigger>

                    <SelectContent>
                      {sourceOptions.items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="councelledBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Councelled By</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommended By</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonGroup>
              <Steps.PrevTrigger asChild>
                <Button variant={"subtle"}>Prev</Button>
              </Steps.PrevTrigger>
              <Button type="submit">Next</Button>
            </ButtonGroup>
          </form>
        </Box>
      </Form>
    </React.Fragment>
  );
}
