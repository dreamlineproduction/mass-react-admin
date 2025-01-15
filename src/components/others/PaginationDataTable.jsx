/* eslint-disable react/prop-types */
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

const PaginationDataTable = ({ table, pageCount, pageIndex, setPageIndex }) => {

  const getVisiblePages = (current, total) => {
    const pages = [];
    const range = 2;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - range && i <= current + range)
      ) {
        pages.push(i);
      } else if (
        (i === current - range - 1 || i === current + range + 1) &&
        !pages.includes('...')
      ) {
        pages.push('...');
      }
    }
    return pages;
  };
  const pages = getVisiblePages(pageIndex + 1, pageCount);

  return (
    <ul className="pagination justify-content-end">
      <li
        className={`page-item ${table.getCanPreviousPage() ? "" : "disabled"
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
        className={`page-item ${table.getCanPreviousPage() ? "" : "disabled"
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
      {pages.map((page, index) => (
        <li key={index}>
          <Link
            role="button"
            onClick={() => typeof page === 'number' && setPageIndex(page - 1)}
            disabled={pageIndex + 1 === page}
            className={`page-link ${pageIndex + 1 === page ? 'active' : ''}`}
          >
            {page}
          </Link>

        </li>
      ))}
      


      <li
        className={`page-item ${table.getCanNextPage() ? "" : "disabled"
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
        className={`page-item ${table.getCanNextPage() ? "" : "disabled"
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