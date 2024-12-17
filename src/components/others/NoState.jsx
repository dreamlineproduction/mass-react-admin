/* eslint-disable react/prop-types */
const NoState = ({message = 'No records found (s).'}) => {
    return (
        <div className='py-5 text-danger text-center'>
            <p className='mb-0'>{message}</p>
        </div>
    );
};

export default NoState;