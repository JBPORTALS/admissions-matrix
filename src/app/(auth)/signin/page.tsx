"use client";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSignIn } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Home() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const router = useRouter();
  const { signIn } = useSignIn();

  const onSignin = async () => {
    setIsLoading(true);
    try {
      const data = await signIn({
        email: state.email,
        password: state.password,
      });
      if (data) {
        router.refresh();
      }
    } catch (e) {
      toast.error("Invalid credentials !");
    }

    setIsLoading(false);
  };

  return (
    <Stack spacing={8} mx={"auto"} maxW={"md"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"3xl"}>Sign in to Admission Matrix</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          to manage Admission Process Details
        </Text>
      </Stack>
      <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              type="email"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                value={state.password}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, password: e.target.value }))
                }
                type={show ? "text" : "password"}
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={2}>
            {/* <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"end"}
            >
              <Link href={"/forgot-password"} color={"blue.400"}>
                Forgot password?
              </Link>
            </Stack> */}
            <Button
              isLoading={isLoading}
              onClick={onSignin}
              isDisabled={!state.email || !state.password}
              colorScheme="blue"
              color={"white"}
              loadingText={"Signing in..."}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
