import React from 'react';
import { Loader } from 'react-feather';
import { BounceLoader } from 'react-spinners';

const Loading = () => (
   <div className='mx-auto py-5'>
        <BounceLoader 
            size={40}
            color='#3b7ddd'
        />
   </div>
  );
  
export default Loading;