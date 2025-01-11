import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({charData,description}) => {
    
    

    return (       
        <div>
          <div id="chart">
              <ReactApexChart options={charData.options} series={charData.series} type="bar" height={450} />
          </div>
          <div id="html-dist">
             <h5 className='text-center'>{description}</h5>
          </div>
      </div>
    );
};

export default ApexChart;