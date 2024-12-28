import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="error-page d-flex justify-content-center align-items-center flex-column" style={{height:'600px'}}>
            <h1>403</h1>
            <p className="mb-4">You are not authorized to access this page.</p>
            <Link to="/dashboard" className="btn btn-primary">Go Back to Dashboard</Link>
        </div>
    );
};

export default Unauthorized;