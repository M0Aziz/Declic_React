import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faExclamationCircle, faSearch, faArrowLeft, faExclamationTriangle, faCheckCircle, faUsers, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import image1 from '../9571047.jpg';
import { Modal } from 'react-bootstrap';

function SearchResultComponent({ match }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { keyword } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/search/${keyword}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        setUsers(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [keyword]);

  return (
    <div className='container mb-5'>

    <div className='row mt-5 '>
<div className='col-3'>


<Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
  <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> Retour
</Link>


        </div>
        <div className='col-6'>

                <h1 className='text-center text-uppercase'> Recherche d'utilisateurs</h1>
        </div>
        </div>



        <p className='mt-3 mb-3 fw-bold'>Nombre de résultats : {users.length}</p>
        {loading ? (
        <div className="text-center mt-5">
        <img src={image1} className='img-fluid' alt='image124' width='300px'/>

        
          <p>    <FontAwesomeIcon icon={faExclamationCircle} size="2x" className='mx-2 mt-2' color="gris" /> Une erreur s'est produite lors de la recherche.</p>
        </div>
      ) : users.length > 0 ? (
        <div>
          {users.map(user => (
            <div key={user._id} className="row mt-4">
                <div className='col-2 mt-2'>

              <img src={`http://localhost:5000/images/${user.profilePicture}`}  className='img-fluid ' style={{borderRadius:'50%', cursor:'pointer'}} alt="Profile"
              onClick={() => handleImageClick(`http://localhost:5000/images/${user.profilePicture}`)}

              
              />
              </div>
              <div className='col-8 mt-3'>
              <Link to={`/profile/${user.username}`}  style={{ textDecoration: 'none', color: 'inherit' }}>
                <h5>{user.firstName} {user.lastName}</h5>
                <p>@{user.username}</p>
                </Link>
                {user.commonFriendsCount > 0 ? (
                    <p  >                   <FontAwesomeIcon icon={faUsers} style={{color:'#7447FF'}} className='me-2' />
                    Vous avez {user.commonFriendsCount} amis en commun</p>
                  ) : (
                    <p>                     <FontAwesomeIcon icon={faTimesCircle} style={{color:'#7447FF'}} className='me-2' />
                    Vous n'avez pas d'amis en commun</p>
                  )}
               
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">

        <img src={image1} className='img-fluid' alt='image124' width='300px'/>
        <p className="mt-3 mb-2">
        <FontAwesomeIcon icon={faUser} style={{color:'#7447FF'}} /> Aucun utilisateur trouvé pour <span className='fw-bold'>"{keyword}"</span>
      </p>
      <p className="text-muted">
        <FontAwesomeIcon icon={faSearch} style={{color:'#7447FF'}} /> Désolé, nous n'avons trouvé aucun utilisateur correspondant à votre recherche.
      </p>
      <p className="text-muted">
        <FontAwesomeIcon icon={faCheckCircle}  style={{color:'#7447FF'}}/> Essayez de vérifier l'orthographe ou d'utiliser des mots-clés différents.
      </p>
      <p className="text-muted">
        <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'#7447FF'}} /> Vous pouvez également étendre votre recherche en incluant le prénom et le nom de famille.
      </p>
      <p className="text-muted">
        <FontAwesomeIcon icon={faCheckCircle} style={{color:'#7447FF'}} /> Pourquoi ne pas <span className="text-primary">explorer d'autres fonctionnalités</span> pendant que vous êtes ici ?
      </p> 
      
      </div>
      )}


      <Modal show={showModal} onHide={handleCloseModal} >
      <Modal.Header closeButton>
        <Modal.Title>Aperçu de l'image</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center' >
        <img src={selectedImage} className="img-fluid m-4" alt="Image" width='50%' />
      </Modal.Body>
    </Modal>
    </div>
  );
}

export default SearchResultComponent;
