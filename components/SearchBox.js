import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useRef, useState } from "react";

function SearchBox() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const initialRef = useRef();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const [fetchingList, setFetchingList] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const debounce = (func, delay) => {
    setFetchingList(true);
    setSearchResults([]);
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(func, delay);
    setTimeoutId(newTimeoutId);
  };

  const handleSearch = async (text) => {
    // console.log(e.key)
    // if (e.key === "Down") {
    //   setCanFocus(true);
    //   console.log('focusing')
    // }
    // setSearchText(e.target.value);
    // console.log('searching', e.target.value)
    const promises = [
      axios.post(process.env.domain + "/stores/getAutoCompleteData", {
        searchText: text,
      }),
      axios.post(process.env.domain + "/categories/getAutoCompleteData", {
        searchText: text,
      }),
    ];
    const res = await Promise.allSettled(promises);
    //since categories are more imp
    const allRes = res[1].value.data.concat(res[0].value.data);
    setSearchResults(allRes);
    setFetchingList(false);
  };
  const clearSearch = () => {
    setSearchText("");
  };

  // const handleKeyDown = (e) => {
  //   // console.log(e)
  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setCanFocus(true);
  //   }
  // };

  return (
    <Flex alignItems={"center"} flexGrow={1} position="relative" maxW={350}>
      <Popover
        isOpen={searchText?.length > 0}
        onClose={onClose}
        placement="bottom"
        closeOnBlur={false}
        autoFocus={false}
        // initialFocusRef={initialRef}
      >
        <PopoverTrigger>
          <InputGroup
            size="sm"
            role={"search"}
            aria-label={"search"}
            fontWeight="bold"
          >
            <Input
              fontWeight="semibold"
              h={"40px"}
              borderRadius={10}
              placeholder="Search"
              role={"search"}
              aria-label={"search"}
              bg="white"
              color={"black"}
              value={searchText}
              onInput={(e) => {
                setSearchText(e.target.value);
                debounce(() => handleSearch(e.target.value), 500);
              }}
              // onKeyDown={(e) => handleKeyDown(e)}
            />
            <InputRightElement h={"40px"}>
              {/* <Spinner color="blackAlpha.600" size="sm" /> */}
              {searchText?.length > 0 ? (
                fetchingList ? (
                  <Spinner color="blackAlpha.600" />
                ) : (
                  <CloseIcon
                    color="blackAlpha.600"
                    onClick={() => {
                      setSearchText("");
                    }}
                  />
                )
              ) : (
                <SearchIcon color="blackAlpha.600" />
              )}
            </InputRightElement>
          </InputGroup>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverBody color={"black"}>
              {fetchingList ? (
                <Stack>
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                searchResults.length == 0 && <Box p={2}>No results</Box>
              )}

              {searchResults.map((result) => (
                <Box key={result.slug} mb={2} _hover={{ bg: "gray.200" }}>
                  <Link
                    href={
                      result.storeName
                        ? `/stores/${result.slug}`
                        : `/categories/${result.slug}`
                    }
                  >
                    <a>
                      <HStack
                        justifyContent={"space-between"}
                        onClick={clearSearch}
                        fontWeight={"semibold"}
                      >
                        <Text>{result.storeName || result.categoryName}</Text>
                        <Text fontSize={10}>
                          {result.storeName ? "Store" : "Category"}
                        </Text>
                      </HStack>
                    </a>
                  </Link>
                  <Divider style={{ height: "1px", background: "#888" }} />
                </Box>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}

export default SearchBox;
