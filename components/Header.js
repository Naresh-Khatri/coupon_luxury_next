import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionFlex = motion(Flex);

function Header({ leftText, rightText }) {
  return (
    <MotionFlex
      bg="white"
      w="full"
      py={3}
      px={5}
      my={4}
      borderRadius="12px"
      justify="space-between"
      align="center"
      border="1px solid rgba(0,0,0,0.08)"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Text
        fontSize="sm"
        fontWeight="600"
        color="gray.700"
        fontFamily="var(--font-body)"
        letterSpacing="0.3px"
      >
        {leftText}
      </Text>
      {rightText && (
        <Text
          fontSize="sm"
          fontWeight="500"
          color="gray.500"
          fontFamily="var(--font-body)"
        >
          {rightText}
        </Text>
      )}
    </MotionFlex>
  );
}

export default Header;
