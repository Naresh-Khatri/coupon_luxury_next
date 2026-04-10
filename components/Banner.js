import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

function Banner({ title, subTitle, titleAsH1 }) {
  return (
    <MotionFlex
      direction="column"
      align="center"
      justify="center"
      className="banner-bg"
      color="white"
      h={subTitle && !title ? 75 : subTitle ? 148 : 116}
      position="relative"
      overflow="hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative shimmer line */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="2px"
        bgGradient="linear(to-r, transparent, #C49A3C, transparent)"
        opacity={0.6}
      />

      {title && (
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Text
            as={titleAsH1 ? "h1" : "h3"}
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="700"
            textAlign="center"
            fontFamily="var(--font-display)"
            letterSpacing="0.3px"
            lineHeight="1.15"
          >
            {title}
          </Text>
        </MotionBox>
      )}

      {subTitle && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          mt={1}
        >
          <Text
            as="h4"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="400"
            textAlign="center"
            color="whiteAlpha.700"
            letterSpacing="0.2px"
            fontFamily="var(--font-body)"
          >
            {subTitle}
          </Text>
        </MotionBox>
      )}
    </MotionFlex>
  );
}

export default Banner;
