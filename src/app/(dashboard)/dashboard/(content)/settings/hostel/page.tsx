import NewHostelDrawer from "@/components/drawers/new-hostel-drawer";
import { api } from "@/utils/trpc-server";
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

export default async function Page() {
  const data = await api.hostelList();

  console.log(data);
  return (
    <Box w={"full"}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Heading size={"2xl"}>All Hostels</Heading>

        <NewHostelDrawer>
          <Button size={"sm"}>
            <LuPlus />
            Add
          </Button>
        </NewHostelDrawer>
      </HStack>

      <SimpleGrid
        alignItems={"start"}
        w={"full"}
        gap={"5"}
        py={"6"}
        minChildWidth="300px"
      >
        {data.data.map((hostel) => (
          <Card.Root key={hostel.id} borderWidth="1px">
            <Card.Header>
              <Heading size="md">{hostel.hostel_name}</Heading>
              <Text fontSize="sm" color="gray.500">
                {hostel.address}
              </Text>
            </Card.Header>
            <Card.Body>
              <Stack gap={2}>
                <Text>
                  <strong>Gender:</strong> {hostel.gender}
                </Text>
                <Text>
                  <strong>Intake:</strong> {hostel.intake}
                </Text>
                <Text>
                  <strong>Fee:</strong> ₹{hostel.fee}
                </Text>
                <Text>
                  <strong>Warden:</strong> {hostel.warden_name}
                </Text>
                <Text>
                  <strong>Warden No:</strong> {hostel.warden_number}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Created: {new Date(hostel.created_at).toLocaleString()}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Updated: {new Date(hostel.updated_at).toLocaleString()}
                </Text>
              </Stack>
            </Card.Body>
            <Card.Footer>
              <Button
                variant={"surface"}
                w={"50%"}
                colorPalette={"red"}
                size="sm"
              >
                Delete
              </Button>
              <Button
                variant={"surface"}
                colorPalette={"gray"}
                w={"50%"}
                size="sm"
              >
                Edit
              </Button>
            </Card.Footer>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
}
