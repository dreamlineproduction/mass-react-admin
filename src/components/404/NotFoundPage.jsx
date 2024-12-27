
const NotFoundPage = () => {
    return (
        <div className="error-page h-100 d-flex justify-content-center align-items-center flex-column">
            <h1>404</h1>
            <p className="mb-4">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
            <a href="/" className="btn btn-primary">Go Back to Home</a>
        </div>
    );
};

export default NotFoundPage;