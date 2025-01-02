/* eslint-disable react/prop-types */
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const DataTable = ({table,columns}) => {
    return (
        <table className="table table-bordered table-hover mb-0">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : header.column.columnDef.header}
                                {header.column.getIsSorted() ? (
                                    header.column.getIsSorted() === "asc" ? (
                                        <FaSortAmountUp className="ms-2" />
                                    ) : (
                                        <FaSortAmountDown className="ms-2" />
                                    )
                                ) : (
                                    ""
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column) => {
                            const cellValue = row.original[column.accessorKey];
                            return (
                                <td key={column.accessorKey}>
                                    {column.cell
                                        ? column.cell({ getValue: () => cellValue, row })
                                        : cellValue}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;