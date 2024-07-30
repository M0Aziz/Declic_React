import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';


const EditProfile = () => {
  const navigate = useNavigate(); 

  const [userData, setUserData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewNewProfilePicture, setPreviewNewProfilePicture] = useState(null); 
  const [errors, setErrors] = useState({});


  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const cities = [
    { label: "Abu Dhabi", value: "Abu Dhabi" },
    { label: "Dubai", value: "Dubai" },
    { label: "Paris", value: "Paris" },
    { label: "London", value: "London" },
    { label: "Marrakech", value: "Marrakech" },
    { label: "Tunis", value: "Tunis" },
    { label: "New York", value: "New York" },
    { label: "Tokyo", value: "Tokyo" },
    { label: "Sydney", value: "Sydney" },
    { label: "Berlin", value: "Berlin" },
    { label: "Rome", value: "Rome" },
    { label: "Moscow", value: "Moscow" },
    { label: "Hong Kong", value: "Hong Kong" },
    { label: "Bangkok", value: "Bangkok" },
    { label: "Barcelona", value: "Barcelona" },
    { label: "Los Angeles", value: "Los Angeles" },
    { label: "Toronto", value: "Toronto" },
    { label: "Cairo", value: "Cairo" },
    { label: "Rio de Janeiro", value: "Rio de Janeiro" },
    { label: "Amsterdam", value: "Amsterdam" },
  ];
  


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://localhost:5000/users/User`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUserData(response.data);
        setInitialData(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage('Erreur lors de la récupération des informations de l\'utilisateur');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'lastName') {
      setUserData(prevUserData => ({
        ...prevUserData,
        user: {
          ...prevUserData.user,
          [name]: value
        }
      }));
    } else {
      setUserData(prevUserData => ({
        ...prevUserData,
        profile: {
          ...prevUserData.profile,
          [name]: value
        }
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setUserData(prevUserData => ({
      ...prevUserData,
      profilePicture: file
    }));
  


  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewNewProfilePicture(reader.result);
  };
  reader.readAsDataURL(file);
};

const handleCancelNewProfilePicture = () => {
  setUserData(prevUserData => ({
    ...prevUserData,
    profilePicture: null
  }));
  setPreviewNewProfilePicture(null);
};


  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!userData.user.firstName) {
      newErrors.firstName = true;
    }
    if (!userData.user.lastName) {
      newErrors.lastName = true;
    }

    if (!userData.profile.bio) {
      newErrors.bio = true;
    }
    if (!userData.profile.profileType) {
      newErrors.profileType = true;
    }

    if (!    userData.profile.birthDate    ) {
      newErrors.birthday = true;
    }

 
    // Mettre à jour les erreurs
    setErrors(newErrors);


    if (!userData.user.firstName || !userData.user.lastName || !userData.profile.bio || !userData.profile.profileType || !userData.profile.city || !userData.profile.birthDate ) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }



    if (
      userData.user.firstName === initialData.user.firstName &&
      userData.user.lastName === initialData.user.lastName &&
      userData.profile.bio === initialData.profile.bio &&
      userData.profile.profileType === initialData.profile.profileType &&
      userData.profile.city === initialData.profile.city &&
      userData.profile.birthDate === initialData.profile.birthDate &&
      userData.profilePicture === initialData.profilePicture
    ) {
      console.log(userData.user.lastName === initialData.user.lastName)
      // Afficher un message d'info avec toast.info
      toast.info('Aucun changement détecté.');
      return;
    }


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const formData = new FormData();
      formData.append('bio', userData.profile.bio);
      formData.append('profileType', userData.profile.profileType);
      formData.append('city', userData.profile.city);
      formData.append('birthDate', userData.profile.birthDate);
      formData.append('firstName', userData.user.firstName);
      formData.append('lastName', userData.user.lastName);
      formData.append('profilePicture', userData.profilePicture);

      const response = await axios.put('http://localhost:5000/profiles/User', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profil mis à jour avec succès:', response.data);
      toast.success('Profil mis à jour avec succès');

      setTimeout(() => {
        navigate(`/profile/${userData.profile.username}`, { state: { successMessage: 'Profil mis à jour avec succès' } });
      }, 2500);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      setErrorMessage('Erreur lors de la mise à jour du profil');
    }
  };

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  if (errorMessage) {
    return <p>Erreur : {errorMessage}</p>;
  }

  const formattedDate = new Date(userData.profile.birthDate).toISOString().split('T')[0];

  const handleCancel = () => {
    window.history.back();
  };



  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmitChangePassword = async () => {

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Tous les champs sont obligatoires.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/users/update-password', passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
toast.success(response.data.message);
      setShowChangePassword(false);
    } catch (error) {
      setPasswordError(error.response.data.message);
    }
  };
  return (
    <div className='container mb-5'>
{/* <ToastContainer /> */}
    <div className='row mt-5 '>
<div className='col-3'>
    

<Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
  <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> Retour
</Link>


        </div>
        <div className='col-6'>

                <h1 className='text-center text-uppercase'>Modifier votre profil</h1>
        </div>
        </div>
      <form onSubmit={handleEditProfileSubmit} className='mt-5'>
        <div className='row'>
        <div className='col-md-4'></div>
        <div className="col-md-4 text-center">
          


        <div className="mb-3">
        <input type="file" className="form-control" name="profilePicture" onChange={handleFileChange} accept="image/jpeg, image/png" style={{ display: 'none' }} />
        {previewNewProfilePicture && (
          <div>
            <img src={previewNewProfilePicture} alt="New Profile Preview" style={{ marginTop: '10px', maxWidth: '100px', cursor: 'pointer' }} />
            <button type="button" className="btn btn-danger" onClick={handleCancelNewProfilePicture}>X</button>
          </div>
        )}

      
        {userData.user.profilePicture.startsWith('https://') && !previewNewProfilePicture ? (
          <div>

          <img src={userData.user.profilePicture} alt="Profile Preview" style={{ marginTop: '10px', maxWidth: '100px', cursor: 'pointer' }} onClick={() => document.querySelector('input[name="profilePicture"]').click()} />
    </div>
          ) : (
        <div>

          <img src={`http://localhost:5000/images/${userData.user.profilePicture}`} alt="Profile Preview" style={{ marginTop: '10px', maxWidth: '100px', cursor: 'pointer' }} onClick={() => document.querySelector('input[name="profilePicture"]').click()} />
         </div>
          )}

      </div>
          </div>
        </div>
        <div className={`row mt-5 ${errors.firstName && 'has-error'}`}>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Prénom:</label>
              <input type="text"                 className={`form-control ${errors.firstName && 'is-invalid'}`}
              name="firstName" value={userData.user.firstName} onChange={handleInputChange}  />
              {errors.firstName && <div className="invalid-feedback">Ce champ est requis.</div>}

            </div>
          </div>
         

          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Nom de famille: </label>
              <input type="text"                 className={`form-control ${errors.lastName && 'is-invalid'}`}
              name="lastName" value={userData.user.lastName} onChange={handleInputChange} required />
              {errors.lastName && <div className="invalid-feedback">Ce champ est requis.</div>}

            </div>
          </div>


          <div className="col-md-4">
          <div className="mb-3">
          <label className="form-label">Changer votre mot de passe: </label>

          <a className="btn btn-outline-custom-secondaire" onClick={() => setShowChangePassword(true)}>
          Changer votre mot de passe
        </a>
          </div>
        </div>

        </div>

        <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Changer le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {passwordError && <div className="alert alert-danger">{passwordError}</div>}

          <div className="mb-3">
            <label className="form-label">Ancien mot de passe:</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nouveau mot de passe:</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmer le nouveau mot de passe:</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangePassword(false)}>
            Annuler
          </Button>
          <Button className='btn-secondaire' onClick={handleSubmitChangePassword}>
            Changer le mot de passe
          </Button>
        </Modal.Footer>
      </Modal>




        <div className='row mt-5 '>
        <div className="col-md-4">
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input className="form-control" name="email" value={userData.user.email} required readOnly/>
          <span className='mt-2 text-muted'><FontAwesomeIcon style={{color:'#7447FF'}} icon={faInfoCircle}/> L'adresse e-mail associée à votre compte, vous ne pouvez pas la modifier </span>
        </div>
      </div>

      <div className="col-md-4">
      <div className="mb-3">
        <label className="form-label">Nom d'utilisateur :</label>
        <input className="form-control" name="email" value={userData.profile.username} required readOnly/>
        <span className='mt-2 text-muted'><FontAwesomeIcon style={{color:'#7447FF'}} icon={faInfoCircle}/> Le nom d'utilisateur associée à votre compte, vous ne pouvez pas la modifier </span>

      </div>
    </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Biographie :</label>
              <textarea className={`form-control ${errors.bio && 'is-invalid'}`} name="bio" value={userData.profile.bio} onChange={handleInputChange} required />
              {errors.bio && <div className="invalid-feedback">Ce champ est requis.</div>}

              </div>
          </div>
        </div>
        <div className="row mt-5">
        <div className="col-md-4 ">
        <div className="mb-3">
          <label className="form-label">Type de profil :</label>
          <select  className={`form-select ${errors.profileType && 'is-invalid'}`} name="profileType" value={userData.profile.profileType} onChange={handleInputChange} required>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
                        {errors.profileType && <div className="invalid-feedback">Ce champ est requis.</div>}

        </div>
        </div>
        <div className="col-md-4 ">

        <div className="mb-3">
          <label className="form-label">Ville :</label>
          <Select
            options={cities}
            value={cities.find(city => city.label === userData.profile.city)}
            onChange={(selectedOption) => handleInputChange({ target: { name: 'city', value: selectedOption.label } })}
            placeholder="Select city..."
            isSearchable
            filterOption={({ label, value }, searchString) =>
              label.toLowerCase().includes(searchString.toLowerCase())
            }
            required
          />
          </div>
          </div>
          <div className="col-md-4 ">

          <div className="mb-3">
          <label className="form-label">Date de naissance :</label>
          <input type="date" className={`form-control ${errors.birthday && 'is-invalid'}`} name="birthDate" value={formattedDate} onChange={handleInputChange} required />
          {errors.birthday && <div className="invalid-feedback">Ce champ est requis.</div>}

          </div>
</div>
        </div>
       
        <button type="submit" className="btn btn-secondaire mt-5">Soumettre</button>

        <button variant="danger" className='btn btn-primaire mt-5 mx-5' onClick={handleCancel}>Annuler</button>

      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
  
};

export default EditProfile;
