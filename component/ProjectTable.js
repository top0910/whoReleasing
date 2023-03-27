import React, { useEffect,useMemo ,useState} from 'react'
import {useTable,usePagination,useSortBy} from 'react-table'
import style from "../styles/next/Tables.module.css"
import {PROJCOLUMNS} from "../component/columns/projectList"
import moment from "moment"
// Modals
import EditProjectModal from "./modals/EditProjectModal"
import DeleteModal from "./modals/DeleteModal"

const admin = ({dark,_allProjects}) => {
    const [allProjects,setAllProjects] = useState(_allProjects)

    const [update,setUpdate] = useState(1)
    //Modal
    const [showEditProjectModal,setShowEditProjectModal] = useState(false)
    const [showDeleteModal,setShowDeleteModal] = useState(false)

    const [editProjectModalData,setEditProjectModalData] = useState({})
    const [deleteModalData,setDeleteModalData] = useState({})

    const [editProjectModaIndex,setEditProjectModalIndex] = useState(-1)
    const [deleteModalIndex,setDeleteModalIndex] = useState(-1)


    //Table
    const proj_columns = useMemo(() => PROJCOLUMNS, []);
    const data = useMemo(() => allProjects, [update]);
  
    const updateAllProjectList = ({index,data})=>{
        let temp = []
        temp = [...allProjects]
        temp[index] = data
        setAllProjects([...temp])
        setUpdate(update+1)
    }
    const removeProjectFromList = ({index})=>{
        let temp = []
        temp = [...allProjects]
        temp.splice(index,1)
        setAllProjects([...temp])
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
          columns:proj_columns,
          data,
          initialState: { pageIndex: 0 },
          disableSortRemove: true
        },
            useSortBy,
            usePagination
        );

  

    const handleEditPageModel=(row)=>{
        setEditProjectModalIndex(row.id)
        setEditProjectModalData(row.values)
        setShowEditProjectModal(true)
    }

    const handleDelete = (row)=>{
        setShowEditProjectModal(false)

        setDeleteModalIndex(row.id)
        setDeleteModalData(row.values)
        setShowDeleteModal(true)
    }

    return (
        <div className={style.container}>
                {/* PROJECT LIST */}
                {allProjects && <div>
                    <div className="table-container">
                        <div className={style.tableHeader}>All Projects</div>
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
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell,i) => { 
                                            
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.column.Header=="Id" && <div  onClick={()=>handleEditPageModel(row)}>{cell.render('Cell')}</div>} 
                                                    {cell.column.Header=="name" && <div  onClick={()=>handleEditPageModel(row)}><img src={`/api/projectImage/${row.original.imageId}`}/> {cell.render('Cell')}</div> /* Adds Image to second column*/} 
                                                    {cell.column.Header=="Public Mint" && <div  onClick={()=>handleEditPageModel(row)}>{moment(cell.value).format("MM/DD/YYYY")} </div>}
                                                    {cell.column.Header=="Status" && <div  onClick={()=>handleEditPageModel(row)}>{cell.render('Cell')}</div>}
                                                    {cell.column.Header=="Approved" && <div style={{display:"flex",justifyContent:"space-between"}}>
                                                        <div onClick={()=>handleEditPageModel(row)} style={{fontWeight:"600",color:cell.value==true?"green":"red"}}>{cell.value == true ? "Approved":"NOT Approved"}</div>
                                                        <span onClick={()=>handleDelete(row)} className='projectTableDelete'>X</span>
                                                    </div>}
                                                </td>
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
                <EditProjectModal updateAllProjectList={updateAllProjectList} index={editProjectModaIndex} rowData={editProjectModalData} show={showEditProjectModal} handleClose={()=>{setShowEditProjectModal(false);setEditProjectModalData({})}}/>
                <DeleteModal updateAllProjectList={removeProjectFromList} index={deleteModalIndex}  rowData={deleteModalData}  show={showDeleteModal} handleClose={()=>{setShowDeleteModal(false);setDeleteModalData({})}} />
            </div>
           
    )
}

export default admin


  