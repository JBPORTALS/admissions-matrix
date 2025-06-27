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
import { useRouter } from "next/navigation";

const newHostelSchema = z.object({
  routeNo: z.string().min(1, "Required"),
  lastPoint: z.string().min(1, "Required"),
  driverName: z.string().min(1, "Required"),
  driverNumber: z.string().min(1, "Required"),
});

export function NewBusRouteDrawer({ children }: { children: React.ReactNode }) {
  const [open, onOpenChange] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof newHostelSchema>>({
    resolver: zodResolver(newHostelSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const { mutateAsync: busRouteAdd } = trpc.busRouteAdd.useMutation({
    async onSuccess() {
      toaster.success({ title: "Hostel created" });
      await utils.busRouteList.invalidate();
      router.refresh();
      onOpenChange(false);
    },
  });

  async function onSubmit(values: z.infer<typeof newHostelSchema>) {
    await busRouteAdd(values);
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
            <DrawerTitle>New Bus Route</DrawerTitle>
          </DrawerHeader>

          <DrawerBody spaceY={"6"}>
            <FormField
              control={form.control}
              name="routeNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route No</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Point</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driverNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Number</FormLabel>
                  <Input {...field} />
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
