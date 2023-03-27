import React, { useEffect,useMemo ,useState} from 'react'
import {useTable,usePagination,useSortBy} from 'react-table'
import style from "../styles/next/Tables.module.css"
import {NEWSCOLUMNS} from "../component/columns/projectList"
import Link from 'next/link'
// Modals
import EditNewsModal from "./modals/EditNewsModal"

const NewsTable = ({dark,_allNews}) => {
    const [allNews,setAllNews] = useState(_allNews)

    const [update,setUpdate] = useState(1)
    //Modal
    const [showEditNewsModal,setShowEditNewsModal] = useState(false)
    const [editNewsModalData,setEditNewsModalData] = useState({})
    const [editNewsModaIndex,setEditNewsModalIndex] = useState(-1)

    //Table
    const news_columns = useMemo(() => NEWSCOLUMNS, []);
    const data = useMemo(() => allNews, [update]);
  
    const updateAllNewsList = ({index,data})=>{
        let temp = []
        temp = [...allNews]
        temp[index] = data
        setAllNews([...temp])
        setUpdate(update+1)
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex, pageSize },
        gotoPage,
        pageCount,
        setPageSize
      } = useTable({
          columns:news_columns,
          data,
          initialState: { pageIndex: 0 },
          disableSortRemove: true
        },
            useSortBy,
            usePagination
        );

  

    const handleEditPageModel=(row)=>{
        setEditNewsModalIndex(row.id)
        setEditNewsModalData(row.values)
        setShowEditNewsModal(true)
    }


    return (
        <div className={style.container}>

            
            {/* PROJECT LIST */}
            {allNews && <div>
                <div className="table-container">
                    <div className={style.tableHeader}>
                        <span>All News</span>
                        <Link href="/admin/createnews"><div className={style.createBut}>Create News</div></Link>
                    </div>
                    <table {...getTableProps()}>
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? '🔽' : '🔼') : ''}
                                </span>
                                </th>
                            ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                <tr onClick={()=>handleEditPageModel(row)} {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        );
                                    })}
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div>
                        <span>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>
                        </span>
                        | Go to page:{' '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(pageNumber);
                            }}
                        />
                        <select
                            value={pageSize}
                            onChange={e => setPageSize(Number(e.target.value))}
                            >
                            {[10, 25, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                Show: {pageSize}
                                </option>
                            ))}
                        </select>
                        <button disabled={!canPreviousPage} onClick={() => gotoPage(0)}>{'<<'}</button>
                        <button disabled={!canNextPage} onClick={() => nextPage()}>Next</button>
                        <button disabled={!canPreviousPage} onClick={() => previousPage()}>Previous</button>
                        <button disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)}>{'>>'}</button>
                    </div>
                </div>
            </div>}
            {/* Modals */}
            <EditNewsModal updateAllNewsList={updateAllNewsList} index={editNewsModaIndex} rowData={editNewsModalData} show={showEditNewsModal} handleClose={()=>{setShowEditNewsModal(false);setEditNewsModalData({})}}/>

        </div>
    )
}

export default NewsTable


  