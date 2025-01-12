import { useContext } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { API_URL, configPermission } from "../../config";

const AllArea = () => {
      const { Auth,hasPermission } = useContext(AuthContext);
    
    return (
        <div>
            <PageTitle
                title="All Area"
                buttonLink={hasPermission(configPermission.ADD_AREA) ? '/areas/new-area' : null}
                buttonLabel={hasPermission(configPermission.ADD_AREA) ? 'Add New Area' : null}
            />
        </div>
    );
};

export default AllArea;