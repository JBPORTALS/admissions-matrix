"use client";

import { Button, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "College",
    href: "/dashboard/settings",
  },
  {
    label: "Hostel",
    href: "/dashboard/settings/hostel",
  },
  {
    label: "Bus",
    href: "/dashboard/settings/bus",
  },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <VStack
      minW={"40"}
      justifyContent={"start"}
      h={"full"}
      alignItems={"start"}
      gap={"2.5"}
    >
      {items.map((item, i) => (
        <Button
          variant={pathname === item.href ? "subtle" : "ghost"}
          colorPalette={"gray"}
          justifyContent={"start"}
          w={"full"}
          key={i}
          asChild
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </VStack>
  );
}
