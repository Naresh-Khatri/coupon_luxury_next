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
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    image,
    endDate,
    offerType,
    fromPage,
    storeName,
  } = offerDetails;
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <Box
      bg="white"
      borderRadius={15}
      onClick={onToggle}
      _hover={[{}, { transform: "translateY(-10px) scale(1.02)" }]}
      style={{ transition: "all 0.1s ease-in-out" }}
    >
      <Flex h={160}>
        <Flex h={"100%"} align="center" justify={"center"} p={3}>
          <Center minW={"70px"}>
            {fromPage == "categories" ? (
              <Link href={`/stores/${offerDetails.store.slug}`}>
                <Box display={["none", "flex"]}>
                  <Image
                    src={offerDetails.store.image}
                    alt={"logo"}
                    width={140}
                    height={70}
                  />
                </Box>
                <Box display={["flex", "none"]}>
                  <Image
                    src={offerDetails.store.image}
                    alt={"logo"}
                    width={100}
                    height={50}
                  />
                </Box>
              </Link>
            ) : (
              <Text
                display={{ base: "flex", md: "flex" }}
                color={"white"}
                borderRadius={15}
                className="banner-bg"
                fontSize={"3xl"}
                fontWeight="extrabold"
                p={2}
                w={100}
                h={100}
                alignItems={"center"}
                justifyContent={"center"}
                textAlign={"center"}
                lineHeight={1}
              >
                {discountType == "percentage"
                  ? discountValue + "% OFF"
                  : "$" + discountValue}
              </Text>
            )}
          </Center>
        </Flex>
        <Flex
          w={"100%"}
          justify={"space-between"}
          p={[3, 5]}
          flexDirection={["column", "row"]}
        >
          <Box>
            <Text
              fontSize={["1rem", "1.375rem"]}
              lineHeight="1.4"
              noOfLines={2}
              fontWeight={"semibold"}
            >
              {title}
            </Text>
            <Flex mt={2} color="green.500">
              <FontAwesomeIcon
                height={"1.25rem"}
                icon={faCheckCircle}
                style={{ paddingRight: "10px" }}
              />
              <Text fontSize={[13, 14]} color="black">
                valid Till:{" "}
                <Text as={"span"} color="green.500">
                  {endDate}{" "}
                </Text>
              </Text>
            </Flex>

            {/* <Text fontSize={14}>
              valid Till:{" "}
              <Text as={"span"} color="green.500">
                {endDate}{" "}
              </Text>
            </Text> */}
          </Box>

          <Flex w={170} align={"center"} justify="end">
            {offerType == "coupon" ? (
              <CodeRevealingButton
                code={couponCode}
                affURL={affURL}
                image={image}
                storeName={storeName}
              />
            ) : (
              <Link href={`/deals/${slug}`}>
                <Button
                  bg="brand.900"
                  color="white"
                  shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
                  _hover={
                    ([
                      {
                        bg: "brand.800",
                        shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
                      },
                    ],
                    [])
                  }
                  size="lg"
                  px={"30px"}
                  borderRadius={5}
                  h={[9, 12]}
                >
                  Get Deal
                </Button>
              </Link>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Button
        w={"full"}
        borderRadius={"0 0 15px 15px"}
        fontWeight={100}
        justifyContent={"space-between"}
        alignItems={"center"}
        _hover={{ bg: "transparent" }}
        _focus={{ bg: "transparent" }}
        bg={"white"}
      >
        <Box display={"flex"} alignItems="center">
          {isOpen ? (
            <ChevronUpIcon fontSize={25} />
          ) : (
            <ChevronDownIcon fontSize={25} />
          )}
          <Text ml={10} fontSize={"14"} fontWeight="500">
            Show Details
          </Text>
        </Box>
        <InfoOutlineIcon />
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box px={10} pb={5} color="white" mt="4" rounded="md" shadow="md">
          <Box
            dangerouslySetInnerHTML={{ __html: TnC }}
            color="black"
            className={styles.page_html}
          ></Box>
        </Box>
      </Collapse>
    </Box>

    // <Box bg={"white"} borderRadius={15} p={4} h={200} onClick={onToggle}>
    //   <Grid templateColumns={{ base: "", md: "repeat(3, 1fr)" }}>
    //     <GridItem colSpan={{ base: 2, md: 1 }}>
    //       <Center>
    //         {fromPage == "categories" ? (
    //           <Link href={`/stores/${offerDetails.store.slug}`}>
    //               <Image
    //                 src={offerDetails.store.image}
    //                 alt={"logo"}
    //                 width={100}
    //                 height={50}
    //               />
    //           </Link>
    //         ) : (
    //           <Text
    //             display={{ base: "none", md: "flex" }}
    //             color={"white"}
    //             borderRadius={15}
    //             className="banner-bg"
    //             fontSize={"3xl"}
    //             fontWeight="extrabold"
    //             p={2}
    //             w={{ base: "fit-content", md: 100 }}
    //             h={{ base: "fit-content", md: 100 }}
    //             alignItems={"center"}
    //             justifyContent={"center"}
    //             textAlign={"center"}
    //             lineHeight={1}
    //           >
    //             {discountType == "percentage"
    //               ? discountValue + "% OFF"
    //               : "$" + discountValue}
    //           </Text>
    //         )}
    //       </Center>
    //     </GridItem>
    //     <GridItem colSpan={2} pl={5}>
    //       {fromPage == "stores" ? (
    //         <Grid templateColumns={{ base: "repeat(5, 1fr)", md: "" }}>
    //           <GridItem colSpan={{ base: 1, md: 0 }}>
    //             <Text
    //               display={{ base: "flex", md: "none" }}
    //               color={"white"}
    //               borderRadius={15}
    //               bg="brand.900"
    //               fontSize={"4xl"}
    //               fontWeight="extrabold"
    //               p={2}
    //               mr={3}
    //               w={{ base: "fit-content", md: "100%" }}
    //               h={{ base: "fit-content", md: "100%" }}
    //               alignItems={"center"}
    //               justifyContent={"center"}
    //             >
    //               {discountType == "percentage"
    //                 ? discountValue + "%"
    //                 : "$" + discountValue}
    //             </Text>
    //           </GridItem>
    //           <GridItem colSpan={{ base: 4, md: 5 }}>
    //             <Text
    //               fontSize={"1.375rem"}
    //               lineHeigh={"1.4"}
    //               fontWeight="extrabold"
    //               noOfLines={2}
    //             >
    //               {title}
    //             </Text>
    //           </GridItem>
    //         </Grid>
    //       ) : (
    //         <Text fontSize={"2xl"} fontWeight="extrabold" noOfLines={2}>
    //           {title}
    //         </Text>
    //       )}

    //       <Center p={4}>
    //         {}
    //         {offerType == "coupon" ? (
    //           <CodeRevealingButton
    //             code={couponCode}
    //             affURL={affURL}
    //             image={image}
    //             storeName={storeName}
    //           />
    //         ) : (
    //           <Link href={`/deals/${slug}`}>
    //               <Button
    //                 bg="brand.900"
    //                 color="white"
    //                 shadow="0px 10px 33px -3px rgba(42, 129, 251, 0.5);"
    //                 _hover={{
    //                   bg: "brand.800",
    //                   shadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.8)",
    //                 }}
    //                 size="lg"
    //                 px={"60px"}
    //                 mb={5}
    //                 borderRadius={10}
    //                 fontSize={{ base: 16, md: 20 }}
    //                 h={{ base: 10, md: 12 }}
    //               >
    //                 Get Deal
    //               </Button>
    //           </Link>
    //         )}
    //         <Text textAlign={"end"}>
    //           valid Till:{" "}
    //           <Text as={"span"} color="green.500">
    //             {endDate}{" "}
    //           </Text>
    //         </Text>
    //       </Center>
    //     </GridItem>
    //   </Grid>
    //   <Button
    //     w={"full"}
    //     mt={3}
    //     fontWeight={100}
    //     justifyContent={"space-between"}
    //     alignItems={"center"}
    //     _hover={{ bg: "transparent" }}
    //     _focus={{ bg: "transparent" }}
    //     bg={"white"}
    //   >
    //     <Box display={"flex"} alignItems="center">
    //       {isOpen ? (
    //         <ChevronUpIcon fontSize={25} />
    //       ) : (
    //         <ChevronDownIcon fontSize={25} />
    //       )}
    //       <Text ml={10} fontSize={"14"} fontWeight="500">
    //         Show Details
    //       </Text>
    //     </Box>
    //     <InfoOutlineIcon />
    //   </Button>
    //   <Collapse in={isOpen} animateOpacity>
    //     <Box px="40px" color="white" mt="4" rounded="md" shadow="md">
    //       <Box
    //         dangerouslySetInnerHTML={{ __html: TnC }}
    //         color="black"
    //         className={styles.page_html}
    //       ></Box>
    //     </Box>
    //   </Collapse>
    // </Box>
  );
}

export default OfferCard;
