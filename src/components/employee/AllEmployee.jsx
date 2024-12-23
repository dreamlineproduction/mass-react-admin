import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import Status from "../others/Status";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import {
  actionDeleteData,
  actionFetchData,
  actionPostData,
} from "../../actions/actions";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { API_URL } from "../../config";
import Loading from "../others/Loading";
import NoState from "../others/NoState";

const AllEmployee = () => {
  const { Auth } = useContext(AuthContext);
  const perPage = 20;
  const accessToken = Auth("accessToken");
  const [employees, setEmployees] = useState([]);
  const [search, setSearchinput] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setLoading] = useState(true);

  // Fetch Data
  let finalUrl = `${API_URL}/employees?page=${pageNumber}&perPage=${perPage}`;
  const fetchData = async () => {
    setLoading(true);

    let response = await actionFetchData(finalUrl, accessToken);
    response = await response.json();
    if (response.status) {
      setEmployees(response.data.data);
      setPageCount(response.totalPage);
    }
    setLoading(false);
  };

  //--Delete api call
  const actionDelete = async (id) => {
    const toastId = toast.loading("Please wait...");
    try {
      let response = await actionDeleteData(
        `${API_URL}/employees/${id}`,
        accessToken
      );
      response = await response.json();
      if (response.status) {
        const filteredData = employees.filter((item) => item.id !== id);
        setEmployees(filteredData);

        toast.success(response.message, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // -- Delete employee
  const deleteEmployee = (id) => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        actionDelete(id);
      }
    });
  };

  const handlerSearch = () => {
    if (search.trim() !== "") {
      finalUrl += `&search=${search}`;
      fetchData();
    }
  };

  // Change Status
  const changeStatus = async (id) => {
    const toastId = toast.loading("Please wait...");

    let findedIndex = employees.findIndex((item) => item.id === id);
    let status = employees[findedIndex].status === 1 ? 0 : 1;

    try {
      const postData = { status };
      let response = await actionPostData(
        `${API_URL}/employees/change-status/${id}`,
        accessToken,
        postData,
        "PUT"
      );
      response = await response.json();

      if (response.status) {
        employees[findedIndex].status = status;
        setEmployees([...employees]);
        toast.success(response.message, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  return (
    <div>
      <PageTitle
        title="All Employees"
        buttonLink="/employees/add-employee"
        buttonLabel="Add New Employee"
      />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="my-4 d-flex justify-content-end gap-3">
              <div className="search-input-outer">
                <input
                  onChange={(e) => {
                    setSearchinput(e.target.value);
                    if (e.target.value === "") {
                      fetchData();
                    }
                  }}
                  className="form-control"
                  type="text"
                  placeholder="Search..."
                />
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-primary me-3"
                  onClick={handlerSearch}
                >
                  Search
                </button>
              </div>
            </div>
            {isLoading && <Loading />}
            {!isLoading && employees.length === 0 && (
              <NoState message="No employees found." />
            )}

            {!isLoading && employees.length > 0 && (
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>

                    <th>Phone Number</th>
                    <th>User Type</th>
                    <th>Designation</th>
                    <th>Employee Code</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((item) => (
                    <tr key={`employee-${item.id}`}>
                      <td>{item.id}</td>
                      <td>
                        {item.image ? (
                          <img
                            src={item.image_url}
                            className="rounded-circle me-3"
                            alt={item.name}
                            width={48}
                            height={48}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${item.name}&background=212631&color=fff`}
                            className="rounded-circle me-3"
                            alt={item.name}
                            width={48}
                          />
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.role.name}</td>
                      <td>{item.designation}</td>
                      <td>{item.employee_code ? item.employee_code : "N/A"}</td>
                      <td>
                        <Status status={item.status} />
                      </td>

                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            More Options
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link className="dropdown-item" to={`/employees/edit-employee/${item.id}`}>
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => changeStatus(item.id)}
                              >
                                {item.status === 1 ? "Inactive" : "Active"}
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => deleteEmployee(item.id)}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEmployee;
