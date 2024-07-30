import React from 'react';
import Image1 from '../user.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faExclamationTriangle, faInfoCircle, faLock, faUserSlash } from '@fortawesome/free-solid-svg-icons';
const BlockProfileComponent = ({ user }) => {
  const onMessageButtonClick = () => {
  };

  return (
    <div className="User">
      <div className="card border rounded shadow p-3 mb-5 bg-body rounded mt-5">
        <div className="row">
          <div className="col-md-12 text-center">

          <img src={Image1} className="img-fluid rounded-circle" alt="Photo de profil" style={{ width: '200px'}} />

            <h4>{user.name}</h4>
            <p className="text-secondary">@Introuvable</p>
            <div className="row">

            <div className="col-md-4">
            <p>{0}</p>
  
            <p>Events</p>
            </div>
              <div className="col-md-4">
                <p>{0}</p>
                <p>followers</p>
              </div>
              <div className="col-md-4">
                <p>{0}</p>
                <p>following</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5 mb-4">
        <div className="col-md-12 text-center">
          <h5>
            <FontAwesomeIcon icon={faUserSlash} style={{ color: '#FF4C4C' }} /> Compte introuvable
          </h5>
          <p className='mt-3'>
            <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#FFA500' }} /> Nous sommes désolés, mais le profil que vous recherchez semble introuvable.
          </p>
          <p>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#17A2B8' }} /> Il se peut que le propriétaire du profil ait supprimé son compte ou que l'URL que vous avez entrée soit incorrecte.
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} style={{ color: '#28A745' }} /> Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support pour obtenir de l'aide.
          </p>
        </div>
      </div>
      
      
      </div>
    </div>
  );
};

export default BlockProfileComponent;
