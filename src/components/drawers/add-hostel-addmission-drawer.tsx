"use client";

import {
  Avatar,
  Button,
  Card,
  Center,
  HStack,
  Input,
  InputGroup,
  NativeSelect,
  Separator,
  Spinner,
  Stack,
  Strong,
  Text,
  VStack,
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
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc-cleint";
import { useAppSelector } from "@/store";
import { toaster } from "../ui/toaster";
import { LuSearch } from "react-icons/lu";
import { useUser } from "@/utils/auth";

const hostelAdmissionSchema = z.object({
  appId: z.string().min(1, "Required"),
  hostelId: z.string().min(1, "Required"),
  feeQuoted: z.string().min(1, "Required"),
  feeFixed: z.string().min(2, "Required"),
  feePaid: z.string().min(2, "Required"),
  feeBalance: z.string().min(2, "Required"),
});

export default function AddHostelAdmissionDetailsDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, onOpenChange] = useState(false);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [student, setStudent] = useState<{
    name: string;
    reg_no: string;
    college: string;
    branch: string;
    id: string;
  }>();
  const acadyear = useAppSelector((s) => s.admissions.acadYear);

  const { data: hostelList } = trpc.hostelList.useQuery(undefined, {
    enabled: open,
  });
  const utils = trpc.useUtils();
  const user = useUser();
  const form = useForm<z.infer<typeof hostelAdmissionSchema>>({
    resolver: zodResolver(hostelAdmissionSchema),
    mode: "onChange",
  });

  const { mutateAsync: addStudent } = trpc.hostelAddStudent.useMutation({
    onSuccess() {
      toaster.success({ title: "Admission created successful" });
      onOpenChange(false);
      form.reset();
    },
  });

  const searchApplication = useCallback(async () => {
    setIsStudentLoading(true);
    try {
      if (form.getValues().appId && user?.college) {
        const data = await utils.viewStudent.fetch({
          appId: form.getValues().appId,
          acadyear,
          college: user.college,
        });
        setStudent(data.data[0]);
      }
    } catch (e) {
      toaster.error({
        title: "Student doesn't exists or my be something went wrong!",
      });
      setStudent(undefined);
    }
    setIsStudentLoading(false);
  }, [form.getValues().appId]);

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
    await addStudent({ acadyear, ...values });
    await utils.getHostelMatrixBranch.invalidate();
  }

  useEffect(() => {
    form.resetField("feeQuoted", {
      defaultValue:
        hostelList?.data.find((v) => v.id === form.getValues().hostelId)?.fee ??
        "",
      keepTouched: true,
      keepDirty: true,
      keepError: false,
    });
  }, [form.watch().hostelId]);

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
            <DrawerTitle>New Hostel Admission</DrawerTitle>
          </DrawerHeader>

          <React.Fragment>
            <VStack
              bg={"AppWorkspace"}
              minH={"fit-content"}
              p={"4.5"}
              h={"fit"}
            >
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application ID</FormLabel>
                    <InputGroup startElement={<LuSearch size={16} />}>
                      <Input
                        placeholder="Search ..."
                        variant={"subtle"}
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") searchApplication();
                        }}
                      />
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </VStack>

            {isStudentLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : student ? (
              <React.Fragment>
                <VStack p={"4.5"}>
                  {" "}
                  <Card.Root width="full">
                    <Card.Body>
                      <HStack mb="6" gap="3">
                        <Avatar.Root>
                          <Avatar.Image />
                          <Avatar.Fallback name={student.name} />
                        </Avatar.Root>
                        <Stack gap="0">
                          <Text fontWeight="semibold" textStyle="sm">
                            {student.name}
                          </Text>
                          <Text color="fg.muted" textStyle="sm">
                            {student.reg_no}
                          </Text>
                        </Stack>
                      </HStack>
                      <Card.Description>
                        <Strong color="fg">{student.name} </Strong>
                        is studying in <Strong>{student.college}</Strong> -{" "}
                        <Strong>{student.branch}</Strong>
                      </Card.Description>
                    </Card.Body>
                  </Card.Root>
                </VStack>
                <Separator />
                <DrawerBody spaceY={"3"}>
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
            ) : null}
          </React.Fragment>

          <DrawerCloseTrigger>
            <CloseButton size={"sm"} />
          </DrawerCloseTrigger>
        </Form>
      </DrawerContent>
    </DrawerRoot>
  );
}
