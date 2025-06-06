import { Container } from "@chakra-ui/react";
import { PageClient } from "./page.client";

export default function Page() {
  return (
    <Container spaceY={"6"} py={"5"}>
      <PageClient />
    </Container>
  );
}
