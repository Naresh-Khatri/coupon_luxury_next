import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useToast } from "@chakra-ui/react";
import Confetti from "../Confetti";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  const subscribe = async () => {
    try {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(email)) {
        toast({ title: "Please enter a valid email address", status: "error", duration: 5000 });
        return;
      }
      await axios.post("https://apiv2.couponluxury.com/subscribers", { email });
      toast({ title: "Subscribed successfully", status: "success", duration: 5000 });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setEmail("");
    } catch {
      toast({ title: "You are already subscribed", status: "error", duration: 5000 });
    }
  };

  return (
    <Flex direction="column" alignItems="center" my={10} px={4}>
      <MotionFlex
        className="subscribe-banner-bg"
        w={{ base: "100%", lg: "100%" }}
        maxW={1100}
        borderRadius="24px"
        direction="column"
        justifyContent="center"
        alignItems="center"
        py={{ base: 12, md: 16 }}
        px={{ base: 6, md: 12 }}
        position="relative"
        overflow="hidden"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* Decorative gold ring */}
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="320px"
          h="320px"
          borderRadius="full"
          border="60px solid rgba(196,154,60,0.06)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="-60px"
          w="240px"
          h="240px"
          borderRadius="full"
          border="40px solid rgba(0,146,192,0.07)"
          pointerEvents="none"
        />

        {/* Label */}
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          mb={2}
        >
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="600"
            letterSpacing="3px"
            color="#C49A3C"
            textTransform="uppercase"
            textAlign="center"
            fontFamily="var(--font-body)"
          >
            Stay ahead of the savings
          </Text>
        </MotionBox>

        {/* Headline */}
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          <Text
            fontSize={{ base: "3xl", lg: "5xl" }}
            fontWeight="700"
            textAlign="center"
            color="white"
            fontFamily="var(--font-display)"
            lineHeight="1.15"
            mb={2}
          >
            Exclusive deals,
            <br />
            <Text as="span" color="#C49A3C">
              delivered to you.
            </Text>
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          mb={6}
        >
          <Text
            color="whiteAlpha.600"
            textAlign="center"
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="var(--font-body)"
          >
            Join thousands of savvy shoppers getting the best coupons first.
          </Text>
        </MotionBox>

        {/* Email form */}
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.4 }}
          w="full"
          maxW={440}
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={3}
            align="center"
            justify="center"
          >
            <FormControl variant="floating" isRequired flex={1} position="relative">
              <Input
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                bg="rgba(255,255,255,0.07)"
                border="1px solid rgba(255,255,255,0.15)"
                color="white"
                h="52px"
                borderRadius="12px"
                _placeholder={{ color: "whiteAlpha.500" }}
                _focus={{
                  borderColor: "#0092c0",
                  boxShadow: "0 0 0 3px rgba(0,146,192,0.25)",
                  bg: "rgba(255,255,255,0.1)",
                }}
                _hover={{ borderColor: "rgba(255,255,255,0.3)" }}
                transition="all 0.2s ease"
              />
              <FormLabel
                position="absolute"
                top={4}
                left={0}
                color="whiteAlpha.600"
                // bg="#000000"
                fontSize="sm"
                fontFamily="var(--font-body)"
                style={{ background: 'transparent' }}
              >
                Your email address
              </FormLabel>
            </FormControl>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                bg="linear-gradient(135deg, #0092c0 0%, #0072a0 100%)"
                color="white"
                h="52px"
                px={7}
                borderRadius="12px"
                fontWeight="600"
                fontSize={14}
                letterSpacing="0.8px"
                flexShrink={0}
                shadow="0 8px 24px rgba(0,114,160,0.4)"
                _hover={{
                  bg: "linear-gradient(135deg, #00a8dc 0%, #0092c0 100%)",
                  shadow: "0 12px 32px rgba(0,114,160,0.5)",
                }}
                _active={{ transform: "scale(0.98)" }}
                transition="all 0.2s ease"
                onClick={subscribe}
              >
                SUBSCRIBE
              </Button>
            </motion.div>
          </Flex>
        </MotionBox>

        {showConfetti && <Confetti />}
      </MotionFlex>
    </Flex>
  );
}

export default SubscribeBanner;
