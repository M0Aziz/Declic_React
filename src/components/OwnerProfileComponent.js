// OwnerProfileComponent.js

import React, {useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCopy, faDownload, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

import QRCode from 'qrcode.react';
import { toPng } from 'html-to-image';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerProfileComponent = ({ user, followersCount, followingCount, userId, username }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
const [modalIsOpen, setModalIsOpen] = useState(false);
const openModal = (index) => {
  setSelectedImageIndex(index);
  setModalIsOpen(true);
};


const [profileUrl, setProfileUrl] = useState(window.location.href);
const [buttonText, setButtonText] = useState('Copy Link');
const qrCodeRef = useRef(null);
const [blockList, setBlockList] = useState([]);



const fetchBlockedList = async () => {
  try {
    const response = await axios.get('http://localhost:5000/users/Block', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('Blocked Users:', response.data);

    setBlockList(response.data.blockedUsers);
  } catch (error) {
    console.error('Error fetching blocked users:', error);
  }
};

useEffect(() => {
  

  fetchBlockedList();
}, []);



const unblockUser = async (userId) => {
  try {
    await axios.put(`http://localhost:5000/users/unblock/${userId}`,{}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const message = 'L\'utilisateur a été débloqué avec succès !';
    fetchBlockedList();

    toast.success(message);

  console.log(blockList);
  if (blockList.length === 0) {
    window.location.reload();
  }
  
  } catch (error) {

    console.error('Error unblocking user:', error);
  }
};
const handleCopyLink = () => {
  navigator.clipboard.writeText(profileUrl)
    .then(() => {
      console.log('Profile link copied to clipboard');
      setButtonText('Link Copied'); 
    })
    .catch((error) => {
      console.error('Error copying profile link to clipboard:', error);
    });
};


const handleDownloadQRCode = () => {
  toPng(qrCodeRef.current)
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'qr_code.png';
      link.href = dataUrl;
      link.click();
    })
    .catch((error) => {
      console.error('Error downloading QR code:', error);
    });
};

const modalContent = (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
    {selectedImageIndex !== null && (
      <div>
        <button className='btn btn-primaire me-4' onClick={() => setSelectedImageIndex(prevIndex => prevIndex === 0 ? user.profile.additionalImages.length - 1 : prevIndex - 1)}>            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <img 
          src={`http://localhost:5000/images/${user.profile.additionalImages[selectedImageIndex]}`} 
          alt={`Additional Image ${selectedImageIndex}`} 
          style={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain' }}
          className='mt-3 img-fluid'
        />
        <button className='btn btn-primaire ms-4' onClick={() => setSelectedImageIndex(prevIndex => (prevIndex + 1) % user.profile.additionalImages.length)}>            <FontAwesomeIcon icon={faArrowRight} />
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
                  <img src={user.user.profilePicture} className="img-fluid rounded-circle" alt="Photo de profil"   style={{  height: '180px',  objectFit:'cover', borderRadius:'20px' }}
                  />
              ) : (
                  <img src={`http://localhost:5000/images/${user.user.profilePicture}`} className="img-fluid rounded-circle" alt="Photo de profil" style={{  height: '180px',  objectFit:'cover', borderRadius:'20px' }} />
              )}
                                </div>
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
              <div className="col-md-4">
      
            </div> 
              <div className="col-md-6 text-center d-flex">
              <Link to={`/${user.profile.username}/edit`}>
      
                  <button className="btn btn-outline-custom-secondaire">Modifier votre profil</button>
                  </Link>

<button type="button" class="btn btn-outline-custom-secondaire mx-lg-5 mx-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Partage votre profile
</button>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Profile</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
            <div className="mb-3"  ref={qrCodeRef}>
              <QRCode value={profileUrl} size={200} 
              fgColor= "#7348f5"
              />
            </div>
            <div className="mb-3">
            <p className='text-uppercase fw-bold'>@{username}</p>
              <p className='mt-4'>Profile Link</p>
              <input type="text" style={{display:'none'}} className="form-control" value={profileUrl} readOnly />
              <button className="btn btn-secondaire mt-2" onClick={handleCopyLink} > <FontAwesomeIcon icon={faCopy} className="me-2" />{buttonText}</button>
              <button className="btn btn-secondaire mt-2 ms-2" onClick={handleDownloadQRCode}>  <FontAwesomeIcon icon={faDownload} className="me-2" />Download QR Code</button>
            </div>
          </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primaire" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>




<button type="button" class="btn btn-secondaire " title='Blocked Users' data-bs-toggle="modal" data-bs-target="#exampleModal2">
:
</button>

<div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel2">Blocked Users</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      {blockList && blockList.length === 0 ? (
        <div className="text-center">
        <p><FontAwesomeIcon icon={faInfoCircle} style={{color:'#7447FF'}} className="me-2" /> Vous n'avez actuellement aucun utilisateur bloqué.</p>
        <p>Vous pouvez bloquer des utilisateurs pour restreindre leur accès à votre profil.</p>
      </div>
            ) : (
              <ul className="list-group">
              {blockList && blockList.map((user, index) => (
                <li key={index} className="list-group-item d-flex align-items-center justify-content-between">
                <div onClick={() => { window.location.href = `/profile/${user.username}` }} style={{cursor:'pointer'}} > 
                  <div className="d-flex align-items-center">
                    <img src={`http://localhost:5000/images/${user.profilePicture}`} alt="Profile" className="me-3" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <div>
                      <p className="mb-0">{user.name}</p>
                      <p className="mb-0 text-muted">@{user.username}</p>
                    </div>
                  </div>
                  </div>

                  <button className="btn btn-danger" onClick={() => unblockUser(user._id)} >Retirer</button>
                </li>
              ))}
            </ul>
      )}
      
          </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primaire" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

                </div>
                </div>
            </div>
      
            <div className="row mt-5">
              <div className="col-md-12 mt-3">
                <h4>A propos de toi          </h4>
                <p>{user.profile.bio}</p>
              </div>
            </div>
      
            <div className="row mt-5">
        <div className="col-md-12">
       <div className='row'>
       <div className="col-lg-6  border-end">
             {user.profile.additionalImages && user.profile.additionalImages.length > 0 && (
        <div className="row mt-5 " >
          <div className="col-md-12" id='bloc1'>
            <div className="row" >
              <div className="col-md-6">
                <h4>Images supplémentaires          </h4>
              </div>
              <div className="col-md-6 text-end">
      
      <Link to="/edit-images" className='text-end' id='modif1'>
        <button className="btn btn-outline-custom-secondaire " >Modifier</button>
      </Link>
              </div>
            </div>
            <div className='row mt-3' >  
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
      <div className="col-lg-6 ">

      {user.profile.interests && user.profile.interests.length > 0 && (
        <div className="row mt-5" id='bloc2'>
      
        <div className="col-md-6">
        <h4>Intérêts</h4>
      </div>
      <div className="col-md-6 text-end">
      
      <Link to="/edit-interests" id='modif2'>
      <button className="btn btn-outline-custom-secondaire">Modifier</button>
      </Link>
      </div>
          <div className="col-12 mt-3">
          <div className='row'>  
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
      )}
      </div>

      </div>
        </div>
      </div>
      
      </div>
            </div>
  );
};

export default OwnerProfileComponent;
