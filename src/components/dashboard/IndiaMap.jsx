/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import './IndiaMap.scss';
import BsModal from '../others/BsModal';
const IndiaMap = ({stateInfo}) => {
    const modalRef = useRef(null);


    
    const [hoveredState, setHoveredState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [svgContent, setSvgContent] = useState('');


    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [tooltipPosDistrict, setTooltipPosDistrict] = useState({ x: 0, y: 0 });
    const [stateSvgContent, setStateSvgContent] = useState('');

    // const stateInfo = {
    //     INAP: "Andhra Pradesh: Famous for Tirupati",
    //     INAR: "Arunachal Pradesh: Land of the Rising Sun",
    //     INAS: "Assam: Known for Tea Gardens",
    //     INBR: "Bihar: Historical State with Bodh Gaya",
    // };
    
    const districtInfo = {
        UPLMK:'Lakhimpur Khiri 320',
        UPLKO:'Lucknow'
    }

    useEffect(() => {
        // Fetch and set the SVG content
        fetch('/images/india.svg')
            .then(response => response.text())
            .then(svg => {
                setSvgContent(svg);
                // Add event listeners after the SVG has been inserted into the DOM
                setTimeout(() => {
                    const svgElement = document.querySelector('.india-map svg');
                    if (svgElement) {
                        svgElement.querySelectorAll('path').forEach((path) => {
                            path.addEventListener('mouseover', (e) => handleMouseOver(e));
                            path.addEventListener('mouseout', () => setHoveredState(null));
                            path.addEventListener('click', (e) => handleState(e));
                        });
                    }
                }, 100); // Delay to ensure SVG is rendered
        });
    }, []);

    const handleMouseOver = (e) => {
        const stateId = e.target.id;
        if (stateInfo[stateId]) {
            //console.log('Hovered State:', stateInfo[stateId], 'Position:', e.clientX, e.clientY);
            setHoveredState(stateInfo[stateId]);
            setTooltipPos({ x: e.clientX + 10, y: e.clientY - 20 });
        }
    };

   
    const handleState = (e) => {
        const stateId = e.target.id;
        
        const modal = new bootstrap.Modal(modalRef.current, {
            backdrop: false, // Disable the backdrop
        });
        modal.show();


        if(stateId === 'INUP'){
            fetch('/images/districts/uttar-pradesh.svg')
                .then(response => response.text())
                .then(svg => {
                    setStateSvgContent(svg);
                    // Add event listeners after the SVG has been inserted into the DOM
                    setTimeout(() => {
                        const svgElement = document.querySelector('.state-body svg');
                        if (svgElement) {
                            svgElement.querySelectorAll('path').forEach((path) => {
                                path.addEventListener('mouseover', (e) => handleDistrictMouseOver(e));
                                path.addEventListener('mouseout', (e) => {
                                    setHoveredDistrict(null)
                                    //e.target.style.fill = '';
                                });
                            });
                        }
                        
                    }, 100); // Delay to ensure SVG is rendered
            });
        }
    }

    const handleDistrictMouseOver = (e) => {     
        const districtId = e.target.id;        

        if(districtInfo[districtId]){
            setHoveredDistrict(districtInfo[districtId]);
            //pathElement.style.stroke = 'red';
            //e.target.style.fill = 'red';
            setTooltipPosDistrict({ x: e.clientX + 10, y: e.clientY - 20 });
        }
    }

    return (
        <>
            <div className="india-map-container">
                {/* Insert the SVG into the DOM */}
                <div
                    className="india-map"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />

                {/* Tooltip to display the hovered state info */}
                {hoveredState && (
                    <div
                        className="tooltip"
                        style={{ top: `${tooltipPos.y}px`, left: `${tooltipPos.x}px` }}
                    >
                        {hoveredState}
                    </div>
                )}
            </div>

             {/* Modals */}
             <div className="modal fade" id="exampleModal" tabIndex="-1" 
             aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal Title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                           <div
                                className="state-body w-100 h-auto"
                                dangerouslySetInnerHTML={{ __html: stateSvgContent }}
                            />

                            {/* Tooltip to display the hovered state info */}
                            {hoveredDistrict && (
                                <div
                                    className="tooltip"
                                    style={{ top: `${tooltipPosDistrict.y}px`, left: `${tooltipPosDistrict.x}px` }}
                                >
                                    {hoveredDistrict}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IndiaMap;
