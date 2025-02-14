/* eslint-disable react/prop-types */

const BsModal = ({
    modalId = "staticBackdrop", 
    title = 'Modal Title', 
    children='Modal Body', 
    showCloseBtn = true,
    size = 'xl',
    modalRef=null
}) => {
    return (
        <div 
            className="modal fade" 
            id={modalId} 
            data-bs-backdrop="static" 
            data-bs-keyboard="false" 
            tabIndex="-1" 
            aria-labelledby={`${modalId}Label`} 
            aria-hidden="true"
        >
            <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-4">{title}</h1>
                            <button         
                                ref={modalRef}
                                type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    {showCloseBtn && 
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                        }
                </div>
            </div>            
        </div>
    );
};

export default BsModal;