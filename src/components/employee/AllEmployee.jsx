import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import Status from "../others/Status";

const AllEmployee = () => {
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
                  className="form-control"
                  type="text"
                  placeholder="Search ID,name,phone,Referral Code etc."
                />
              </div>

              <div>
                <button type="button" className="btn btn-primary me-3">
                  Search
                </button>
              </div>
            </div>

            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Full Name</th>
                  <th>User Type</th>
                  <th>Phone Number</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Joined date</th>
                  <th>Referral Code</th>
                  <th>Total Product Scanned</th>
                  <th>XP Balance</th>
                  <th>Total Redeemed</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{1}</td>
                  <td>
                    <img
                      src={`https://ui-avatars.com/api/?name=John Doe&background=212631&color=fff`}
                      className="rounded-circle me-3"
                      alt="John Doe"
                      width={48}
                    />
                  </td>
                  <td>{"Name"}</td>
                  <td>{"Role"}</td>
                  <td>{"+917268072569"}</td>
                  <td>{"Luckow"}</td>
                  <td>{"N/A"}</td>
                  <td>{}</td>
                  <td>{"N/A"}</td>

                  <td>{50} Products</td>
                  <td>500 XP</td>
                  <td>600 Items</td>
                  <td>
                    <Status status={1} />
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
                          <Link className="dropdown-item" to={`#`}>
                            Edit
                          </Link>
                        </li>
                        <li>
                          <button type="button" className="dropdown-item">
                            Inactive
                          </button>
                        </li>
                        <li>
                          <button type="button" className="dropdown-item">
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEmployee;
