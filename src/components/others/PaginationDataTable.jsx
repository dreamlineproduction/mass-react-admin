/* eslint-disable react/prop-types */
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

const PaginationDataTable = ({table, pageCount, pageIndex, setPageIndex}) => {
    return (
        <ul className="pagination justify-content-end">
              <li
                className={`page-item ${
                  table.getCanPreviousPage() ? "" : "disabled"
                }`}
              >
                <Link
                  role="button"
                  className="page-link"
                  onClick={() => setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <MdOutlineKeyboardDoubleArrowLeft />
                </Link>
              </li>
              <li
                className={`page-item ${
                  table.getCanPreviousPage() ? "" : "disabled"
                }`}
              >
                <Link
                  role="button"
                  className="page-link"
                  onClick={() => setPageIndex(table.getPreviousPage())}
                  disabled={!table.getCanPreviousPage()}
                >
                   
                   <MdKeyboardArrowLeft /> 
                </Link>
              </li>
              {Array.from({ length: pageCount }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${pageIndex === index ? "active" : ""}`}
                >
                  <Link
                    role="button"
                    onClick={() => setPageIndex(index)}
                    className={`page-link ${
                      pageIndex === index ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </Link>
                </li>
              ))}
              <li
                className={`page-item ${
                  table.getCanNextPage() ? "" : "disabled"
                }`}
              >
                <Link
                  role="button"
                  className="page-link"
                  onClick={() => setPageIndex(table.getNextPage())}
                  disabled={!table.getCanNextPage()}
                >
                   
                   <MdKeyboardArrowRight /> 
                </Link>
              </li>

              <li
                className={`page-item ${
                  table.getCanNextPage() ? "" : "disabled"
                }`}
              >
                <Link
                  role="button"
                  className="page-link"
                  onClick={() => setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <MdOutlineKeyboardDoubleArrowRight />
                </Link>
              </li>

              {/* <span>
                                Page{' '}

                                <strong>
                                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </strong>
                            </span> */}
              {/* <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                            >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                                </option>
                            ))}
                            </select> */}
        </ul>
    );
};

export default PaginationDataTable;