import { Button } from "@chakra-ui/react";
import React from "react";

export default function NavButton({
  active,
  ...props
}: React.ComponentProps<typeof Button> & { active: boolean }) {
  return (
    <Button
      justifyContent={"start"}
      w={"full"}
      size={"sm"}
      variant={active ? "surface" : "ghost"}
      color={!active ? "fg.muted" : "colorPalette.fg"}
      _hover={{ background: !active ? "bg.muted" : "colorPalette.subtle" }}
      {...props}
    />
  );
}
