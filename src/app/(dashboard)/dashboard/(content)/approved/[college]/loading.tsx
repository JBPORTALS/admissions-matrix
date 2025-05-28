import { Center, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center pb={"36"} h={"full"} w={"full"}>
      <Spinner size={"lg"} colorPalette="blue" />
    </Center>
  );
}
