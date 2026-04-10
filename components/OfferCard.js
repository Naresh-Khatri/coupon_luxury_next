import {
  ChevronDownIcon,
  ChevronUpIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Collapse,
  Grid,
  GridItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/PageHtml.module.scss";
import CodeRevealingButton from "./CodeRevealingButton/CodeRevealingButton";

const MotionBox = motion(Box);

function OfferCard({ offerDetails }) {
  const {
    title,
    couponCode,
    affURL,
    slug,
    discountType,
    discountValue,
    description,
    TnC,
    image,
    endDate,
    offerType,
    fromPage,
    storeName,
  } = offerDetails;
  const { isOpen, onToggle } = useDisclosure();

  const discountLabel =
    discountType === "percentage"
      ? discountValue + "%"
      : "$" + discountValue;

  return (
    <MotionBox
      bg="white"
      borderRadius={16}
      p={5}
      h="fit-content"
      onClick={onToggle}
      cursor="pointer"
      border="1px solid rgba(0,0,0,0.07)"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Validity badge */}
      <Text
        textAlign="end"
        fontSize="xs"
        fontWeight="500"
        color="gray.500"
        mb={2}
        fontFamily="var(--font-body)"
      >
        Valid till:{" "}
        <Text as="span" color="green.500" fontWeight="600">
          {endDate}
        </Text>
      </Text>

      <Grid templateColumns={{ base: "", md: "repeat(3, 1fr)" }}>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Center h="100%">
            {fromPage === "categories" ? (
              <Link href={`/stores/${offerDetails.store.slug}`}>
                <Box borderRadius={12} overflow="hidden">
                  <Image
                    src={offerDetails.store.image}
                    alt="logo"
                    width={200}
                    height={100}
                  />
                </Box>
              </Link>
            ) : (
              <motion.div
                style={{
                  display: "none",
                }}
                className="discount-badge-desktop"
              >
                <Box
                  display={{ base: "none", md: "flex" }}
                  color="white"
                  borderRadius={12}
                  bg="linear-gradient(135deg, #0072a0 0%, #0092c0 100%)"
                  fontSize="5xl"
                  fontWeight="800"
                  p={3}
                  w={{ base: "fit-content", md: 180 }}
                  h={{ base: "fit-content", md: 180 }}
                  alignItems="center"
                  justifyContent="center"
                  fontFamily="var(--font-display)"
                  shadow="0 8px 24px rgba(0,114,160,0.3)"
                >
                  {discountLabel}
                </Box>
              </motion.div>
            )}
          </Center>
        </GridItem>

        <GridItem colSpan={2} pl={{ base: 0, md: 5 }}>
          {fromPage === "stores" ? (
            <Grid templateColumns={{ base: "repeat(5, 1fr)", md: "" }}>
              <GridItem colSpan={{ base: 1, md: 0 }}>
                <Box
                  display={{ base: "flex", md: "none" }}
                  color="white"
                  borderRadius={10}
                  bg="linear-gradient(135deg, #0072a0 0%, #0092c0 100%)"
                  fontSize="3xl"
                  fontWeight="800"
                  p={2}
                  mr={3}
                  w="fit-content"
                  alignItems="center"
                  justifyContent="center"
                  fontFamily="var(--font-display)"
                >
                  {discountLabel}
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 5 }}>
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  noOfLines={2}
                  fontFamily="var(--font-display)"
                  lineHeight="1.2"
                >
                  {title}
                </Text>
              </GridItem>
            </Grid>
          ) : (
            <Text
              fontSize="2xl"
              fontWeight="700"
              noOfLines={2}
              fontFamily="var(--font-display)"
              lineHeight="1.2"
            >
              {title}
            </Text>
          )}

          <Box
            mt={3}
            dangerouslySetInnerHTML={{ __html: description }}
            className={styles.page_html}
            noOfLines={2}
          />

          <Center p={4}>
            {offerType === "coupon" ? (
              <CodeRevealingButton
                code={couponCode}
                affURL={affURL}
                image={image}
                storeName={storeName}
              />
            ) : (
              <Link href={`/deals/${slug}`}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    bg="brand.900"
                    color="white"
                    shadow="0 8px 24px rgba(0,114,160,0.35)"
                    _hover={{ bg: "brand.800", shadow: "0 12px 32px rgba(0,114,160,0.45)" }}
                    _active={{ bg: "brand.700" }}
                    size="lg"
                    px="60px"
                    mb={5}
                    borderRadius={12}
                    fontSize={{ base: 15, md: 18 }}
                    h={{ base: 10, md: 12 }}
                    fontWeight="600"
                    letterSpacing="0.5px"
                    transition="all 0.2s ease"
                  >
                    Get Deal
                  </Button>
                </motion.div>
              </Link>
            )}
          </Center>
        </GridItem>
      </Grid>

      {/* Show details toggle */}
      <Button
        w="full"
        mt={2}
        fontWeight={400}
        justifyContent="space-between"
        alignItems="center"
        _hover={{ bg: "gray.50" }}
        _focus={{ bg: "gray.50" }}
        bg="white"
        borderRadius={10}
        border="1px solid rgba(0,0,0,0.07)"
        size="sm"
        h={9}
        px={4}
        fontFamily="var(--font-body)"
        fontSize={13}
        color="gray.600"
      >
        <Box display="flex" alignItems="center" gap={2}>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDownIcon fontSize={18} />
          </motion.div>
          Show Details
        </Box>
        <InfoOutlineIcon fontSize={14} />
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box px={5} mt={3} pb={2}>
          <Box
            dangerouslySetInnerHTML={{ __html: TnC }}
            color="gray.700"
            className={styles.page_html}
            fontSize="sm"
          />
        </Box>
      </Collapse>
    </MotionBox>
  );
}

export default OfferCard;
