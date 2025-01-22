/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import './IndiaMap.scss';
import BsModal from '../others/BsModal';
import { actionFetchData } from '../../actions/actions';
import { API_URL } from '../../config';
import Loading from '../others/Loading';
import { useNavigate } from 'react-router-dom';
const IndiaMap = ({stateInfo,accessToken}) => {
    console.log(stateInfo)


    const modalRef = useRef(null);

    const [isLoading,setIsLoading] = useState(false);
    
    const [hoveredState, setHoveredState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [svgContent, setSvgContent] = useState('');

    const [selectedState, setSelectedState] = useState('');

    const [districtInfo, setDistrictInfo] = useState({});
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [tooltipPosDistrict, setTooltipPosDistrict] = useState({ x: 0, y: 0 });
    const [stateSvgContent, setStateSvgContent] = useState('');

    // const stateInfo = {
    //     INAP: "Andhra Pradesh: Famous for Tirupati",
    //     INAR: "Arunachal Pradesh: Land of the Rising Sun",
    //     INAS: "Assam: Known for Tea Gardens",
    //     INBR: "Bihar: Historical State with Bodh Gaya",
    // };

    const fetchIndiaMap = () => {
        fetch('/images/india.svg')
        .then(response => response.text())
        .then(svg => {
            setSvgContent(svg);                
        });
    }

    const handleMouseOver = (e) => {
        const stateId = e.target.id;
        if (stateInfo[stateId]) {
            setHoveredState(stateInfo[stateId]);
            setTooltipPos({ x: e.clientX + 10, y: e.clientY - 20 });
        }
    };

   
    const handleState = async (e) => {
        setIsLoading(true)
        let stateName = '';

        const stateId = e.target.id;        

        if(stateInfo[stateId]) {
            stateName = stateInfo[stateId].replace(/\s*\(\d+\)$/, ""); 
            setSelectedState(stateName);
        }
        
        if(stateName === ''){
            console.error('Invalid State Name');
            return
        }

        const modal = new bootstrap.Modal(modalRef.current, {
            backdrop: false, // Disable the backdrop
        });
        modal.show();


        let districtMap = '';

        if(stateId === 'INUP'){
            districtMap = '/images/districts/uttar-pradesh.svg';
        }

        if(stateId === 'INWB') {
            districtMap = '/images/districts/west_bengal.svg';
        }

        if(districtMap !== '')
        {            
            //--Fetch Data
            let response = await actionFetchData(`${API_URL}/dashboard/state-map-data/${stateId}`, accessToken);
            response = await response.json();

            if(response.status === 200){
                setDistrictInfo(response.data)                
                fetch(districtMap)
                .then(responseII => responseII.text())
                .then(svg => {
                    setStateSvgContent(svg);
                    setIsLoading(false)                       
                });             
            }            
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

    useEffect(() => {
        fetchIndiaMap()

        const svgElement = document.querySelector('.india-map svg');
        if (svgElement && Object.keys(stateInfo).length > 0) {
            console.log('svgElement',svgElement);
            
            svgElement.querySelectorAll('path').forEach((path) => {
                path.addEventListener('mouseover', (e) => handleMouseOver(e));
                path.addEventListener('mouseout', () => setHoveredState(null));
                path.addEventListener('click', (e) => handleState(e));
            });
        }
    }, [stateInfo]);

    useEffect(() => {
        // Fetch and set the SVG content

        const stateSvgElement = document.querySelector('.state-body svg');
        if (stateSvgElement && Object.keys(districtInfo).length > 0) {
            stateSvgElement.querySelectorAll('path').forEach((path) => {
                path.addEventListener('mouseover', (e) => handleDistrictMouseOver(e));
                path.addEventListener('mouseout', (e) => {
                    setHoveredDistrict(null)
                    //e.target.style.fill = '';
                });

                path.addEventListener('click',(e) => {
                    let districtName = ''
                    const districtId = e.target.id 
                    if(districtInfo[districtId]){
                        districtName  = districtInfo[districtId].replace(/\s*\(\d+\)$/, "");
                    }
                    

                    if(districtName !== ''){                    
                        window.open(`/users/city-users?state=${selectedState}&district=${districtName}`, '_blank');
                    }
                })
            });
        }  
    }, [districtInfo]);


   
    
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
                            <h5 className="modal-title" id="exampleModalLabel">{selectedState}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {isLoading &&
                                <Loading />
                            }
                            <div className='card'>

                                <div className="card-body m-auto">
                                <div
                                    className="state-body w-100 h-75"
                                    dangerouslySetInnerHTML={{ __html: stateSvgContent }}
                                />
                                {hoveredDistrict && (
                                    <div
                                        className="tooltip"
                                        style={{ top: `${tooltipPosDistrict.y}px`, left: `${tooltipPosDistrict.x}px` }}
                                    >
                                        {hoveredDistrict}
                                    </div>
                                )}
</div>


                            </div>
                        </div>                       
                    </div>
                </div>
            </div>
        </>
    );
};

export default IndiaMap;
