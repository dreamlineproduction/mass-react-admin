import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({charData}) => {
    
    

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={charData.options} series={charData.series} type="bar" height={450} />
            </div>            
        </div>
    );
};

export default ApexChart;