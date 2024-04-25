"use client";
import {
  Form,
  FormControl,
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
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from "react-icons/ai";

const formSchema = z.object({
  reg_no: z.string().min(2).max(20),
  email: z.string().email("Invalid email address"),
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
  gender: z.string().min(2, "Invalid gender"),
  mother_name: z.string().min(2, "Required"),
  father_name: z.string().min(2, "Required"),
});

type FormSchemaValues = z.infer<typeof formSchema>;

type Steps = {
  name: string;
  description?: string;
  fields: Array<keyof FormSchemaValues>;
};

const formSteps: Steps[] = [
  {
    name: "Academic Details",
    description: "Confirm the student record academic details.",
    fields: ["reg_no", "mother_no", "father_no", "student_no"],
  },
  {
    name: "Basic Details",
    description: "Basic information about the student.",
    fields: ["gender", "mother_name", "father_name", "email"],
  },
  {
    name: "Course Details",
    description: "Basic information about the student.",
    fields: ["gender"],
  },
];

const NewEnquiryPage = () => {
  const [currentStep, setCurrentStep] = React.useState(2);
  // 1. Define your form.
  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reg_no: "",
      father_no: "",
      mother_name: "",
      father_name: "",
      student_no: "",
      mother_no: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormSchemaValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const next: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const fields = formSteps[currentStep - 1].fields;
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;
    if (currentStep === formSteps.length) {
      console.log(currentStep);
      await form.handleSubmit(onSubmit)();
    } else {
      setCurrentStep((s) => s + 1);
      console.log(formSteps.length);
    }
  };

  return (
    <Card size={"lg"} className="w-2/6">
      <CardHeader>
        {
          /* Iterate over each step in `formSteps` */
          formSteps.map((step, index) => (
            <div key={index} hidden={currentStep !== index + 1}>
              <Heading size={"md"}>{step.name}</Heading>
              <p className="mt-2 text-sm text-slate-400">{step.description}</p>
            </div>
          ))
        }
      </CardHeader>
      <CardBody>
        <Form {...form}>
          <form onSubmit={next} className="space-y-6">
            {
              /* Render the current step's fields */
              currentStep == 1 && (
                <>
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
                </>
              )
            }

            {currentStep === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Select {...field}>
                          <option value={""}>Select</option>
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="father_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mother_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" w={"full"} colorScheme="facebook">
              Next
            </Button>
            {currentStep > 1 && (
              <Button
                leftIcon={<AiOutlineArrowLeft />}
                type="button"
                w={"full"}
                variant={"link"}
                colorScheme="facebook"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                Previous
              </Button>
            )}
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default NewEnquiryPage;
