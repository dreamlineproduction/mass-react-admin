import React from 'react';
import PageTitle from '../others/PageTitle';

const ReviewProduct = () => {
    return (
        <div>
            <PageTitle
                title="Products Review"
                buttonLink={hasPermission(configPermission.ADD_PRODUCT) ? '/products/add-product' : null}
                buttonLabel={hasPermission(configPermission.ADD_PRODUCT) ? 'Add New Product' : null}
            />
        </div>
    );
};

export default ReviewProduct;