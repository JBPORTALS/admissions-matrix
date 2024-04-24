import { VStack, useDisclosure } from "@chakra-ui/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Select,
} from "@chakra-ui/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface props {
  children: React.ReactNode;
}

const formSchema = z.object({
  reg_no: z.string().min(2).max(20),
  student_no: z
    .string()
    .min(2, "this field is required")
    .max(10, "Not a valid number"),
  father_no: z
    .string()
    .min(2, "this field is required")
    .max(10, "Not a valid number"),
  mother_no: z
    .string()
    .min(2, "this field is required")
    .max(10, "Not a valid number"),
});

export default function CheckStudentDetails({ children }: props) {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="reg_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Register No.</FormLabel>
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
                  <FormLabel>Studnet Phone No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Father Phone No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Mother Phone No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
