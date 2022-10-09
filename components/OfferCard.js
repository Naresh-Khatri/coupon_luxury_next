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
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/PageHtml.module.scss";
import CodeRevealingButton from "./CodeRevealingButton/CodeRevealingButton";

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
    storeName,
    image,
    endDate,
    storeSlug,
    offerType,
    fromPage,
  } = offerDetails;
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <Box
      bg={"white"}
      borderRadius={15}
      p={4}
      h="fit-content"
      onClick={onToggle}
    >
      <Text textAlign={"end"}>
        valid Till:{" "}
        <Text as={"span"} color="green.500">
          {endDate}{" "}
        </Text>
      </Text>
      <Grid templateColumns={{ base: "", md: "repeat(3, 1fr)" }}>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Center h={"100%"}>
            {fromPage == "categories" ? (
              <Link href={`/stores/${storeSlug}`}>
                <Box>
                  <Image
                    src={offerDetails.store.image}
                    alt={"logo"}
                    width={200}
                    height={100}
                  />
                </Box>
              </Link>
            ) : (
              <Text
                display={{ base: "none", md: "flex" }}
                color={"white"}
                borderRadius={15}
                className="banner-bg"
                fontSize={"6xl"}
                fontWeight="extrabold"
                p={2}
                w={{ base: "fit-content", md: "100%" }}
                h={{ base: "fit-content", md: 200 }}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {discountType == "percentage"
                  ? discountValue + "%"
                  : "$" + discountValue}
              </Text>
            )}
          </Center>
        </GridItem>
        <GridItem colSpan={2} pl={5}>
          {fromPage == "stores" ? (
            <Grid templateColumns={{ base: "repeat(5, 1fr)", md: "" }}>
              <GridItem colSpan={{ base: 1, md: 0 }}>
                <Text
                  display={{ base: "flex", md: "none" }}
                  color={"white"}
                  borderRadius={15}
                  bg="brand.900"
                  fontSize={"4xl"}
                  fontWeight="extrabold"
                  p={2}
                  mr={3}
                  w={{ base: "fit-content", md: "100%" }}
                  h={{ base: "fit-content", md: "100%" }}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {discountType == "percentage"
                    ? discountValue + "%"
                    : "$" + discountValue}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 5 }}>
                <Text fontSize={"2xl"} fontWeight="extrabold" noOfLines={2}>
                  {title}
                </Text>
              </GridItem>
            </Grid>
          ) : (
            <Text fontSize={"2xl"} fontWeight="extrabold" noOfLines={2}>
              {title}
            </Text>
          )}
          <Box
            mt={3}
            dangerouslySetInnerHTML={{ __html: description }}
            className={styles.page_html}
            noOfLines={2}
          ></Box>
          <Center p={4}>
            {offerType == "coupon" ? (
              <CodeRevealingButton
                code={couponCode}
                affURL={affURL}
                image={
                  fromPage == "categories" ? offerDetails.store.image : image
                }
                storeName={storeName}
              />
            ) : (
              <Link href={`/deals/${slug}`}>
                <a>
                  <Button
                    bg="brand.900"
                    color="white"
                    shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
                    _hover={{
                      bg: "brand.800",
                      shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
                    }}
                    size="lg"
                    px={"60px"}
                    mb={5}
                    borderRadius={10}
                    fontSize={{ base: 16, md: 20 }}
                    h={{ base: 10, md: 12 }}
                  >
                    Get Deal
                  </Button>
                </a>
              </Link>
            )}
          </Center>
        </GridItem>
      </Grid>
      <Button
        w={"full"}
        mt={3}
        fontWeight={100}
        justifyContent={"space-between"}
      >
        <InfoOutlineIcon />
        <Text>Show Details</Text>
        {isOpen ? (
          <ChevronUpIcon fontSize={25} />
        ) : (
          <ChevronDownIcon fontSize={25} />
        )}
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box p="40px" color="white" mt="4" rounded="md" shadow="md">
          <Box dangerouslySetInnerHTML={{ __html: TnC }} color="black"></Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default OfferCard;
