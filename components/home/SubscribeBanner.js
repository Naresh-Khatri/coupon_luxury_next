import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import Confetti from "../Confetti";

function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const [showConfetti, setShowConfetti] = useState(false);
  const subscribe = async () => {
    try {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Please enter a valid email address",
          status: "error",
          duration: 5000,
        });
        return;
      }
      const result = await axios.post(
        "https://apiv2.couponluxury.com/subscribers",
        { email }
      );
      toast({
        title: "Subscribed successfully",
        status: "success",
        duration: 5000,
      });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);

      setEmail("");
    } catch (err) {
      toast({
        title: "You are already subscribed",
        status: "error",
        duration: 5000,
      });
    }
  };
  return (
    <Flex direction={"column"} alignItems={"center"} my={5}>
      <Flex
        className="subscribe-banner-bg"
        h={275}
        w={{ base: "90vw", lg: "100vw" }}
        maxW={1248}
        borderRadius={15}
        direction={"column"}
        justifyContent={"center"}
      >
        <Text
          fontSize={{ base: "3xl", lg: "6xl" }}
          fontWeight={"extrabold"}
          textAlign="center"
          color={"white"}
        >
          Subscribe to our newsletter!
        </Text>
        <Center flexDir={"column"} w="full">
          <Flex mt={5} w={"full"} justifyContent="center">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              maxW={350}
              w={{ base: "90%", lg: "100%" }}
              display={"flex"}
              justifyContent="center"
              position={"relative"}
            >
              <Input
                placeholder={" "}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                bg={"white"}
                h={"56px"}
                mb={4}
              />
              <FormLabel borderRadius={5} position="absolute" top={0} left={0}>
                Your email address
              </FormLabel>
            </FormControl>
          </Flex>
          {showConfetti && <Confetti />}
          <Button
            bg="brand.900"
            color="white"
            shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
            _hover={{
              bg: "brand.800",
              shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
            }}
            size="lg"
            fontSize={20}
            px={5}
            mb={5}
            borderRadius={10}
            onClick={subscribe}
          >
            SUBSCRIBE
          </Button>
        </Center>
      </Flex>
    </Flex>
  );
}

export default SubscribeBanner;
