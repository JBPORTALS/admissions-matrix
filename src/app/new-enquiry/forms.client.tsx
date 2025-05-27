"use client";

import {
  FormItem,
  Form,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { genderOptions } from "@/utils/constants";
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Steps,
  useStepsContext,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

const studentVerificationSchema = z.object({
  regno: z.string().min(1, "Register number is required"),

  studentPhone: z.string().regex(phoneRegex, "Invalid mobile number"),

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
                  <FormLabel>Student Phone Number</FormLabel>
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
                  <Input {...field} />
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
                  <FormLabel>Mother Phone Number</FormLabel>
                  <Input {...field} />
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
