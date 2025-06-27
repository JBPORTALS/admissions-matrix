import { EditHostelDrawer } from "@/components/drawers/edit-hostel-drawer";
import { NewHostelDrawer } from "@/components/drawers/new-hostel-drawer";
import DeleteHostelDialog from "@/components/modals/delete-hostel-dialog";
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
import { formatDistanceToNowStrict, isValid } from "date-fns";
import { LuPlus } from "react-icons/lu";

function safeDate(dateStr: string): Date {
  return new Date(dateStr.replace(" ", "T"));
}

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
        columns={3}
      >
        {data.data.map((hostel) => (
          <Card.Root key={hostel.id} h={"full"} borderWidth="1px">
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
                {isValid(safeDate(hostel.updated_at)) && (
                  <Text fontSize="xs" color="gray.500">
                    Updated: {new Date(hostel.created_at).toLocaleString()}
                  </Text>
                )}
              </Stack>
            </Card.Body>
            <Card.Footer>
              <DeleteHostelDialog id={hostel.id}>
                <Button
                  variant={"surface"}
                  w={"50%"}
                  colorPalette={"red"}
                  size="sm"
                >
                  Delete
                </Button>
              </DeleteHostelDialog>

              <EditHostelDrawer id={hostel.id}>
                <Button
                  variant={"surface"}
                  colorPalette={"gray"}
                  w={"50%"}
                  size="sm"
                >
                  Edit
                </Button>
              </EditHostelDrawer>
            </Card.Footer>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
}
