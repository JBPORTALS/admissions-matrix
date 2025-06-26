"use client";

import { Button } from "@chakra-ui/react";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteHostelDialog({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const { mutate: deleteHostel, isPending } = trpc.deleteHostel.useMutation({
    async onSuccess() {
      toaster.info({ title: "Hostel deleted" });
      await utils.hostelList.invalidate();
      router.refresh();
      setOpen(false);
    },
  });

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            This action cannot be undone. This will permanently delete your
            hostel and remove your data from our systems.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogActionTrigger>
          <Button
            loading={isPending}
            onClick={() => deleteHostel({ id })}
            colorPalette={"red"}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
