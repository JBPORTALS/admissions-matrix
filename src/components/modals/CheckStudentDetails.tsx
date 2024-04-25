import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AddCouncelAddmissionModel from "./AddCouncelAdmissionModal";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "@/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface props {
  children: React.ReactNode;
}

const formSchema = z.object({
  reg_no: z.string().min(2, "Required").max(20, "Invalid Register Number"),
  student_no: z.string().optional(),
  father_no: z.string().optional(),
  mother_no: z.string().optional(),
});

export default function CheckStudentDetails({ children }: props) {
  const searchParams = useSearchParams();
  const toast = useToast();
  const acadyear = useAppSelector((state) => state.admissions.acadYear);
  const {
    isOpen: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reg_no: "",
      father_no: "",
      student_no: "",
      mother_no: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const formValues = form.getValues();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const fd = new FormData();
      fd.append("acadyear", acadyear);
      fd.append("reg_no", values.reg_no);
      fd.append("student_no", values.student_no ?? "");
      fd.append("mother_no", values.mother_no ?? "");
      fd.append("father_no", values.father_no ?? "");
      const res = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "verify.php",
        {
          data: fd,
          method: "POST",
        }
      );
      onConfirmClose();
      onOpen();
    } catch (e: unknown) {
      const error = e as AxiosError<any, any>;
      // console.log(error);
      toast({
        colorScheme: "red",
        title: error.response?.data.msg
          ? "Student Profile Already Exists"
          : "Network Error",
        description: error.response?.data.msg,
        position: "top",
        isClosable: true,
        duration: 15000,
      });
    }
  }

  // console.log(formValues);

  return (
    <>
      <AddCouncelAddmissionModel
        student_no={formValues.student_no}
        father_no={formValues.father_no}
        mother_no={formValues.mother_no}
        reg_no={formValues.reg_no}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Button variant={"unstyled"} onClick={onConfirmOpen}>
        {children}
      </Button>
      <Modal size={"lg"} isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Student Data Already Exists</ModalHeader> */}

          <ModalHeader>Verify the student details</ModalHeader>
          <ModalCloseButton />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-6"
            >
              <FormField
                control={form.control}
                name="reg_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register Number</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. 123CS19029" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="student_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Studnet Phone Number (optional)"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="father_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Father Phone Number (optional)"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mother_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Mother Phone Number (optional)"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  loadingText={"Getting Verify"}
                  isLoading={form.formState.isSubmitting}
                  type="submit"
                  colorScheme="facebook"
                >
                  Verify <ArrowRight className="h-4 ml-2 w-4" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
