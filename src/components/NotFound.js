
import React from 'react';
import image1 from '../notfound.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome, faInfoCircle, faSignInAlt, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const NotFound = () => {
  return (
    <div className='container mt-5 mb-5'>
    <div className='row mt-5'>
      <div className='col-lg text-center'>
        <img src={image1} alt='not_found' className='img-fluid' width={'600px'}/>
      </div>
    </div>
    
    <h3 className='mt-5 text-center fw-bold'>404 - Page Not Found</h3>
<div className='text-center'>
    <p className='mt-5 text-muted'> <FontAwesomeIcon icon={faExclamationTriangle} style={{color :'#7447FF'}} /> Sorry, the page you are looking for does not exist, you may have mistyped the address or the page may have moved. </p>
    <p><FontAwesomeIcon icon={faInfoCircle} style={{color :'#7447FF'}} /> If you are the application owner check the logs for more information.</p>
    <p className='fw-bold'><FontAwesomeIcon icon={faHome}  style={{color :'#7447FF'}}/> You can always start over from the home page.</p>
    <p className='fw-bold'><FontAwesomeIcon icon={faUserPlus}  style={{color :'#7447FF'}}/> Don't have an account? Register to explore more.</p>
    <p className='fw-bold'><FontAwesomeIcon icon={faSignInAlt} style={{color :'#7447FF'}} /> Already have an account? Login to continue.</p>
    <div className='mt-5'>
      <a href='/' className='btn btn-outline-custom-secondaire'><FontAwesomeIcon icon={faHome} />  Home</a>
      <a href='/register' className='btn btn-outline-custom-secondaire mx-4'> <FontAwesomeIcon icon={faUserPlus} /> Register</a>
      <a href='/login' className='btn btn-outline-custom-secondaire '><FontAwesomeIcon icon={faSignInAlt} />  Login</a>
    </div>
    </div>
  </div>
  
  );
};

export default NotFound;
