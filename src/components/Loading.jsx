import { CSpinner } from "@coreui/react";

const Loading = () => {
    return (
        <div className="text-center py-5">
            <CSpinner color="primary" variant="grow"  />
            <p>Please wait...</p>
        </div>
    );
};

export default Loading;