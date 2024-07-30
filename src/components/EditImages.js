import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import './EditImages.css';
import { ToastContainer, toast } from 'react-toastify';
const EditImages = () => {



  const navigate = useNavigate(); 

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalImages, setTotalImages] = useState(0);
  const fileInputRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await axios.get('http://localhost:5000/profiles/getUserImages', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setImages(response.data);
        setTotalImages(response.data.length);
        console.log('Images fetched:', response.data.length);
      } catch (error) {
        setErrorMessage('Erreur lors de la récupération des images');
        console.error('Error fetching images:', errorMessage);
      }
    };

    fetchImages();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    console.log('New images selected:', files);
  };

  const handleRemoveImage = (index) => {
    const confirmation = window.confirm('Voulez-vous vraiment supprimer cette image ?');
    if (confirmation) {
      const removedImage = images[index];
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      setRemovedImages([...removedImages, removedImage]);
      setTotalImages((prevTotalImages) => prevTotalImages - 1); 

      console.log('Image removed at index', index);
    }
  };

  const handleRemoveNewImage = (index) => {
    const confirmation = window.confirm('Voulez-vous vraiment supprimer cette image ?');
    if (confirmation) {
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(index, 1); 
      setNewImages(updatedNewImages); 
      fileInputRef.current.value = null; 
    }
  };

  const handleSubmit = async () => {
    let totalImages = images.length + newImages.length;
    console.log('Total images:', totalImages);

    if (totalImages > 5) {
        setAlertMessage('Le nombre d\'images doit être compris entre 2 et 5.');
        toast.error('Le nombre d\'images doit être compris entre 2 et 5.')
        setShowAlert(true);
        return;
    }

    try {
      const formData = new FormData();
      newImages.forEach((image) => {
        formData.append('additionalImages', image);
      });
      removedImages.forEach((image) => {
        formData.append('removedImages', image);
      });

      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token) {
        throw new Error('Token not found');
      }
      await axios.put('http://localhost:5000/profiles/UserImages', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setAlertMessage('Images mises à jour avec succès.');
      toast.success('Images mises à jour avec succès..')


      setTimeout(() => {
        navigate(`/profile/${username}`, { state: { successMessage: 'Profil mis à jour avec succès' } });
      }, 2500);

    } catch (error) {
      setAlertMessage('Erreur lors de la mise à jour des images.');
      setShowAlert(true);
      console.error('Error updating images:', error);
    }
  };


  const handleCancel = () => {
    window.history.back();
  };
  return (
    <div className="container mt-5 mb-5">
    {/* <ToastContainer /> */}
    <div className='row mt-4 '>
    <div className='col-3'>
        
    
    <Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
      <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> Retour
    </Link>
    
    
            </div>
            <div className='col-6'>
    
                    <h1 className='text-center text-uppercase'>Modifier les images</h1>
            </div>
            </div>   
            
            
            {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
      <div className="row mt-5">
        {images.map((image, index) => (
          <div key={index} className="col-lg-2 col-md-2 col-4 mt-4 text-center">
          <div className="position-relative">

            <img src={`http://localhost:5000/images/${image}`} alt={`ImageProfile ${index}`} className="img-fluid p-2" style={{  height: '250px',
            borderRadius: '20px', objectFit:'cover' }} />
            <FontAwesomeIcon
            icon={faTrash}
            className="delete-icon"
            onClick={() => handleRemoveImage(index)}
          />
                </div>    </div>  
        ))}
      </div>
      {newImages.length > 0 && (
        <div className="row mt-5">
        <hr></hr>
          <h4 className='mb-3'>Nouvelles images :</h4>
          {newImages.map((image, index) => (
            <div key={index} className="col-md-2 mt-3">
            <div className="position-relative">

              <img src={URL.createObjectURL(image)} alt={`New ImageProfile ${index}`} className="img-fluid " style={{  height: '250px',
              borderRadius: '20px', objectFit:'cover' }}  />
              <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() =>handleRemoveNewImage(index)}
            />
          </div>  </div>
          ))}
        </div>
      )}
<hr className='mt-4 mb-4'></hr>
<h4>Choisir de Nouvelles images</h4>
      <div className='row'>
      <div className='col-md-4 mt-4'>
      <input ref={fileInputRef} type="file" className="form-control" accept="image/*" onChange={handleImageChange} multiple />

      </div>
      </div>
      <br></br>
      <button onClick={handleSubmit} className='btn btn-secondaire mt-5' disabled={totalImages >= 5}>Soumettre</button>
      <button variant="danger" className='btn btn-primaire mt-5 mx-5' onClick={handleCancel}>Annuler</button>

    </div>
  );
};

export default EditImages;
