import PageTitle from "../others/PageTitle";

const EditShort = () => {
    return (
        <div>
            <PageTitle 
                title={'Edit Shorts'}
                buttonLink={'/shorts/all-shorts'}
                buttonLabel={'Back to List'}
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditShort;