import { CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck } from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import { API_URL, statusBadge } from "../../config";
import Loading from "../../components/Loading";
import { actionFetchData, actionPostData } from "../../actions/actions";
import { Link } from "react-router-dom";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";

const AllPages = () => {
    const { Auth } =  useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [pages, setPage] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);

     //--Fetch Data
     let finalUrl = `${API_URL}/pages?page=${pageNumber}&perPage=${perPage}`;
     const fetchOffer = async () => {
        let response = await actionFetchData(finalUrl,accessToken);
        response    = await response.json();
        if (response.status) {
        setPage(response.data.data);
        setPageCount(response.totalPage);
        }          
        setLoading(false)
    }

     // Change Status
    const changeStatus = async (id) => {
        const toastId = toast.loading("Please wait...")   

        let findedIndex = pages.findIndex(item => item.id === id);
        let status = (pages[findedIndex].status === 1) ? 0 : 1;  

        try{
            const postData = {status};
            let response =  await actionPostData(`${API_URL}/pages/change-status/${id}`,accessToken,postData,'PUT');
            response = await response.json();

            if (response.status) {
                pages[findedIndex].status = status;
                setPage([...pages]);
                toast.success(response.message,{
                    id:toastId
                });
            }             
        } catch(error){
            toast.error(error)
        }
    }

    useEffect(() => {
        fetchOffer();
    },[pageNumber])

    return (
        <CCard>
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <div><strong>All Pages</strong></div>
                    <div className="d-flex">
                        <div>
                        
                        </div>
                    </div>
                </div>
            </CCardHeader>

            <CCardBody>
                <div>
                    {isLoading && 
                        <Loading />
                    }

                    {pages.length > 0 ?
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Page ID</th>
                                    <th>Title</th>
                                    <th>Crated At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pages.map(item => {
                                        return(
                                            <tr key={item.id}>                                               
                                                <td>{item.id}</td>
                                                <td>{item.title}</td>      
                                                <td>{item.created_at}</td>
                                                <td>
                                                    {statusBadge(item.status)}                                                    
                                                </td>
                                                <td>
                                                <CDropdown>
                                                    <CDropdownToggle className="border-0" caret={false} href="#" color="ghost">...</CDropdownToggle>
                                                    <CDropdownMenu>                                                    
                                                        <Link className="dropdown-item" to={`/pages/edit-page/${item.id}`}>Edit</Link>
                                                        <CDropdownItem onClick={() => changeStatus(item.id)}>
                                                            {item.status === 1 ? 'Block' : 'Active' }
                                                        </CDropdownItem>
                                                    </CDropdownMenu>
                                                </CDropdown>
                                                </td>
                                            </tr>
                                        )
                                    })

                                }
                            </tbody>
                        </table>          
                        :
                        <NoState 
                            message="No Pages"
                        />         
                    } 
                </div>
                {pages.length > 0 &&
                    <div className='d-flex  align-items-start justify-content-end'>                     
                        <Pagination 
                            pageCount={pageCount}
                            handlePageChange={(event) => setPageNumber(event.selected+1)}
                        />  
                       
                    </div>  
                                     
                }   
            </CCardBody>
        </CCard>
    );
};

export default AllPages;
