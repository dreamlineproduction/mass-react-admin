
const Unauthorized = () => {
    return (
        <div className="error-page h-100 d-flex justify-content-center align-items-center flex-column">
            <h1>403</h1>
            <p className="mb-4">You are not authorized to access this page.</p>
            <a href="/" className="btn btn-primary">Go Back to Home</a>
        </div>
    );
};

export default Unauthorized;