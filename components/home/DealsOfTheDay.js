import {
  Box,
  Button,
  Center,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import DealCard from "../DealCard";

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function DealsOfTheDay({ deals }) {
  const limitedDeals = useBreakpointValue({
    base: deals?.slice(0, 12),
    md: deals?.slice(0, 20),
  });

  return (
    <Box as="section" mt={14} mb={6}>
      {/* Section heading */}
      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        textAlign="center"
        mb={8}
      >
        <Text
          as="p"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="600"
          letterSpacing="3px"
          color="brand.gold"
          textTransform="uppercase"
          mb={2}
          fontFamily="var(--font-body)"
        >
          Handpicked for you
        </Text>
        <Text
          as="h2"
          fontSize={{ base: "4xl", md: "5xl" }}
          fontWeight="700"
          lineHeight="1.1"
          fontFamily="var(--font-display)"
          color="gray.900"
        >
          Deals{" "}
          <Text
            as="span"
            bgGradient="linear(to-r, #0092c0, #C49A3C)"
            bgClip="text"
          >
            of the Day
          </Text>
        </Text>
        <Box
          mx="auto"
          mt={3}
          w="48px"
          h="3px"
          bgGradient="linear(to-r, #0092c0, #C49A3C)"
          borderRadius="full"
        />
      </MotionBox>

      <Center mx={2}>
        <MotionSimpleGrid
          columns={[2, 3, 4, 5]}
          spacing={{ base: 3, md: 5 }}
          justifyContent="center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {limitedDeals?.map((deal) => (
            <motion.div key={deal.id} variants={itemVariants}>
              <DealCard
                affURL={deal.affURL}
                storeName={deal.store.storeName}
                storeSlug={deal.store.slug}
                dealSlug={deal.slug}
                title={deal.title}
                code={deal.couponCode ? deal.couponCode : ""}
                type={deal.offerType}
                endDate={deal.endDate}
                showValidTill={false}
                storeImg={deal.store.image}
              />
            </motion.div>
          ))}
        </MotionSimpleGrid>
      </Center>

      <Center mt={10}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link href="/deals">
            <Button
              bg="brand.900"
              color="white"
              size="lg"
              fontSize={15}
              px={8}
              borderRadius={12}
              fontWeight="600"
              letterSpacing="0.8px"
              shadow="0 8px 24px rgba(0,114,160,0.35)"
              _hover={{ bg: "brand.800", shadow: "0 12px 32px rgba(0,114,160,0.45)" }}
              _active={{ bg: "brand.700" }}
              transition="all 0.2s ease"
            >
              VIEW ALL DEALS
            </Button>
          </Link>
        </MotionBox>
      </Center>
    </Box>
  );
}

export default DealsOfTheDay;
