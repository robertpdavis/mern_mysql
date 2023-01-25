import { useMemo, useState, useEffect, useRef, forwardRef } from "react";
import { useTable, useRowSelect, usePagination } from "react-table";
import { Link } from "react-router-dom";

function UserTable(props) {

  // Excepts array of objects
  const tableData = props.tableData;
  // Server or client side pagination option
  const paginationType = props.paginationType;
  // Page count for server side pagination
  const controlledPageCount = props.pageCount;
  // Inital page state hoisted for server side pagination
  const initialPageState = props.pageState;

  // Hook to set page index and page size for server side pagination.
  const setPageState = props.setPageState;
  // Hoist the selected table row data for actions
  const setTblSelection = props.setTblSelection;

  // Manage page count for client side pagination
  const [pages, setPages] = useState(Math.ceil(tableData.length / 10));

  // Memoise the data
  const data = useMemo(
    () => tableData.map((item) => (
      {
        id: item.id,
        username: item.username,
        firstname: item.firstname,
        lastname: item.lastname,
        email: item.email,
      }
    )),
    [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Username",
        accessor: "username"
      },
      {
        Header: "First Name",
        accessor: "firstname"
      },
      {
        Header: "Last Name",
        accessor: "lastname"
      },
      {
        Header: "Email",
        accessor: "email"
      },
    ],
    []
  );


  const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = useRef()
      const resolvedRef = ref || defaultRef

      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    selectedFlatRows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: paginationType === 'server' ? initialPageState.pageIndex : 0, pageSize: paginationType === 'server' ? initialPageState.pageSize : 10 },
    manualPagination: paginationType === 'server' ? true : false,
    pageCount: paginationType === 'server' ? controlledPageCount : pages,
  },
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Add a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  );

  // Hook to update hoisted selected table row data
  useEffect(() => {
    if (selectedFlatRows) {
      setTblSelection(selectedFlatRows)
    } else {
      setTblSelection('')
    }
  }, [selectedRowIds])

  // Hook to update hoisted page state for server side pagination
  useEffect(() => {
    if (paginationType === 'server') {
      setPageState({ pageIndex, pageSize })
    } else {
      setPages(Math.ceil(tableData.length / pageSize));
    }
  }, [pageIndex, pageSize])

  if (data.length > 0) {
    return (
      <div className="table-responsive">
        <table className="table table-sm text-center dashboard-table"  {...getTableProps()}>
          <thead className="bg-dark text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              let link = "/user/" + data[i].id
              prepareRow(row);
              return (
                <tr key={i} {...row.getRowProps()}>
                  {row.cells.map((cell, c) => {
                    if (c === 1) {
                      return <td {...cell.getCellProps()}><Link to={link}>{cell.render("Cell")}</Link></td>;
                    }
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination pagination-sm dashboard-table">

          <button className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span className="d-inline-block align-middle">
            &nbsp;Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span className="align-top">
            &nbsp;| Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              min="1"
              max={pageOptions.length}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '50px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );


  } else {
    return (<h5>There are no users to display.</h5>);
  }
}

export default UserTable;