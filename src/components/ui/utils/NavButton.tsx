import { Button, Text } from "@chakra-ui/react";
import { cva, VariantProps, cx } from "class-variance-authority";
import React, { HTMLAttributes } from "react";

const ButtonStyles = cva(
  "py-2 flex gap-3 items-center px-3 w-full rounded-full hover:bg-slate-100 transition-all duration-200",
  {
    variants: {
      active: {
        true: "bg-slate-100",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

interface NavButtonProps
  extends VariantProps<typeof ButtonStyles>,
    HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export default function NavButton({
  active,
  ...props
}: React.ComponentProps<typeof Button> & { active: boolean }) {
  return (
    <Button
      justifyContent={"start"}
      w={"full"}
      variant={active ? "surface" : "ghost"}
      {...props}
    />
  );
}
