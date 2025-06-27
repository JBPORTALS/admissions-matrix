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
  NumberInput,
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
import React, { useCallback, useState } from "react";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc-cleint";
import { useAppSelector } from "@/store";
import { toaster } from "../ui/toaster";
import { LuSearch } from "react-icons/lu";
import { useUser } from "@/utils/auth";

const busAdmissionSchema = z.object({
  appId: z.string().min(1, "Required"),
  boardingPoint: z.string().min(1, "Required"),
  feeQuoted: z.string().min(1, "Fee quoted can not not be empty"),
  feeFixed: z.string().min(1, "Fee fixed can not be empty"),
});

export default function NewBusAdmissionDetailsDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, onOpenChange] = useState(false);
  const [student, setStudent] = useState<{
    name: string;
    reg_no: string;
    college: string;
    branch: string;
    id: string;
  }>();
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const utils = trpc.useUtils();
  const acadyear = useAppSelector((s) => s.admissions.acadYear);
  const { data, isLoading } = trpc.busBoardingList.useQuery(
    { routeId: "" },
    {
      enabled: open,
    }
  );
  const { mutateAsync: addStudent } = trpc.busAddStudent.useMutation({
    onSuccess() {
      toaster.info({ title: "Student details added" });
      onOpenChange(false);
    },
  });
  const form = useForm<z.infer<typeof busAdmissionSchema>>({
    resolver: zodResolver(busAdmissionSchema),
  });
  const user = useUser();

  async function onSubmit(values: z.infer<typeof busAdmissionSchema>) {
    await addStudent({
      acadyear,
      amountFixed: values.feeFixed,
      appId: values.appId,
      boardingPointId: values.boardingPoint,
    });
    await utils.busViewStudent.invalidate();
  }

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

  React.useEffect(() => {
    if (form.getValues().boardingPoint) {
      const boardingPoint = data?.data.find(
        (v) => v.id === form.getValues().boardingPoint
      );

      if (boardingPoint)
        form.resetField("feeQuoted", { defaultValue: boardingPoint.amount });
    }
  }, [form.getValues().boardingPoint]);

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
            <DrawerTitle>New Bus Admission</DrawerTitle>
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

                <DrawerBody spaceY={"4.5"}>
                  <FormField
                    control={form.control}
                    name="boardingPoint"
                    render={({ field }) => (
                      <FormItem pt={"3.5"}>
                        <FormLabel>Boarding Point</FormLabel>
                        <NativeSelect.Root disabled={isLoading}>
                          <NativeSelect.Field {...field}>
                            <option value={""}>Select</option>
                            {data?.data.map((r) => (
                              <option value={r.id}>
                                {r.route_no} - {r.boarding_point}
                              </option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="feeQuoted"
                    render={({ field }) => (
                      <FormItem readOnly>
                        <FormLabel>Fee Quoted</FormLabel>
                        <Input variant={"subtle"} {...field} />
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
                </DrawerBody>
                <DrawerFooter>
                  <Button
                    loading={form.formState.isSubmitting}
                    type="submit"
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
        </DrawerContent>
      </Form>
    </DrawerRoot>
  );
}
