"use client";

import { Button, Input, NumberInput } from "@chakra-ui/react";
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
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

const newBoardingPointSchema = z.object({
  boardingPoint: z.string().min(1, "Required"),
  amount: z.string().min(1, "Required"),
});

export function AddBoardingPoint({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const { routeId } = useParams<{ routeId: string }>();
  const form = useForm<z.infer<typeof newBoardingPointSchema>>({
    resolver: zodResolver(newBoardingPointSchema),
    mode: "onChange",
  });

  const { mutateAsync: addBoardingPoint, isPending } =
    trpc.busBoardingPointAdd.useMutation({
      async onSuccess() {
        toaster.info({ title: "Boarding point added" });
        await utils.busBoardingList.invalidate();
        router.refresh();
        setOpen(false);
      },
    });

  async function onSubmit(values: z.infer<typeof newBoardingPointSchema>) {
    await addBoardingPoint({ ...values, routeId });
  }

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>New Boarding Point</DialogTitle>
          </DialogHeader>

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
        </Form>
      </DialogContent>
    </DialogRoot>
  );
}
