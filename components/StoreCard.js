import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";

function StoreCard({ title, slug, img }) {
  return (
    <Box
      width={{ base: 135, lg: 180 }}
      height={{ base: 65, lg: 140 }}
      shadow="2xl"
      borderRadius={10}
      bg="white"
    >
      <Image
        src={img}
        width={135}
        height={65}
        alt={`${title} - logo`}
        style={{ width: "100%" }}
      />
      <Text textAlign={"center"}>{title}</Text>
    </Box>
  );
}

export default StoreCard;
