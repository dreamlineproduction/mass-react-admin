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
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            Card
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllShort;