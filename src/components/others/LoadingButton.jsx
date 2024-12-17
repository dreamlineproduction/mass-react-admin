import { Loader } from "react-feather";

const LoadingButton = () => {
    return (
        <button className="btn btn-primary px-3 py-2 d-flex justify-content-center align-items-center" type="button" disabled>
            <div className="loading-spinner d-inline-flex me-2">
                <Loader />
            </div>
            Loading...
        </button>
    );
};

export default LoadingButton;