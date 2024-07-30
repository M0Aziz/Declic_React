// PrivateProfileComponent.js

import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTimes,faLock, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PrivateProfileComponent = ({ user, followersCount, followingCount, isFollower,isFollowing, RemoveFollowers,CancelFriendShip, AddFollowers, userId, username }) => {
  const history = useNavigate(); 
const onMessageButtonClick = (u) => {
  history(`/messages/${u}`); 
};
  

const [selectedImageIndex, setSelectedImageIndex] = useState(null);
const [modalIsOpen, setModalIsOpen] = useState(false);
const openModal = (index) => {
  setSelectedImageIndex(index);
  setModalIsOpen(true);
};



function confirmBlock(userId) {
  axios.put(`http://localhost:5000/users/block/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}` 
    }
  })
  .then(response => {
    console.log('Utilisateur bloqué avec succès !');
const message ="Utilisateur bloqué avec succès !";
    toast.success(message);

    window.location.reload();
  })
  .catch(error => {
    console.error('Erreur lors du blocage de l\'utilisateur :', error);
    toast.error(error);

  });
}

const isFriend = user.profile.friends.some(friend => friend.user === userId && friend.status === 'N');

const modalContent = (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
    {selectedImageIndex !== null && (
      <div>
        <button className='btn btn-primaire me-5' onClick={() => setSelectedImageIndex(prevIndex => prevIndex === 0 ? user.profile.additionalImages.length - 1 : prevIndex - 1)}>            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <img 
          src={`http://localhost:5000/images/${user.profile.additionalImages[selectedImageIndex]}`} 
          alt={`Additional Image ${selectedImageIndex}`} 
          style={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain' }}
          className='mt-3 img-fluid'
        />
        <button className='btn btn-primaire ms-5' onClick={() => setSelectedImageIndex(prevIndex => (prevIndex + 1) % user.profile.additionalImages.length)}>            <FontAwesomeIcon icon={faArrowRight} />
        </button>

        <button className='btn btn-primaire' onClick={() => setModalIsOpen(false)} style={{ position: 'absolute', top: '10px', right: '30px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#333' }}>
        <FontAwesomeIcon icon={faTimes} />
</button>

       
      </div>
    )}
  </div>
);
  return (
    <div className="User">
    {/* <ToastContainer /> */}

   
        <div className="User">
            <div className="card border rounded shadow p-3 mb-5 bg-body rounded mt-5 ">
              <div className="row">
                <div className="col-md-12 text-center">
                <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4 mb-3'>
      
                {user.user.profilePicture.startsWith('https://') ? (
                  <img src={user.user.profilePicture} className="img-fluid rounded-circle" alt="Photodeprofilx" style={{  height: '180px',  objectFit:'cover', borderRadius:'20px' }} />
              ) : (
                  <img src={`http://localhost:5000/images/${user.user.profilePicture}`} className="img-fluid rounded-circle" alt="PhotodeprofilYou" style={{  height: '180px',  objectFit:'cover', borderRadius:'20px' }} />
              )}                  </div>
                  </div>
                  <h4>{user.user.firstName} {user.user.lastName}</h4>
                  <p className="text-secondary">@{user.profile.username}</p>
                <div className='row'>
      
                <div className="col-md-4">
                <p>{user.eventCount}</p>
      
                <p>Events</p>
                </div>
                    <div className="col-md-4">
                      <p>{followersCount}</p>
                      <p>followers</p>
      
                      <br />
                      </div>
                      <div className="col-md-4">
                      <p>{followingCount}</p>
      
                      <p> following</p>
                    </div>
                   
                
                </div>
                </div>
              </div>
              <div className='row mb-4'>
              <div className='col-md-12 d-flex justify-content-center'>

              {isFollower ? (
                <button className="btn btn-outline-custom-secondaire mx-5" onClick={() => RemoveFollowers(username)}>Se désabonner</button>
            ) : isFriend ? (
                <button className="btn btn-outline-custom-secondaire mx-5" onClick={() => CancelFriendShip(username)}>Annuler la demande</button>
            ) : (
                <button className="btn btn-secondaire mx-5" onClick={() => AddFollowers(username)}>S'abonner</button>
            )}
            
    
        

                {isFollowing && isFollower ? (
                  <button
                    className="btn btn-outline-custom-secondaire  me-4"
                    onClick={() => onMessageButtonClick(username)}
                  >
                    Message
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-custom-secondaire  me-5"
                    onClick={() => onMessageButtonClick(username)}
                    disabled
                  >
                    Message
                  </button>
                )}    
                
                

                <button type="button" className="btn btn-primaire  ms-lg-5 mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal2">:</button>
                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel2">Bloquer un utilisateur</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                      <div className="d-flex align-items-center mb-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-danger" style={{ fontSize: '1.5rem' }} />
                        <p className="mb-0">Êtes-vous sûr de vouloir bloquer cet utilisateur ?</p>
                      </div>
                      <p className="mb-3">Une fois bloqué, vous ne pourrez plus voir son profil ni recevoir de notifications de sa part.</p>
                      <div className="alert alert-warning" role="alert">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-warning" style={{ fontSize: '1.5rem' }} />
                        <strong>Remarque :</strong> Le blocage est une action permanente. Pour débloquer un utilisateur, vous devrez le faire manuellement depuis les paramètres de votre compte.
                      </div>
                    </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-secondaire" onClick={() => confirmBlock(user.user._id)}>Confirmer le blocage</button>
                      </div>
                    </div>
                  </div>
                </div>

</div>

                </div>
            </div>
      
  
  
            {isFollower ? (
              <div className=''>
            <div className="row mt-5">
            <div className="col-md-12 mt-3">
            <h4>A propos de toi          </h4>
              <p>{user.profile.bio}</p>
            </div>
          </div>
    
          <div className="row mt-5">
      <div className="col-lg-6 border-end">
     
    {user.profile.additionalImages && user.profile.additionalImages.length > 0 && (
      <div className="row mt-5 ">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              <h4>Images supplémentaires          </h4>
            </div>
      
          </div>
          <div className='row mt-3'>  
            {user.profile.additionalImages.map((image, index) => (
              <div className='col-lg-4 col-md-6 col-6 mt-2 text-center' key={index}>
                <div>
                  <img 
                    src={`http://localhost:5000/images/${image}`} 
                    alt={`Additional ImageProfile ${index}`} 
                    className="img-thumbnail border-0" 
                    style={{  height: '150px', cursor: 'pointer' , objectFit:'cover', borderRadius:'20px' }}
                    onClick={() => openModal(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}  style={{
            content: {
              border: 'none', 
              boxShadow: '0 0 10px rgba(0,0,0,0.3)' ,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }
          }}>
          {modalContent}
        </Modal>
        </div>
      </div>
    )}
    </div>

    <div className="col-lg-6">

    {user.profile.interests && user.profile.interests.length > 0 && (
      <div className="row mt-5">
    
      <div className="col-md-6">
      <h4>Intérêts</h4>
    </div>
   
        <div className="col-md-12 mt-3">
        <div className='row'>  
        <div className="interests-container">
        {user.profile.interests.map((interest, index) => (
          <div className='col-lg-4 col-md-4 text-center mt-5' key={index}>

          <button key={index} className="btn btn-outline-custom-primaire">
            {interest}
          </button>
          </div>
        ))}
      </div>
         
          </div>
        </div>
      </div>
    )}
  
    </div>
    </div>
    </div>
    ) : (
            <div className="row mt-5">
              <div className="col-md-12 text-center">
              <h5>
              <FontAwesomeIcon icon={faLock} style={{ color: '#7447FF' }} /> Ce profil est privé. Vous devez être accepté pour le voir.
            </h5>
            <p className='mt-3'>
              Pour voir ce profil, vous devez envoyer une demande d'invitation à l'utilisateur et attendre qu'il l'accepte.
            </p>
                          </div>
              </div>
            )}  
      
      </div>
            </div>
  );
};

export default PrivateProfileComponent;
