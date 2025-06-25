"use client";

import {
  Button,
  Center,
  Input,
  NumberInput,
  Separator,
  Spinner,
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { CloseButton } from "../ui/close-button";
import React, { useState } from "react";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc-cleint";
import { useAppSelector } from "@/store";

const busAdmissionSchema = z.object({
  appId: z.string().min(1, "Required"),
  name: z.string().min(2, "Required"),
  phone: z.string().min(10, "Must be 10 digits").max(10, "Maximum 10 digits"),
  college: z.string().min(1, "Required"),
  branch: z.string().min(1, "Required"),
  fatherName: z.string().min(2, "Required"),
  fatherPhone: z
    .string()
    .min(10, "Must be 10 digits")
    .max(10, "Maximum 10 digits"),
  boardingPoint: z.string().min(1, "Required"),
  feeQuoted: z.string().min(1, "Fee quoted can not not be empty"),
  feeFixed: z.string().min(1, "Fee fixed can not be empty"),
  feePaid: z.string().min(1, "Fee paid can not be empty"),
});

export default function BusAdmissionDetailsDrawer({
  children,
  appId,
}: {
  children: React.ReactNode;
  appId: string;
}) {
  const [open, onOpenChange] = useState(false);
  const utils = trpc.useUtils();
  const acadyear = useAppSelector((s) => s.admissions.acadYear);
  const form = useForm<z.infer<typeof busAdmissionSchema>>({
    resolver: zodResolver(busAdmissionSchema),
    async defaultValues() {
      const { data } = await utils.busViewStudent.fetch({ appId, acadyear });
      return {
        feeFixed: data.fee_fixed,
        feePaid: data.fee_paid,
        feeQuoted: data.fee_quoted,
        appId: data.id,
        fatherName: data.fname,
        fatherPhone: data.father_no,
        boardingPoint: data.boarding_point_id,
        branch: data.branch,
        college: data.college,
        name: data.name,
        phone: data.phone_no,
      };
    },
    progressive: true,
  });

  async function onSubmit(values: z.infer<typeof busAdmissionSchema>) {
    alert("no errors");
  }

  return (
    <DrawerRoot
      size={"sm"}
      open={open}
      onOpenChange={({ open }) => onOpenChange(open)}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerBackdrop backdropFilter={"blur(5px)"} bg={"Background/40"} />
      <Form {...form}>
        <DrawerContent asChild>
          <DrawerHeader>
            <DrawerTitle>Bus Admission</DrawerTitle>
          </DrawerHeader>
          {form.formState.isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <React.Fragment>
              <DrawerBody spaceY={"3"}>
                <FormField
                  control={form.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem readOnly>
                      <FormLabel>Application ID</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem readOnly>
                      <FormLabel>Student Name</FormLabel>
                      <Input variant={"subtle"} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem readOnly>
                      <FormLabel>Student Phone</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem readOnly>
                      <FormLabel>College</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem readOnly>
                      <FormLabel>Branch</FormLabel>
                      <Input variant={"subtle"} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem readOnly>
                      <FormLabel>Father Name</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatherPhone"
                  render={({ field }) => (
                    <FormItem readOnly pb={"3.5"}>
                      <FormLabel>Father Phone</FormLabel>
                      <Input variant={"subtle"} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="boardingPoint"
                  render={({ field }) => (
                    <FormItem pt={"3.5"}>
                      <FormLabel>Boarding Point</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feeQuoted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Quoted</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feeFixed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Fixed</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feePaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Paid</FormLabel>
                      <NumberInput.Root
                        value={field.value}
                        w={"full"}
                        onValueChange={({ value }) => field.onChange(value)}
                      >
                        <NumberInput.Input
                          name={field.name}
                          onBlur={field.onBlur}
                        />
                      </NumberInput.Root>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DrawerBody>
              <DrawerFooter>
                <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                  Save
                </Button>
              </DrawerFooter>
            </React.Fragment>
          )}

          <DrawerCloseTrigger>
            <CloseButton size={"sm"} />
          </DrawerCloseTrigger>
        </DrawerContent>
      </Form>
    </DrawerRoot>
  );
}
