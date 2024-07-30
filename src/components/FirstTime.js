import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import image1 from '../19196943.jpg';
import { useTranslation } from 'react-i18next';
const MAX_IMAGES = 5;
const MIN_IMAGES = 2;


const FirstTime = () => {
  const [formData, setFormData] = useState({
    bio: '',
    interests: '',
    additionalImages: [],
    profileType: 'public',
    city: '',
    birthDate: '',
    username: '',
  });

  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);

  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageFile, setErrorMessageFile] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const cities = [
    'Abu Dhabi', 'Dubai', 'Paris', 'London', 'Marrakech', 'Tunis', 
    'New York', 'Tokyo', 'Sydney'
  ];

  const predefinedInterests = ['Sports', 'Musique', 'Cuisine', 'Voyage', 'Art', 'Technologie', 'Photographie', 'Mode', 'Lecture', 'Jardinage', 'Danse', 'Fitness'];
const interestsOptions = predefinedInterests.map(interest => ({
   value: interest,
   label: t(`first-time.predefined-interests.${interest}`
      
    )
}));

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('http://localhost:5000/users/first-time', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        console.log(response.data);
        if (!response.data.firstTime) {
          const username = response.data.username;
          console.log(username);
          localStorage.removeItem('firstTime');
          window.location.href = `/profile/${username}`;
        }else {

          localStorage.setItem('firstTime',response.data.firstTime)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de first-time :', error);
      }
    };

    checkFirstTime();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'birthDate') {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const dayDifference = today.getDate() - birthDate.getDate();
      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }

      if (age < 15) {
        setErrorMessage('You must be at least 15 years old.');
        return;
      } else {
        setErrorMessage('');
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(() => {


    if (i18n.language) {
        setLanguageInitialized(true);
    }
  }, [i18n.language]);
  
  if (!languageInitialized) {
    return null; 
  }
 /* const handleInterestChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      interests: selectedValues
    });
  };*/

  const handleInterestChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({
      ...formData,
      interests: selectedValues
    });
  };
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length >= MIN_IMAGES && files.length <= MAX_IMAGES) {
      setErrorMessageFile('');
      setFormData({
        ...formData,
        additionalImages: files,
      });
    } else {
      setErrorMessageFile(t('first-time.image-number-error1') + MIN_IMAGES + t('first-time.image-number-error2') + MAX_IMAGES);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('bio', formData.bio);
      for (let i = 0; i < formData.interests.length; i++) {
        formDataToSend.append('interests[]', formData.interests[i]);
      }
            formDataToSend.append('profileType', formData.profileType);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('birthDate', formData.birthDate);
      formDataToSend.append('username', formData.username);
console.log(formDataToSend);
      // Ajouter les fichiers au FormData
      for (let i = 0; i < formData.additionalImages.length; i++) {
        formDataToSend.append('additionalImages', formData.additionalImages[i]);
      }

      const response = await axios.post('http://localhost:5000/profiles/', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Réponse du serveur:', response.data);

      if (response.status === 201) {
        localStorage.setItem('username', response.data.username);

        localStorage.setItem('firstTime', 'false');
        window.location.href = response.data.username ? `/profile/${response.data.username}`: '/';

       // window.location.href='/'
      } else {
        const errorMessage = response.data.error || t('first-time.request-error');
        alert(t('first-time.request-error') + errorMessage);
      }
    } catch (error) {
      toast.error(error.response.data.error)
      console.error(t('first-time.profile-creation-error'), error);
      setErrorMessage(t('first-time.profile-creation-error') + error.response.data.error);
    }
  };

  return (
    <div className='container mt-5 mb-5'>


    <div className='row mt-4 '>
<div className='col-3'>
    

        </div>
        <div className='col-6'>

                <h1 className='text-center text-uppercase'> {t('first-time.personal-info-title')}</h1>
        </div>
        </div>


        <div className='row'>
        <div className='col-lg-8'>
  <form onSubmit={handleFormSubmit} className='mt-5'>

      <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">{t('first-time.username')}:</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleInputChange} required />
          <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} /> {t('first-time.username-info')}</small>

          </div>
        <div className="mb-3">
          <label className="form-label">{t('first-time.profile-type')}:</label>
          <select className="form-select" name="profileType" value={formData.profileType} onChange={handleInputChange} required>
            <option value="public">{t('first-time.profile-type-public')}</option>
            <option value="private">{t('first-time.profile-type-private')}</option>
          </select>
          <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} /> {t('first-time.profile-type-info')}</small>

        </div>
       
      <div className="mb-3">
          <label className="form-label">{t('first-time.bio')}:</label>
          <textarea type="text" className="form-control" name="bio" value={formData.bio} onChange={handleInputChange} required />
          <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} /> {t('first-time.bio-info')}</small>

          </div>

      </div>
      <div className="col-md-6">
   
    
    <div className="mb-3">
          <label className="form-label">{t('first-time.birth-date')}:</label>
          <input type="date" className="form-control" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required />
          <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} /> {t('first-time.birth-date-info')}</small>

          </div>



          <div className="mb-3">
          <label htmlFor="city" className="form-label">{t('first-time.city')}:</label>
          <select 
            id="city" 
            className="form-select" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange} 
            required
          >
            <option value="">{t('first-time.select-city-option')}</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} /> {t('first-time.city-info')}</small>
    
        </div>

      </div>


      <div className="col-md-6">
   
    
      <div className="mb-3">
      <label htmlFor="interests"> {t('first-time.interests')}:</label>
      <Select
        id="interests"
        className="form-select"
        isMulti
        options={interestsOptions}
        onChange={handleInterestChange}
        value={interestsOptions.filter(option => formData.interests.includes(option.value))}
      />
      <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} />  {t('first-time.interests-info')}</small>
  
     </div>
  
        </div>


        
      <div className="col-md-6">
      
      <div className="mb-3">
      <label className="form-label">{t('first-time.additional-images')}:</label>
      <input type="file" className="form-control" name="additionalImages" onChange={handleFileChange} multiple required />
      <small className="form-text text-muted"><FontAwesomeIcon icon={faInfoCircle}  style={{ color: '#7447FF' }} /> {t('first-time.additional-images-info')}</small>

      {errorMessageFile && <div className="text-danger">{errorMessageFile}</div>}
    </div>
        </div>
    </div>
  
 
    <button type="submit" className="btn btn-secondaire mt-4">{t('first-time.save-button')}</button>
    {errorMessage && <p  className="mt-4" style={{ color: 'red' }}>{errorMessage}</p>}

   
  </form>

  </div>

  <div className='col-lg-4 d-flex justify-content-center align-items-center d-none d-lg-flex'>
  <img src={image1} className='img-fluid' alt='FirstTime' />
</div>


  </div>

</div>

  );
};

export default FirstTime;
