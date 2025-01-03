import PageTitle from "../others/PageTitle";

const AllShort = () => {
    return (
        <div>
            <PageTitle 
                title={'All Shorts'}
                buttonLink={'/shorts/new-shorts'}
                buttonLabel={'New Short'}
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-4">
                                <label className="form-label">Name</label>
                                <input
                                    className={`form-control custom-input`}
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter role name*"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllShort;