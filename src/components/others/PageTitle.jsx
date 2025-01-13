/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const PageTitle = (props) => {
    const {title='Page Title',buttonLink = '', buttonLabel = ''} = props;    
    return (
        <div className="mb-3 d-flex align-items-center justify-content-between">
            <h1 className="h3 d-inline align-middle">{title}</h1>
            {buttonLabel && buttonLink &&
                <div className="">
                    <Link to={buttonLink} className="btn btn-success btn-lg">
                       {buttonLabel}
                    </Link>
                </div> 
            }                              
        </div>
    );
};

export default PageTitle;