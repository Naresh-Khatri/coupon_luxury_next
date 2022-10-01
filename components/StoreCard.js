import { Box, Link, Text } from "@chakra-ui/react";
import Image from "next/image";

function StoreCard({ title, slug, img }) {
  return (
    <Link href={`/stores/${slug}`}>
      <Box shadow="2xl" borderRadius={10} bg="white">
        <Image
          src={img}
          width={135}
          height={65}
          alt={`${title} - logo`}
          sizes="100%"
          style={{ borderRadius: "15px" }}
        />
        <Text py={2} textAlign={"center"} noOfLines={1}>
          {title}
        </Text>
      </Box>
    </Link>
  );
}

export default StoreCard;
