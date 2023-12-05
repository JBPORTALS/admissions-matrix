import {
  Drawer,
  DrawerOverlay,
  Button,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  HStack,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

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
    <Drawer isOpen={isOpen} onClose={onClose} size={"sm"}>
      <DrawerOverlay
        bg={"rgba(246,246,246,0.2)"}
        className={"backdrop-blur-sm"}
      />
      <DrawerContent>
        <DrawerHeader
          className="border-b bg-primary border-b-gray-300"
          py={"2"}
        >
          <HStack w={"full"} justifyContent={"space-between"}>
            <Heading size={"sm"}>{heading}</Heading>
            <IconButton
              onClick={() => onClose()}
              variant={"ghost"}
              px={1}
              aria-label="cross"
              icon={<IoMdClose className="text-2xl text-gray-700" />}
            />
          </HStack>
        </DrawerHeader>
        <DrawerBody className="px-0 bg-primary" px={"0"} py={"0"}>
          {children}
        </DrawerBody>
        {!hideFooter && (
          <DrawerFooter
            py={"2"}
            className="flex space-x-4 bg-primary border-t border-t-gray-300"
          >
            <Button colorScheme={"blue"} variant={"outline"} onClick={onClose}>
              Cancel
            </Button>

            <Button
              isLoading={isLoading}
              isDisabled={isDisabled}
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
    </Drawer>
  );
}
