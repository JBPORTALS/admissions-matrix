"use client";

import {
  Button,
  Center,
  Input,
  InputGroup,
  NativeSelect,
  NumberInput,
  Spinner,
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

const editHostelSchema = z.object({
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

export function EditHostelDrawer({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [open, onOpenChange] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof editHostelSchema>>({
    resolver: zodResolver(editHostelSchema),
    mode: "onChange",
  });
  const router = useRouter();

  const { data: hostel, isLoading } = trpc.getHostelById.useQuery(
    { hostelId: id },
    { enabled: open }
  );

  const { mutateAsync: hostelEdit } = trpc.hostelEdit.useMutation({
    async onSuccess() {
      toaster.info({ title: "Hostel details updated" });
      await utils.hostelList.invalidate();
      router.refresh();
      onOpenChange(false);
    },
  });

  React.useEffect(() => {
    if (open && hostel)
      form.reset({
        address: hostel.address,
        hostelName: hostel.hostel_name,
        wardenName: hostel.warden_name,
        wardenNumber: hostel.warden_number,
        fee: hostel.fee.toString(),
        intake: hostel.intake,
        gender: hostel.gender,
      });
  }, [open, hostel, form]);

  async function onSubmit(values: z.infer<typeof editHostelSchema>) {
    await hostelEdit({ ...values, id });
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
            <DrawerTitle>Edit Hostel</DrawerTitle>
          </DrawerHeader>

          {isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <React.Fragment>
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
