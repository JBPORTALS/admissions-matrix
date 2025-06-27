"use client";

import { Button, Center, Input, NumberInput, Spinner } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { trpc } from "@/utils/trpc-cleint";
import { toaster } from "../ui/toaster";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

const editBoardingPointSchema = z.object({
  boardingPoint: z.string().min(1, "Required"),
  amount: z.string().min(1, "Required"),
});

export function ViewBoardingPoint({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const { routeId } = useParams<{ routeId: string }>();
  const form = useForm<z.infer<typeof editBoardingPointSchema>>({
    resolver: zodResolver(editBoardingPointSchema),
    mode: "onChange",
  });

  const { data, isLoading } = trpc.busBoardingPointView.useQuery(
    { id },
    { enabled: open }
  );

  const { mutateAsync: editBoardingPoint } =
    trpc.busBoardingPointEdit.useMutation({
      async onSuccess() {
        toaster.info({ title: "Boarding point added" });
        await utils.busBoardingList.invalidate();
        router.refresh();
        setOpen(false);
      },
    });

  React.useEffect(() => {
    if (open && data)
      form.reset({
        amount: data?.amount,
        boardingPoint: data?.boarding_point,
      });
  }, [open, data]);

  async function onSubmit(values: z.infer<typeof editBoardingPointSchema>) {
    await editBoardingPoint({ ...values, routeId, id });
  }

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Boarding Point Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <React.Fragment>
              <DialogBody spaceY={"5"}>
                <FormField
                  control={form.control}
                  name="boardingPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boarding Point</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
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
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant={"outline"}>Close</Button>
                </DialogActionTrigger>
                <Button
                  loading={form.formState.isSubmitting}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </DialogFooter>
            </React.Fragment>
          )}
        </Form>
      </DialogContent>
    </DialogRoot>
  );
}
