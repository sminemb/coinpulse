import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";

const datatable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  bodyRowClassName,
  bodyCellClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={tableClassName}>
      <TableHeader className={headerClassName}>
        <TableRow className={headerRowClassName}>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className={[headerCellClassName, column.headClassName].filter(Boolean).join(" ")}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowKey(row, rowIndex)} className={bodyRowClassName}>
            {columns.map((column, columnIndex) => (
              <TableCell
                key={columnIndex}
                className={[bodyCellClassName, column.cellClassName].filter(Boolean).join(" ")}
              >
                {column.cell(row, rowIndex)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default datatable;
