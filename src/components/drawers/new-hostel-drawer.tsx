"use client";

import {
  Button,
  Input,
  InputGroup,
  NativeSelect,
  NumberInput,
  Textarea,
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
import { toaster } from "../ui/toaster";

const newHostelSchema = z.object({
  hostelName: z.string().min(1, "Required"),
  intake: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  fee: z.string().min(1, "Required"),
  address: z.string().min(2, "Required"),
  wardenName: z.string().min(2, "Required"),
  wardenNumber: z
    .string()
    .min(10, "Mobile number should be maximum 10 digits")
    .max(10, "Mobile number should be maximum 10 digits"),
});

export default function NewHostelDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, onOpenChange] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof newHostelSchema>>({
    resolver: zodResolver(newHostelSchema),
    mode: "onChange",
  });

  const { mutateAsync: hostelAdd } = trpc.hostelAdd.useMutation({
    async onSuccess() {
      toaster.success({ title: "Hostel created" });
      await utils.hostelList.invalidate();
      onOpenChange(false);
    },
  });

  async function onSubmit(values: z.infer<typeof newHostelSchema>) {
    await hostelAdd(values);
  }

  return (
    <DrawerRoot
      size={"sm"}
      open={open}
      onOpenChange={({ open }) => onOpenChange(open)}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerBackdrop backdropFilter={"blur(5px)"} bg={"Background/40"} />
      <DrawerContent>
        <Form {...form}>
          <DrawerHeader>
            <DrawerTitle>New Hostel</DrawerTitle>
          </DrawerHeader>

          <DrawerBody spaceY={"6"}>
            <FormField
              control={form.control}
              name="hostelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hostel Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intake</FormLabel>
                  <NumberInput.Root
                    w={"full"}
                    name={field.name}
                    onValueChange={({ value }) => field.onChange(value)}
                    value={field.value}
                  >
                    <NumberInput.Input onBlur={field.onBlur} />
                  </NumberInput.Root>
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
                  <NativeSelect.Root>
                    <NativeSelect.Field {...field}>
                      <option value={""}>Select</option>
                      <option value={"MALE"}>MALE</option>
                      <option value={"FEMALE"}>FEMALE</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hostel Address</FormLabel>
                  <Textarea {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee</FormLabel>
                  <InputGroup startAddon={"₹"}>
                    <NumberInput.Root
                      w={"full"}
                      name={field.name}
                      onValueChange={({ value }) => field.onChange(value)}
                      value={field.value}
                    >
                      <NumberInput.Input onBlur={field.onBlur} />
                    </NumberInput.Root>
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wardenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warden Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wardenNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warden Phone</FormLabel>
                  <InputGroup startAddon={"+91"}>
                    <Input {...field} />
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button
              loading={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>

          <DrawerCloseTrigger>
            <CloseButton size={"sm"} />
          </DrawerCloseTrigger>
        </Form>
      </DrawerContent>
    </DrawerRoot>
  );
}
