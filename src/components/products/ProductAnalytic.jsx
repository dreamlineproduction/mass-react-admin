import PageTitle from "../others/PageTitle";

const ProductAnalytic = () => {
    return (
        <div>
            <PageTitle
                title="Product Analytics"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
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

export default ProductAnalytic;