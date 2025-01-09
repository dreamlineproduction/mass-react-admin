/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './IndiaMap.scss';
const IndiaMap = ({stateInfo}) => {
    const [hoveredState, setHoveredState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [svgContent, setSvgContent] = useState('');

    // const stateInfo = {
    //     INAP: "Andhra Pradesh: Famous for Tirupati",
    //     INAR: "Arunachal Pradesh: Land of the Rising Sun",
    //     INAS: "Assam: Known for Tea Gardens",
    //     INBR: "Bihar: Historical State with Bodh Gaya",
    //     INCT: "Chhattisgarh: Known for Tribal Culture",
    //     INGA: "Goa: Famous for Beaches",
    //     INGJ: "Gujarat: Land of Business",
    //     INHR: "Haryana: Famous for Agriculture",
    //     INHP: "Himachal Pradesh: Famous for Hill Stations",
    //     INJK: "Jammu & Kashmir: Known for Scenic Beauty",
    //     INJH: "Jharkhand: Rich in Mineral Resources",
    //     INKA: "Karnataka: Known for Bengaluru",
    //     INKL: "Kerala: Famous for Backwaters",
    //     INMP: "Madhya Pradesh: Heart of India",
    //     INMH: "Maharashtra: Known for Mumbai",
    //     INMN: "Manipur: Known for Scenic Hills",
    //     INML: "Meghalaya: Known for Living Root Bridges",
    //     INMZ: "Mizoram: Land of Rolling Hills",
    //     INNL: "Nagaland: Famous for Tribal Culture",
    //     INOR: "Odisha: Known for Jagannath Temple",
    //     INPB: "Punjab: Known for Golden Temple",
    //     INRJ: "Rajasthan: Famous for Palaces",
    //     INSK: "Sikkim: Known for Kanchenjunga",
    //     INTN: "Tamil Nadu: Famous for Temples",
    //     INTG: "Telangana: Known for Charminar",
    //     INTR: "Tripura: Famous for Palaces and Temples",
    //     INUP: "Uttar Pradesh: Historical Significance",
    //     INUK: "Uttarakhand: Famous for Religious Tourism",
    //     INWB: "West Bengal: Known for Darjeeling",
    //     INAN: "Andaman & Nicobar Islands: Famous for Beaches",
    //     INCH: "Chandigarh: Known for Urban Planning",
    //     INDN: "Dadra & Nagar Haveli: Famous for Tribal Heritage",
    //     INDH: "Daman & Diu: Coastal Beauty",
    //     INLD: "Lakshadweep: Known for Coral Reefs",
    //     INDL: "Delhi: Capital of India",
    //     INPY: "Puducherry: Famous for French Architecture",
    // };
    

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
                            path.addEventListener('mouseout', handleMouseOut);
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

    const handleMouseOut = () => {
        setHoveredState(null);
    };

    const handleState = (e) => {
        const stateId = e.target.id;
     

    }

    return (
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
    );
};

export default IndiaMap;
