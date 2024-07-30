import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image1 from '../2103.i602.003.S.m009.c12.selfie friend flat.jpg';
import Image2 from '../5640207.jpg';
import Image3 from '../7270445.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUsers, faCalendarAlt, faComments, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram,faApple, faAndroid, faTiktok  } from '@fortawesome/free-brands-svg-icons';

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Modal from 'react-modal';
import Logo from '../télécharger.png'
import { faCalendar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import image1 from '../7270445.jpg';
import UpImage from '../Image1Modifier.jpg';

import Avatar from '../avatar.png'
import Google from '../google.png';
import App from '../app.png';
import Event from '../event.avif'
import Attractive from '../Group Chat-amico.png';
import inscription from '../3527178.jpg'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Music from '../music.jpg';
import Technologie from '../technologie.jpg';
import Dance from '../dance.jpg';
import Art from '../art.jpg';
import Lecture from '../lecture.jpg';
import Sports from '../sport.jpg'
const Home = () => {
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('token');
  const [isVisible, setIsVisible] = useState(false);
  const [guestEvents, setGuestEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);


  const categories = [
    { label: "Musique", name:t('home.musique'), value: Music },
    { label: "Technologie", name:t('home.Technologie'), value: Technologie },
    { label: "Danse", value: Dance },
    { label: "Art", value: Art },
    { label: "Lecture", value: Lecture },
    { label: "Sports", value: Sports }
  ];
  
  const getRandomCategories = () => {
    const shuffledCategories = categories.sort(() => 0.5 - Math.random());
    return shuffledCategories.slice(0, 3);
  };
  
  const [randomCategories, setRandomCategories] = useState([]);
  
  useEffect(() => {
    setRandomCategories(getRandomCategories());
  }, []);
  

  const fetchGuestEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/activitys/home/guest');
      setGuestEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements pour les invités:', error);
    }
  };



  const fetchUserEvents = async () => {
    if (isAuthenticated){
    try {
      const response = await axios.get('http://localhost:5000/activitys/home/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserEvents(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements pour les utilisateurs connectés:', error);
    }
    }
  };
  
  const toggleVisibility = () => {
    if (window.pageYOffset > 1500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {

    fetchGuestEvents();
    fetchUserEvents();
    const isFirstVisit = localStorage.getItem('isFirstVisit');
    if (!isFirstVisit) {
      setIsOpen(true);
      localStorage.setItem('isFirstVisit', 'false');
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  useEffect(() => {


    if (i18n.language) {
        setLanguageInitialized(true);
    }
  }, [i18n.language]);
  
  if (!languageInitialized) {
    return null; 
  }


  

  const calculateRemainingTime = (unsubscribeDeadline) => {
    const currentTime = new Date();
    const deadlineTime = new Date(unsubscribeDeadline);
    const difference = deadlineTime - currentTime;
  
    if (difference <= 0) {

      return "Expired";
    }
  
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    return `${days}j ${hours}h ${minutes}min ${seconds}s`;
  };

  // Fonction pour faire défiler la page vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };





  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div>
    {isVisible && (
      <button className='button-Up' onClick={scrollToTop} >
        <div className="arrow-up" ></div>
      </button>
    )}

    <div className="container mb-5">
      <div className="row mt-5">
        <div className="col-lg-6">
          <h1 className='mt-5'>{t('home.declicSection.heading')}          </h1>
          <h3 className='mt-5' style={{ textAlign: 'justify', fontWeight: 'normal', lineHeight: '1.5' }}>

          {t('home.declicSection.subheading')}  
</h3>
        <div className='mt-4'>
          <a><FontAwesomeIcon icon={faFacebook} size='2x' style={{ color: '#7447FF' }} /></a>
          <a><FontAwesomeIcon icon={faLinkedin} className='mx-4' size='2x' style={{ color: '#7447FF' }}  /></a>
          <a><FontAwesomeIcon icon={faInstagram} size='2x' style={{ color: '#7447FF' }}  /></a>
          <a><FontAwesomeIcon icon={faTiktok} size='2x mx-4' style={{ color: '#7447FF' }}  /></a>

          </div>

          <a href="#section-bas" className="btn btn-secondaire mt-4">
          {t('home.welcome-title')} 
          <FontAwesomeIcon icon={faArrowDown} className='ms-2' />
        </a>
        

                </div>
        <div className="col-lg-6">
          <img src={UpImage} alt="Image" className='img-fluid mt-4' />
        </div>
      </div>


      <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={{
        content: {
          border: 'none', 
          boxShadow: '0 0 10px rgba(0,0,0,0.3)' ,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center' 
        }
      }}
      contentLabel="Welcome Modal"
    >

    <img src={Logo} className='img-fluid' width={'200px'}></img>
    <h1 className='mt-4'>  {t('home.welcome-message')}</h1>
    <p>{t('home.welcome-description')}</p>
    <p className='mt-4'>{t('home.mobile-app-description')}</p>
    <div className='mt-2'>
      <button className='btn btn-outline-custom-secondaire mx-2'><FontAwesomeIcon icon={faApple} /> {t('home.download-on-appstore')}</button>
      <button className='btn btn-outline-custom-primaire mx-2'><FontAwesomeIcon icon={faAndroid} /> {t('home.download-on-googleplay')}</button>
    </div>
      <button onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '30px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#333' }}>        <FontAwesomeIcon icon={faTimes} />
      </button>
    </Modal>
        

      <div id="section-bas">
      <div className="row mt-5 mb-4">
      <div className="col-lg-4">
      <div className="card border-0 shadow" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
      <div className="card-body text-center">
            <FontAwesomeIcon icon={faUsers} size="3x" style={{color:'#0C134F'}} />
            <h4  style={{color: '#0C134F'}} className="mt-4">{t('home.bottomSection.card1Title')}</h4>
            <p > {t('home.bottomSection.card1Description')}</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
      <div className="card border-0 shadow" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
      <div className="card-body text-center">
            <FontAwesomeIcon icon={faCalendarAlt} size="3x" style={{color:'#0C134F'}} />
            <h4 style={{color: '#0C134F'}} className="mt-4">{t('home.bottomSection.card2Title')}</h4>
            <p>{t('home.bottomSection.card2Description')}</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
      <div className="card border-0 shadow" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
      <div className="card-body text-center">
            <FontAwesomeIcon icon={faComments} size="3x" style={{color:'#0C134F'}} />
            <h4 style={{color: '#0C134F'}} className="mt-4">{t('home.bottomSection.card3Title')}</h4>
            <p>{t('home.bottomSection.card3Description')}</p>
          </div>
        </div>
      </div>
    </div>
    </div>

    {!isAuthenticated && guestEvents && (
<div>
    <div className="row mt-5">
    <div className="col-lg-12">
      <h2 className='mt-5 text-center fw-bold'>  {t('home.upcoming-events-heading')}</h2>
    </div>
  </div>
  <div className="row mt-5">

  {guestEvents && guestEvents.map(guestEvent => (
    <div className="col-lg-4">

    
    <div className="card border-0 shadow mb-3 h-100" style={{boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
    <img src={`http://localhost:5000/images/${guestEvent.image}`} className="card-img-top aspect-ratio" alt="Event" />
    <div className="card-body">
    <p className="text-muted text-end">{new Date(guestEvent.date).toLocaleDateString()} - Créé le {new Date(guestEvent.date).toLocaleTimeString()}</p>

    <Link   onClick={handleLinkClick} to={`/event/${guestEvent._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <h5 className="card-title mt-3">{guestEvent.name}</h5>
  </Link>
          

  <p className="card-text mt-3">
            <FontAwesomeIcon icon={faCalendar} className=' me-2' style={{ color: '#7447FF' }} />
            {new Date(guestEvent.dateStart).getDate()} {new Date(guestEvent.dateStart).toLocaleString('default',  { month: 'short' })} {new Date(guestEvent.dateStart).getFullYear().toString().substr(-2)} - 
            {new Date(guestEvent.dateEnd).getDate()} {new Date(guestEvent.dateEnd).toLocaleString('default', { month: 'short' })} {new Date(guestEvent.dateEnd).getFullYear().toString().substr(-2)}

            <FontAwesomeIcon icon={faMapMarkerAlt} className='ms-4 me-2' style={{ color: '#7447FF' }} />
            {guestEvent.city}
          </p>


          <p className="card-text">
          {t('home.unsubscribe-deadline')} : {calculateRemainingTime(guestEvent.unsubscribeDeadline)}

        </p>
        {guestEvent.price > 0 ? (
          <span className="badge bg-primary rounded-pill position-absolute top-0 end-0 me-3 mt-3">
            {guestEvent.price} {guestEvent.currency}
          </span>
        ) : (
          <span className="badge bg-success rounded-pill position-absolute top-0 end-0 me-3 mt-3">
             {t('home.free')}
          </span>
        )}


      
        
        </div>
        <div className="card-footer align-items-center bg-light mt-2 p-3">
          <div className="row">
            <div className="col">
           <div className="d-flex align-items-center">
{/* Afficher les trois premiers participants */}
{guestEvent.participants.slice(0, 3).map((participant, index) => (
<img
key={participant._id}
src={`http://localhost:5000/images/${participant.profilePicture}`}
alt={participant.username}
className="rounded-circle me-1"
style={{ width: '40px', height: '40px' }}
/>
))}
{/* Vérifier s'il y a plus de participants que ceux déjà affichés */}
{guestEvent.participants.length > 3 && (
<div className="rounded-circle bg-secondary text-center text-white me-1" style={{ width: '40px', height: '40px' }}>
<div className='mt-1'>+{guestEvent.participants.length - 3}</div>
</div>
)}

{guestEvent.participants.length === 0 && (
<p>{t('home.no-participants-message')}</p>
)}

</div>

            </div>
            <div className="col text-end">
            <Link to={'/login'}  onClick={handleLinkClick} className="btn btn-secondaire">{t('home.join-event-button')}</Link>


            
          </div>
          
          
          </div>
        </div>
      </div>


    </div>

    ))}
 
  

    </div>
</div>
  )}

    {isAuthenticated && userEvents && userEvents.length === 3 && (

<div>
    <div className="row mt-5">
    <div className="col-lg-12">
    <h2 className='mt-5 text-center fw-bold'>{t('home.recommended-upcoming-events-heading')}</h2>
    </div>
  </div>
    <div className="row mt-5">

    {userEvents && userEvents.map(guestEvent => (
      <div className="col-lg-4">
  
      
      <div className="card border-0 shadow mb-3 h-100" style={{boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
      <img src={`http://localhost:5000/images/${guestEvent.image}`} className="card-img-top aspect-ratio" alt="Event" />
      <div className="card-body">
      <p className="text-muted text-end">{new Date(guestEvent.date).toLocaleDateString()} - Créé le {new Date(guestEvent.date).toLocaleTimeString()}</p>
  
      <Link  onClick={handleLinkClick} to={`/event/${guestEvent._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <h5 className="card-title mt-3">{guestEvent.name}</h5>
    </Link>
            
  
    <p className="card-text mt-3">
              <FontAwesomeIcon icon={faCalendar} className=' me-2' style={{ color: '#7447FF' }} />
              {new Date(guestEvent.dateStart).getDate()} {new Date(guestEvent.dateStart).toLocaleString('default',  { month: 'short' })} {new Date(guestEvent.dateStart).getFullYear().toString().substr(-2)} - 
              {new Date(guestEvent.dateEnd).getDate()} {new Date(guestEvent.dateEnd).toLocaleString('default', { month: 'short' })} {new Date(guestEvent.dateEnd).getFullYear().toString().substr(-2)}
  
              <FontAwesomeIcon icon={faMapMarkerAlt} className='ms-4 me-2' style={{ color: '#7447FF' }} />
              {guestEvent.city}
            </p>
  
  
            <p className="card-text">
            {t('home.unsubscribe-deadline')} : {calculateRemainingTime(guestEvent.unsubscribeDeadline)}
  
          </p>
          {guestEvent.price > 0 ? (
            <span className="badge bg-primary rounded-pill position-absolute top-0 end-0 me-3 mt-3">
              {guestEvent.price} {guestEvent.currency}
            </span>
          ) : (
            <span className="badge bg-success rounded-pill position-absolute top-0 end-0 me-3 mt-3">
            {t('home.free')} 
            </span>
          )}
  
          {guestEvent.isRecommended && (
            <p className="card-text">
              {guestEvent.isRecommended === 'interest' && (
                <span>
                  <FontAwesomeIcon icon={faHeart} style={{ color: '#7447FF' }} className="me-1" />
                  <b> {t('home.interest')} </b>
                  {t('home.interest-match')}
                </span>
              )}
              {guestEvent.isRecommended === 'profile' && (
                <span>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#7447FF' }} className="me-1" />
                 <b> Votre profil {t('home.profile')} </b>
                 {t('home.profile-match')}
                </span>
              )}
              {guestEvent.isRecommended === 'location' && (
                <span>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#7447FF' }} className="me-1" />
                  <b>{t('home.location')} </b> 
                  {t('home.location-match')}
                </span>
              )}
            </p>
          )}
        
          
          </div>
          <div className="card-footer align-items-center bg-light mt-2 p-3">
            <div className="row">
              <div className="col">
             <div className="d-flex align-items-center">
  {/* Afficher les trois premiers participants */}
  {guestEvent.participants.slice(0, 3).map((participant, index) => (
  <img
  key={participant._id}
  src={`http://localhost:5000/images/${participant.profilePicture}`}
  alt={participant.username}
  className="rounded-circle me-1"
  style={{ width: '40px', height: '40px' }}
  />
  ))}
  {/* Vérifier s'il y a plus de participants que ceux déjà affichés */}
  {guestEvent.participants.length > 3 && (
  <div className="rounded-circle bg-secondary text-center text-white me-1" style={{ width: '40px', height: '40px' }}>
  <div className='mt-1'>+{guestEvent.participants.length - 3}</div>
  </div>
  )}
  
  {guestEvent.participants.length === 0 && (
  <p>{t('home.no-participants-message')}</p>
  )}
  
  </div>
  
              </div>
              <div className="col text-end">
              <Link  onClick={handleLinkClick} to={`/event/${guestEvent._id}`} className="btn btn-secondaire">{t('home.join-event-button2')}</Link>
  
  
              
            </div>
            
            
            </div>
          </div>
        </div>
  
  
      </div>
  
      ))}
   
    
  
      </div>
  
      </div>
    )}





  
    
    {isAuthenticated && (
      <div>
        <div className="row mt-5">
          <div className="col-lg-12">
            <h2 className='mt-5 text-center fw-bold'>{t('home.events-by-category-heading')}</h2>
          </div>
        </div>
        <div className="row mt-5">
          {randomCategories.map((category, index) => (
            <div key={index} className="col-lg-4 text-center">
              <div className="category-image-container">
                <img
                  src={category.value}
                  alt={`ImageCategorie ${index}`}
                  className="img-fluid category-image"
                  style={{ height: '180px', objectFit: 'cover', borderRadius: '20px' }}
                />
                <Link to={`/upcoming?category=${category.label}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleLinkClick}>
                  <div className="category-name">{category.label}</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    
   



    <div className="row mt-5">
    <div className="col-lg-6 col-6  text-end mt-4">
     <img src={Google} className='img-fluid' width={'200px'}/>
    </div>
    <div className="col-lg-6 col-6 text-start mt-4">
    <img src={App} className='img-fluid' width={'200px'}/>
    </div>
  </div>
  
  <div className="row mt-5">
    <h2 className='text-center fw-bold'> {t('home.network-heading')}</h2>
    <p className='text-center'> {t('home.network-description')}</p>
  </div>
  <div className="row mt-2 text-center">
<div className='col-lg-3'></div>
<div className='col-lg-6'>

  <img src={Event} className='img-fluid' width={'300px'}></img>
  </div>
  </div>
  <div className="row mt-3">
    <h6 className='text-center'> "{t('home.nyt-quote')}"
    </h6>
    <p className='text-center text-muted'> {t('home.nyt-source')} </p>
  </div>
  


  <div className="row mt-3">
  <h2 className='mt-5 text-center fw-bold'> {t('home.howItWorks')}</h2>
  <div className="col-lg-6 mt-5">
    <div className="card border-0 shadow bg-light" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>

    <div className="card-body d-flex align-items-center">
    <FontAwesomeIcon icon={faSearch} className="me-2" style={{ color: '#7447FF' }} />
    <h5 className="card-title mb-0"> {t('home.discoverEventsAndGroups.title')}</h5>
  </div>
      <div className="card-body">
   
        <p className="card-text">{t('home.discoverEventsAndGroups.text')}</p>
        <Link to={isAuthenticated ? '/upcoming' : '/upcomingGuest'} onClick={handleLinkClick} style={{ color: '#1e2455', textDecoration: 'none', fontSize: '1.1rem' }} className='mt-2'>{t('home.discoverEventsAndGroups.link')}</Link>

      </div>
    </div>
  </div>
  <div className="col-lg-6 mt-5">
    <div className="card border-0 shadow bg-light" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
    <div className="card-body d-flex align-items-center">
    <FontAwesomeIcon icon={faPlus} className="me-2" style={{ color: '#7447FF' }} />
    <h5 className="card-title mb-0">{t('home.createEvent.title')}</h5>
    </div>
      <div className="card-body">
      
      <p className="card-text">{t('home.createEvent.text')}</p>
      <Link to={isAuthenticated ? '/myevents' : '/login'}  onClick={handleLinkClick} style={{ color: '#1e2455', textDecoration: 'none', fontSize: '1.1rem' }} className='mt-2'>{t('home.createEvent.link')}</Link>
      </div>
    </div>
  </div>
</div>

{!isAuthenticated &&
  <div class="row mt-5 ">
  <div className="col-lg-6 bg-light p-5 mt-3" style={{ borderRadius: '10px' }}>
  <h2 className='mt-5'>{t('home.joinDeclic')}</h2>
      <p className='mt-3'>{t('home.declicDescription')}      </p>
     <Link   onClick={handleLinkClick} to={'/register'} ><button type="button" class="btn btn-lg btn-secondaire mt-3">{t('home.joinDeclic2.button')}</button></Link>
    </div>
    <div class="col-lg-6 text-center mt-3">
      <img src={inscription} class="img-fluid" alt="Illustration de mains tendues" width={'400px'}/>
    </div>
  </div>
}


<div class="row mt-5 ">
<div class="col-lg-6 text-center mt-3">
<img src={Image2} class="img-fluid" alt="Illustration de mains tendues" />
</div>


<div className="col-lg-6 bg-light p-5 mt-3" style={{ borderRadius: '10px' }}>
<h2 className='mt-5 '>{t('home.changeLives.title')}</h2>
    <p className='mt-3'>{t('home.changeLives.text1')}    </p>
    <p className='mt-3'>
    {t('home.changeLives.text2')}  </p>
  </div>

</div>

{!isAuthenticated &&

<div className="row mt-5 bg-light p-4" style={{ borderRadius: '10px' }}>
<div className="col-lg-6 mt-3">
  <h2 className='mt-5 fw-bold'> {t('home.takeFirstStep.title')} </h2>
  <p style={{ textAlign: 'justify', fontWeight: 'normal', lineHeight: '1.5' }} className='mt-4'> {t('home.takeFirstStep.text')}</p>
  <Link  onClick={handleLinkClick} to={'/upComingGuest'}><button className="btn btn-lg btn-secondaire mt-4"> {t('home.takeFirstStep.button')}</button></Link>
  </div>
{/* style={{ boxShadow: "0 0 10px rgba(116, 71, 255, 0.3)" }} */}
  <div className="col-lg-6 mt-3 text-center">
  <img src={Attractive} alt="Image" className="img-fluid" width={'450px'}  />
  </div>
</div>
}

    </div>

    </div>

  );
};

export default Home;
