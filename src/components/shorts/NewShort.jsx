import PageTitle from "../others/PageTitle";

const NewShort = () => {
  return (
    <div>
      <PageTitle
        title={"Create New Short"}
        buttonLink={"/shorts/all-shorts"}
        buttonLabel={"Back to List"}
      />
      <div className="row">
        <div className="col-12 col-xl-8 col-md-8">
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
        <div className="col-12 col-xl-4 col-md-4">
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

export default NewShort;
