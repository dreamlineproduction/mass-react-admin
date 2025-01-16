
const Status = ({status = 1}) => {

    if (status === 1) {
        return (<span className="d-inline-flex px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">Active</span>)
    } else {
        return (<span className="d-inline-flex px-2 py-1 fw-semibold text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-2">Inactive</span>)
    }
};

export default Status;