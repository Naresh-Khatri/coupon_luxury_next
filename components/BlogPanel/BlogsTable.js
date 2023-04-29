import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  TableCaption,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleXmark,
  faCross,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

export default function BlogsTable({ blogs }) {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("coverImg", {
      cell: (info) => info.getValue(),
      header: "Image",
      meta: {
        isImage: true,
      },
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Title",
    }),
    columnHelper.accessor("featured", {
      cell: (info) => info.getValue(),
      header: "Featured",
    }),
    columnHelper.accessor("active", {
      cell: (info) => info.getValue(),
      header: "Active",
    }),
    columnHelper.accessor("actions", {
      cell: (info) => info.getValue(),
      header: "Actions",
    }),
  ];
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    columns,
    data: blogs,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  <Flex>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <Flex pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "desc" ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </Flex>
                  </Flex>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table?.getRowModel()?.rows?.length === 0 ? (
          <Tr>
            <Td colSpan={columns.length}>No data</Td>
          </Tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              <Td>{row.original.id}</Td>
              <Td p={0}>
                <Image
                  src={row.original.coverImg}
                  alt="blog cover image"
                  height={90}
                  width={160}
                  style={{ borderRadius: "15px", minWidth: "100px" }}
                />
              </Td>
              <Td maxW={"xs"}>{row.original.title}</Td>
              <Td maxW={"10px"}>
                {row.original.featured ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color="#22c55e"
                    fontSize={"25px"}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    color="#ef4444"
                    fontSize={"25px"}
                  />
                )}
              </Td>
              <Td maxW={"10px"}>
                {row.original.active ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color="#22c55e"
                    fontSize={"25px"}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    color="#ef4444"
                    fontSize={"25px"}
                  />
                )}
              </Td>
              <Td>
                <IconButton
                  variant={"solid"}
                  colorScheme="blue"
                  isDisabled
                  icon={<FontAwesomeIcon icon={faEdit} />}
                />
              </Td>

              {/* {row.getVisibleCells().map((cell) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    {meta?.isImage ? (
                      <Image
                        src={cell.getContext().row.original.coverImg}
                        alt="blog cover image"
                        height={90}
                        width={160}
                        style={{ borderRadius: "20px" }}
                      />
                    ) : (
                      <Text>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Text>
                    )}
                  </Td>
                );
              })} */}
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
}
