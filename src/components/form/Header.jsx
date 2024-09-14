import { CButton, CCardHeader } from "@coreui/react";
import { Link } from "react-router-dom";

const Header = ({title,url}) => {
    return (
        <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
                <div><strong>{title}</strong></div>
                <div className="d-flex">
                    <div>
                        <Link to={url}>
                            <CButton color="primary" className="me-3" variant="ghost">
                                Back to list
                            </CButton>
                        </Link>                            
                    </div>
                    <div></div>
                </div>
            </div>
        </CCardHeader>
    );
};

export default Header;