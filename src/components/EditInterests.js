import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

const EditInterests = () => {



  const navigate = useNavigate(); 
  const [userInterests, setUserInterests] = useState([]);
  const [predefinedInterests, setPredefinedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('Token not found');
        }

        const userResponse = await axios.get('http://localhost:5000/profiles/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userInterestsData = userResponse.data;
        setUserInterests(userInterestsData);

        const predefinedInterests = ['Sports', 'Musique', 'Cuisine', 'Voyage', 'Art', 'Technologie', 'Photographie', 'Mode', 'Lecture', 'Jardinage', 'Danse', 'Fitness'];
        const filteredPredefinedInterests = predefinedInterests.filter(interest => !userInterestsData.includes(interest));
        setPredefinedInterests(filteredPredefinedInterests);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('userInterests', JSON.stringify(userInterests));
    localStorage.setItem('predefinedInterests', JSON.stringify(predefinedInterests));
  }, [userInterests, predefinedInterests]);

  const handleRemoveInterest = async (interest) => {
    const updatedInterests = userInterests.filter(item => item !== interest);
    setUserInterests(updatedInterests);
    setPredefinedInterests([...predefinedInterests, interest]);
  };

  const handleAddInterest = async (interest) => {
    if (!userInterests.includes(interest)) {
      setUserInterests([...userInterests, interest]);
      const updatedPredefinedInterests = predefinedInterests.filter(item => item !== interest);
      setPredefinedInterests(updatedPredefinedInterests);
    }
  };

  const handleSaveInterests = async () => {
    try {
      if (userInterests.length < 3) {
        setErrorMessage('Please select at least 3 interests.');
        toast.error('Please select at least 3 interests.');
        return;
      } else {
        setErrorMessage('');
      }

     

      if (!token) {
        throw new Error('Token not found');
      }
      await axios.put('http://localhost:5000/profiles/updateUserInterests', { interests: userInterests }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
toast.success('Profil mis à jour avec succès');
      localStorage.removeItem('userInterests');
      localStorage.removeItem('predefinedInterests');


      setTimeout(() => {
        navigate(`/profile/${username}`, { state: { successMessage: 'Profil mis à jour avec succès' } });
      }, 2500);

    } catch (error) {
      console.error('Error updating user interests:', error);
      toast.error('Error updating user interests');

    }


  };

  const handleCancel = () => {
    window.history.back();
  };
  

  return (
    <div className='container mt-5 mb-5'>
    {/* <ToastContainer /> */}
    <div className='row mt-4 '>
<div className='col-3'>
    

<Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
  <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> Retour
</Link>


        </div>
        <div className='col-6'>

                <h1 className='text-center text-uppercase'>My Events</h1>
        </div>
        </div>
      <div className='row mt-3'>
        <div className='col-lg-6  border-lg-end border-bottom '>
          <div className='row mt-3 mb-4'>
          <h4 className='text-center'>Vos centres d'intérêt</h4>
          {userInterests.map((interest, index) => (
              <div className='col-lg-3 col-4  mt-3'>
              <div key={index}>
                <p>{interest}</p>
                <Button variant="outline-danger" onClick={() => handleRemoveInterest(interest)}>Remove</Button>
              </div>
              </div>
            ))}
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='row mt-3'>
          <h4 className='text-center'>Centres d'intérêt prédéfinis</h4>

          {loading ? (
              <p>Loading...</p>
            ) : (
              predefinedInterests.map((interest, index) => (
                <div className='col-lg-3 col-4 mt-3'>

                <div key={index}>
                  <p>{interest}</p>
                  <Button variant="outline-custom-primaire" onClick={() => handleAddInterest(interest)}>Add</Button>
                </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Button variant="success" className='btn btn-secondaire mt-5' onClick={handleSaveInterests}>Enregistrer</Button>
      <Button variant="danger" className='btn btn-primaire mt-5 mx-5' onClick={handleCancel}>Annuler</Button>
        </div>
  );
};

export default EditInterests;
