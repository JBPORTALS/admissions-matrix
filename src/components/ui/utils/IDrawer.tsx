"use client";

import {
  Drawer,
  DrawerBackdrop,
  Button,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerBody,
  HStack,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { CloseButton } from "../close-button";

interface IDrawerProps {
  heading: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onClose: () => void;
  isOpen: boolean;
  buttonTitle?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  hideFooter?: boolean;
}

export default function IDrawer({
  heading,
  buttonTitle,
  children,
  isLoading,
  onSubmit,
  isOpen,
  onClose,
  isDisabled,
  hideFooter = false,
}: IDrawerProps) {
  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose} size={"sm"}>
      <DrawerBackdrop
        bg={"rgba(246,246,246,0.2)"}
        className={"backdrop-blur-sm"}
      />
      <DrawerContent>
        <DrawerHeader
          className="border-b bg-background border-b-gray-300"
          py={"2"}
        >
          <HStack w={"full"} justifyContent={"space-between"}>
            <Heading size={"sm"}>{heading}</Heading>
            <CloseButton />
          </HStack>
        </DrawerHeader>
        <DrawerBody className="px-0 bg-background" px={"0"} py={"0"}>
          {children}
        </DrawerBody>
        {!hideFooter && (
          <DrawerFooter
            py={"2"}
            className="flex space-x-4 bg-background border-t border-t-gray-300"
          >
            <Button colorScheme={"blue"} variant={"outline"} onClick={onClose}>
              Cancel
            </Button>

            <Button
              loading={isLoading}
              disabled={isDisabled}
              colorScheme={"blue"}
              onClick={async () => {
                onSubmit && (await onSubmit());
              }}
            >
              {buttonTitle || "Save"}
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer.Root>
  );
}
