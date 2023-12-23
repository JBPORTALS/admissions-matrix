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
  children,
  icon,
  ...props
}: NavButtonProps) {
  return (
    <button className={ButtonStyles({ active })} {...props}>
      <span className={cx([active ? "text-xl text-blue-800" : "text-xl"])}>
        {icon}
      </span>
      <span
        className={cx([active ? "font-semibold text-blue-800" : "font-normal"])}
      >
        {children}
      </span>
    </button>
  );
}
