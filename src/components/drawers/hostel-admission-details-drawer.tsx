"use client";

import {
  Button,
  Center,
  Input,
  NativeSelect,
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
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc-cleint";
import { useAppSelector } from "@/store";
import { toaster } from "../ui/toaster";

const hostelAdmissionSchema = z.object({
  appId: z.string().min(1, "Required"),
  regno: z.string().min(1, "required"),
  name: z.string().min(2, "Required"),
  hostelId: z.string().min(1, "Required"),
  feeQuoted: z.string().min(1, "Required"),
  feeFixed: z.string().min(2, "Required"),
  feePaid: z.string().min(2, "Required"),
  feeBalance: z.string().min(2, "Required"),
  createdBy: z.string().min(1, "Required"),
});

export default function HostelAdmissionDetailsDrawer({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [open, onOpenChange] = useState(false);
  const acadyear = useAppSelector((s) => s.admissions.acadYear);
  const { data: student, isLoading } = trpc.hostelViewStudnet.useQuery(
    { id, acadyear },
    { enabled: open }
  );
  const { data: hostelList } = trpc.hostelList.useQuery(undefined, {
    enabled: open,
  });
  const { mutateAsync: editHostelStudent } = trpc.hostelEditStudent.useMutation(
    {
      onSuccess() {
        toaster.info({ title: "Details updated" });
        onOpenChange(false);
      },
    }
  );
  const form = useForm<z.infer<typeof hostelAdmissionSchema>>({
    resolver: zodResolver(hostelAdmissionSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open && student) {
      const { data } = student;
      form.reset({
        feeFixed: data.fee_fixed,
        feePaid: data.fee_paid,
        feeQuoted: data.fee_quoted,
        feeBalance: data.fee_balance,
        appId: data.appid,
        name: data.student_name,
        hostelId: data.hostel_id,
        createdBy: data.created_by,
        regno: data.reg_no,
      });
    }
  }, [open, student?.data]);

  useEffect(() => {
    if (open) {
      form.resetField("feeBalance", {
        defaultValue: (
          parseInt(form.getValues().feeFixed) -
          parseInt(form.getValues().feePaid)
        ).toString(),
      });
    }
  }, [form.getValues().feeFixed, form.getValues().feePaid, open]);

  async function onSubmit(values: z.infer<typeof hostelAdmissionSchema>) {
    await editHostelStudent({
      ...values,
      acadyear,
      id,
    });
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
            <DrawerTitle>Hostel Admission</DrawerTitle>
          </DrawerHeader>

          {isLoading ? (
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
                    <FormItem>
                      <FormLabel>Application ID</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reg no</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <Input variant={"subtle"} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="hostelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostel</FormLabel>
                      <NativeSelect.Root {...field}>
                        <NativeSelect.Indicator />
                        <NativeSelect.Field {...field}>
                          <option>Select</option>
                          {hostelList?.data.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.hostel_name}
                            </option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
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
                      <Input variant={"subtle"} readOnly {...field} />
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
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feeBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Balance</FormLabel>
                      <Input variant={"subtle"} readOnly {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created By</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DrawerBody>
              {/* <pre>{JSON.stringify(form.formState.errors)}</pre> */}

              <DrawerFooter>
                <Button
                  loading={form.formState.isLoading}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </DrawerFooter>
            </React.Fragment>
          )}
          <DrawerCloseTrigger>
            <CloseButton size={"sm"} />
          </DrawerCloseTrigger>
        </Form>
      </DrawerContent>
    </DrawerRoot>
  );
}
