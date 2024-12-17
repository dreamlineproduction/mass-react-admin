import PageTitle from "../others/PageTitle";

const AllNotification = () => {
    return (
        <div>
            <PageTitle
                title="All Notifications"
                buttonLink="/notification/new-notification"
                buttonLabel="New Notification"
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <table className="table table-striped table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Offer ID</th>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>In Homepage ?</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th> 
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>asdadasd</td>
                                    <td>adasd</td>
                                    <td>asdasdasd</td>
                                    <td>asdasdasd</td>
                                    <td>asdasdasd</td>
                                    <td>dasdasd</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>asdadasd</td>
                                    <td>adasd</td>
                                    <td>asdasdasd</td>
                                    <td>asdasdasd</td>
                                    <td>asdasdasd</td>
                                    <td>dasdasd</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>asdadasd</td>
                                    <td>adasd</td>
                                    <td>asdasdasd</td>
                                    <td>asdasdasd</td>
                                    <td>asdasdasd</td>
                                    <td>dasdasd</td>
                                </tr>
                            </tbody>
                        </table>    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllNotification;