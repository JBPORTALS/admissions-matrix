"use client";

import { Button, Input } from "@chakra-ui/react";
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
import React from "react";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  boardingPoint: z.string().min(2, "Required"),
  amount: z.string().min(2, "Required"),
});

export default function BusAdmissionDetailsDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof busAdmissionSchema>>({
    resolver: zodResolver(busAdmissionSchema),
  });

  async function onSubmit(values: z.infer<typeof busAdmissionSchema>) {}

  return (
    <DrawerRoot size={"sm"}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerBackdrop backdropFilter={"blur(5px)"} bg={"Background/40"} />
      <Form {...form}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Bus Admission</DrawerTitle>
          </DrawerHeader>
          <DrawerBody spaceY={"3"}>
            <FormField
              control={form.control}
              name="appId"
              render={({ field }) => (
                <FormItem readOnly>
                  <FormLabel>Application ID</FormLabel>
                  <Input readOnly {...field} />
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
                  <Input {...field} />
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
                  <Input readOnly {...field} />
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
                  <Input readOnly {...field} />
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
                  <Input {...field} />
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
                  <Input readOnly {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherPhone"
              render={({ field }) => (
                <FormItem readOnly>
                  <FormLabel>Father Phone</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="boardingPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boarding Point</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button>Save</Button>
          </DrawerFooter>
          <DrawerCloseTrigger>
            <CloseButton size={"sm"} />
          </DrawerCloseTrigger>
        </DrawerContent>
      </Form>
    </DrawerRoot>
  );
}
