import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input, Dialog, useDisclosure, Portal } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "@/store";
import { useSearchParams } from "next/navigation";
import { toaster } from "../ui/toaster";

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
  const acadyear = useAppSelector((state) => state.admissions.acadYear);
  const {
    open: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const { open, onClose, onOpen } = useDisclosure();
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
      toaster.error({
        title: error.response?.data.msg
          ? "Student Profile Already Exists"
          : "Network Error",
      });
    }
  }

  // console.log(formValues);

  return (
    <>
      <Dialog.Root size={"lg"}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Portal>
          <Dialog.Positioner>
            <Dialog.Backdrop />
            <Dialog.Content>
              {/* <Dialog.Header>Student Data Already Exists</Dialog.Header> */}

              <Dialog.Header>Verify the student details</Dialog.Header>
              <Dialog.CloseTrigger />
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
                        <Input placeholder="eg. 123CS19029" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="student_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {"Student Phone Number (optional)"}
                        </FormLabel>
                        <Input type="number" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="father_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {"Father Phone Number (optional)"}
                        </FormLabel>
                        <Input type="number" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mother_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {"Mother Phone Number (optional)"}
                        </FormLabel>
                        <Input type="number" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Dialog.Footer>
                    <Button
                      loadingText={"Getting Verify"}
                      loading={form.formState.isSubmitting}
                      type="submit"
                      colorScheme="facebook"
                    >
                      Verify <ArrowRight className="h-4 ml-2 w-4" />
                    </Button>
                  </Dialog.Footer>
                </form>
              </Form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
