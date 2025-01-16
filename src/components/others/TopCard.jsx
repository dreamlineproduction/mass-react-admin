import { Link } from "react-router-dom";

const TopCard = ({title = 'Card Title', 
    showActive = true, 
    active = 0, 
    inactive = 0,
    total = 0,
    buttonLabel,
    buttonLink,
    children
}) => {
    return (
        <div className="col-12 col-md-3 col-xxl-3 d-flex">
        <div className="card w-100">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-0">{title}</h5>
                    {showActive &&
                        <div className="mt-2">
                            <span className="active-signal"></span> Active {active}
                            <span className="inactive-signal ms-4"></span> Inactive {inactive}
                        </div>
                    }
                    
                </div>
                <div>
                    <h2>{total}</h2>
                </div>
            </div>

            <hr style={{ margin: "0" }} />
            <div className="card-body">
                <div className="align-self-center w-100">
                    {children}     
                    {buttonLabel && buttonLink &&
                        <Link to={buttonLink} title={buttonLabel} className="btn btn-primary mt-4">{buttonLabel}</Link>               
                    }
                    
                </div>
            </div>
        </div>
    </div>
    );
};

export default TopCard;