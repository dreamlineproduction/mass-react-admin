
const Status = ({status = 1}) => {

    if (status === 1) {
        return (<span className="badge bg-success">Active</span>)
    } else {
        return (<span className="badge bg-danger">Inactive</span>)
    }
};

export default Status;