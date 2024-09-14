import { CButton, CSpinner } from "@coreui/react";

const LoadingButton = ({btnText = 'Loading...'}) => {
    return (
        <CButton color="primary" disabled>
            <CSpinner className="me-2" as="span" size="sm" aria-hidden="true" />
            {btnText}
        </CButton>
    );
};

export default LoadingButton;