/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import './IndiaMap.scss';
import { actionPostData } from '../../actions/actions';
import { API_URL } from '../../config';
import Loading from '../others/Loading';
import * as d3 from "d3";
import MapSvg from './MapSvg';

const IndiaMap = ({ stateInfo, accessToken, type = 'dashboard', formData = {} }) => {
    const colorScale = d3
        .scaleLinear()
        .domain([Math.min(...Object.values(stateInfo)), Math.max(...Object.values(stateInfo))])
        .range(["#939393", "#4A936C"]);



    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isLoading, setIsLoading] = useState(false);

    const [hoveredState, setHoveredState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [svgContent, setSvgContent] = useState('');

    const [selectedState, setSelectedState] = useState('');

    const [districtInfo, setDistrictInfo] = useState({});
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [tooltipPosDistrict, setTooltipPosDistrict] = useState({ x: 0, y: 0 });
    const [stateSvgContent, setStateSvgContent] = useState('');

 

    const handleMouseOver = (e) => {
        let price = ' ';
        if (stateInfo[e.target.id]) {
            price = `${e.target.getAttribute("name")} ${stateInfo[e.target.id]}`;
        } else {
            price = `${e.target.getAttribute("name")}`;
        }

        setHoveredState(price);
        setTooltipPos({ x: e.clientX + 10, y: e.clientY - 20 });
    };

    const handleMouseOut = (e) => {
        setHoveredState(null)
        setTooltipPos({ x: 0, y: 0 });
    }

    const handleState = async (e) => {
        setIsLoading(true)

        const stateId = e.target.id;

        setSelectedState(e.target.getAttribute("name"));


        let districtMap = '';

        if (stateId === 'INAS') {
            districtMap = '/images/districts/assam.svg';
        }
        if (stateId === 'INBR') {
            districtMap = '/images/districts/bihar.svg';
        }
        if (stateId === 'INCH') {
            districtMap = '/images/districts/ch.svg';
        }
        if (stateId === 'INJH') {
            districtMap = '/images/districts/jh.svg';
        }
        if (stateId === 'INOD') {
            districtMap = '/images/districts/odisha.svg';
        }
        if (stateId === 'INTR') {
            districtMap = '/images/districts/tr.svg';
        }
        if (stateId === 'INUP') {
            districtMap = '/images/districts/uttar-pradesh.svg';
        }
        if (stateId === 'INWB') {
            districtMap = '/images/districts/west_bengal.svg';
        }

        setIsModalOpen(true);

        if (districtMap !== '') {
            // Default API URL
            let apiUrl = `${API_URL}/dashboard/state-map-data`;

            let postData = {
                state: stateId
            }
            if (Object.keys(formData).length > 0) {
                postData = { ...postData, ...formData }
            }

            if (type === 'product') {
                apiUrl = `${API_URL}/products/state-map-data`;

            }
            if (type === 'user') {
                apiUrl = `${API_URL}/users/state-map-data`;
            }

            //--Fetch Data
            let response = await actionPostData(apiUrl, accessToken, postData);
            response = await response.json();

            if (response.status === 200) {
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
        if (districtInfo[districtId]) {
            setHoveredDistrict(districtInfo[districtId]);
            //pathElement.style.stroke = 'red';
            //e.target.style.fill = 'red';
            setTooltipPosDistrict({ x: e.clientX + 10, y: e.clientY - 20 });
        }
    }

  

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

                path.addEventListener('click', (e) => {
                    let districtName = ''
                    const districtId = e.target.id
                    if (districtInfo[districtId]) {
                        districtName = districtInfo[districtId].replace(/\s*\(\d+\)$/, "");
                    }


                    if (districtName !== '' && type === 'dashboard') {
                        window.open(`/users/city-users?state=${selectedState}&district=${districtName}`, '_blank');
                    }
                })
            });
        }
    }, [districtInfo, stateSvgContent]);




    return (
        <>
            <div className="india-map-container">
                {/* Insert the SVG into the DOM */}
                <div className="india-map">
                    <MapSvg
                        colorScale={colorScale}
                        stateInfo={stateInfo}
                        handleMouseOut={handleMouseOut}
                        handleMouseOver={handleMouseOver}
                        handleState={handleState}
                    />
                </div>
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
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{selectedState}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {isLoading &&
                                    <Loading />
                                }
                                <div className='card'>

                                    <div className="card-body m-auto">
                                        <div
                                            className="state-body w-100 h-50"
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
            )}
        </>
    );
};

export default IndiaMap;
