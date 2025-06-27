"use client";

import { Button, Center, Input, Spinner } from "@chakra-ui/react";
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

const busRouteSchema = z.object({
  routeNo: z.string().min(1, "Required"),
  lastPoint: z.string().min(1, "Required"),
  driverName: z.string().min(1, "Required"),
  driverNumber: z.string().min(1, "Required"),
});

export function EditBusRouteDrawer({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [open, onOpenChange] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof busRouteSchema>>({
    resolver: zodResolver(busRouteSchema),
    mode: "onChange",
  });

  const { data: busRoute, isLoading } = trpc.busRouteView.useQuery(
    { id },
    { enabled: open }
  );

  const router = useRouter();
  const { mutateAsync: busRouteEdit } = trpc.busRouteEdit.useMutation({
    async onSuccess() {
      toaster.info({ title: "Bus route details updated" });
      await utils.busRouteList.invalidate();
      router.refresh();
      onOpenChange(false);
    },
  });

  const { mutate: busRouteDelete, isPending } = trpc.busRouteDelete.useMutation(
    {
      async onSuccess() {
        toaster.info({ title: "Bus route deleted" });
        await utils.busRouteList.invalidate();
        router.refresh();
        onOpenChange(false);
      },
    }
  );

  React.useEffect(() => {
    if (open && busRoute)
      form.reset({
        routeNo: busRoute.route_no,
        driverName: busRoute.driver_name,
        driverNumber: busRoute.driver_number,
        lastPoint: busRoute.last_point,
      });
  }, [open, busRoute]);

  async function onSubmit(values: z.infer<typeof busRouteSchema>) {
    await busRouteEdit({ ...values, id });
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
            <DrawerTitle>Bus Route Detaisl</DrawerTitle>
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
                  name="routeNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route No</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Point</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Name</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driverNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Number</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DrawerBody>

              <DrawerFooter>
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button w={"50%"} colorPalette={"red"} variant={"surface"}>
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <p>
                        This action cannot be undone. This will permanently
                        delete your bus route.
                      </p>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button variant={"outline"}>Close</Button>
                      </DialogActionTrigger>
                      <Button
                        loading={isPending}
                        onClick={() => busRouteDelete({ id })}
                        colorPalette={"red"}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </DialogRoot>
                <Button
                  w={"50%"}
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
