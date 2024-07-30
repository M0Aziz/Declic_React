import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faCalendarAlt, faHeart, faMapMarkerAlt, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import image1 from '../4494054.jpg';
import CreateEvent from './CreateEvent';
import { Link, useLocation } from 'react-router-dom';
import loadingImage from '../loading.gif';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const MyeventsUpComing = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const [isExpired, setIsExpired] = useState(false);
  const [isInWaitingList, setIsInWaitingList] = useState(false);
  const [isInParticipants, setIsInParticipants] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || ''; // Utilisez une valeur vide si le paramètre de requête n'est pas défini
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedCity, setSelectedCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);
  
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/activitys/upComing', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            category: selectedCategory,
            city: selectedCity,
            startDate,
            price: selectedPrice,
            match: selectedMatch,

        }
        });
        setActivities(response.data);
        console.log(response.data)
        setLoading(false);
        checkUserStatus(response.data);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCategory, selectedCity, startDate, selectedPrice, selectedMatch ]);

  const handleMatchChange = (event) => {
    setSelectedMatch(event.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
};

const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    console.log(selectedCity)
};

const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
};



const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
};

  useEffect(() => {
    // Filtrer les événements en fonction du terme de recherche
    const filtered = activities.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, activities]);


  const checkUserStatus = (events) => {
    if (!userId || !events || !events.length) return;
  
    let isInWaitingList = false;
    let isInParticipants = false;
  
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (Array.isArray(event.waitingList) && event.waitingList.includes(userId)) {
        isInWaitingList = true;
        break; 
      }
      if (Array.isArray(event.participants) && event.participants.includes(userId)) {
        isInParticipants = true;
        break; 
      }
    }
  
    setIsInWaitingList(isInWaitingList);
    setIsInParticipants(isInParticipants);
  };
  
  

  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const highlightSearchTerm = (text) => {
    // Vérifier si le terme de recherche est vide
    if (!searchTerm) {
      return text; // Retourner le texte d'origine si le terme de recherche est vide
    }
  
    const regex = new RegExp(searchTerm, 'gi');
    let result = [];
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchLength = match[0].length;
  
      // Ajouter la partie de texte avant le match
      result.push(text.substring(lastIndex, matchIndex));
  
      // Ajouter le match enveloppé dans une balise span
      result.push(<span className="highlight">{match[0]}</span>);
  
      // Mettre à jour l'index du dernier match
      lastIndex = matchIndex + matchLength;
    }
  
    // Ajouter la partie de texte après le dernier match
    result.push(text.substring(lastIndex));
  
    return result;
  };
  

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

      setIsExpired(true);
      return "Expired";
    }
  
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    return `${days}j ${hours}h ${minutes}min ${seconds}s`;
  };

  const handleRemoveImage = () => {
    // Logique pour supprimer l'image
  };


  const participateInActivity = async  (activityId) => {
    setLoading(true);

    try {
      const response =  await axios.put(`http://localhost:5000/activitys/${activityId}/participate/`,   {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.data.message) {
      // L'utilisateur a été ajouté à la liste d'attente avec succès
      console.log('Succès : ', response.data.message);
      toast.success(response.data.message);
      setActivities(prevActivities => prevActivities.map(activity => activity._id === activityId ? {...activity, waitingList: [...activity.waitingList, userId]} : activity));
      setFilteredEvents(prevFilteredEvents => prevFilteredEvents.map(event => event._id === activityId ? {...event, waitingList: [...event.waitingList, userId]} : event));
   
    } else {
      // Gérer le cas où l'utilisateur est déjà en liste d'attente
      console.log('Erreur : ', response.data.error);

toast.error(response.data.error)

    }
    } catch (error) {
      throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de la demande de participation');
    }
    finally {
      setLoading(false);

     
    
    }
  };

  const unsubscribeFromWaitingList = async (activityId) => {
    setLoading(true);
  
    try {
      const response = await axios.put(`http://localhost:5000/activitys/${activityId}/unsubscribe-waitinglist/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.message) {
        // L'utilisateur a été retiré de la liste d'attente avec succès
        console.log('Succès : ', response.data.message);
        toast.success(response.data.message);
        setActivities(prevActivities => prevActivities.map(activity => activity._id === activityId ? { ...activity, waitingList: activity.waitingList.filter(id => id !== userId) } : activity));
        setFilteredEvents(prevFilteredEvents => prevFilteredEvents.map(event => event._id === activityId ? { ...event, waitingList: event.waitingList.filter(id => id !== userId) } : event));
        
      } else {
        // Gérer le cas où l'utilisateur n'est pas dans la liste d'attente
        console.log('Erreur : ', response.data.error);
        toast.error(response.data.error);
      }
    } catch (error) {
      throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de la désinscription de la liste d\'attente');
    } finally {
      setLoading(false);
    }
  };
  


  const renderActionButton = (id,waitingList, participants, unsubscribeDeadline) => {
    const isExpired = calculateRemainingTime(unsubscribeDeadline) === "Expired";

    if (isExpired) {
      return <button className="btn btn-secondaire" disabled>Expired</button>;
    } else if (waitingList.some(id => id === userId)) {
      return (
        <>
    <Button 
      className="btn btn-outline-custom-secondaire" 
      onClick={() => setShowConfirmation(true)}
    >
      Cancel
    </Button>

    <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir annuler ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
          Annuler
        </Button>
        <Button className='btn btn-secondaire' onClick={() => { unsubscribeFromWaitingList(id); setShowConfirmation(false); }}>
          Confirmer
        </Button>
      </Modal.Footer>
    </Modal>
  </>
      );
          } else if (participants.some(participant => participant._id === userId)) {
      return <button className="btn btn-outline-custom-secondaire">Leave</button>;
    } else {
      return <button disabled={loading} className="btn btn-secondaire" onClick={() => participateInActivity(id)}>Join</button>;
    }
};

const cities = [
  { label: "Abu Dhabi", value: "Abu Dhabi", latitude: 24.4539, longitude: 54.3773 },
  { label: "Dubai", value: "Dubai", latitude: 25.276987, longitude: 55.296249 },
  { label: "Paris", value: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { label: "London", value: "London" },
  { label: "Marrakech", value: "Marrakech" },
  { label: "Tunis", value: "Tunis" },
  { label: "New York", value: "New York" },
  { label: "Tokyo", value: "Tokyo" },
  { label: "Sydney", value: "Sydney" },
];
const categories = [
  { label: 'Sports', value: 'Sports' },
  { label: 'Musique', value: 'Musique' },
  { label: 'Cuisine', value: 'Cuisine' },
  { label: 'Voyage', value: 'Voyage' },
  { label: 'Art', value: 'Art' },
  { label: 'Technologie', value: 'Technologie' },
  { label: 'Photographie', value: 'Photographie' },
  { label: 'Mode', value: 'Mode' },
  { label: 'Lecture', value: 'Lecture' },
  { label: 'Jardinage', value: 'Jardinage' },
  { label: 'Danse', value: 'Danse' },
  { label: 'Fitness', value: 'Fitness' }
];

  return (
    <div className="container mb-5">
    {/* <ToastContainer /> */}
    <div className='row mt-4 '>
    <div className='col-3'>

    
    <Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
      <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> {t('event.back') }
    </Link>
    
    
            </div>
            <div className='col-6'>
    
                    <h1 className='text-center text-uppercase'>{t('navbar.upcoming')}</h1>
            </div>
            </div>


   <div className="row">
        <div className='col-lg-12 '>
        
        <div className="row mt-3">
        <div className="col-lg-2 col-3 mt-lg-0 mt-4 mb-4">
          <button
            className="btn btn-primaire"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? t('event.hide-filters') : t('event.show-filters') }
          </button>
        </div>
        {showFilters && (
          <div className="col-lg col">
            <div className="row">
              <div className="col-md-3">
                <select
                  className="form-select "
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select mt-lg-0 mt-2"
                  value={selectedCity}
                  onChange={handleCityChange}
                >
                  <option value="">Toutes les villes</option>
                  {cities.map(city => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control mt-lg-0 mt-2"
                    placeholder='hdgfdg'
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select mt-lg-0 mt-2"
                  value={selectedPrice}
                  onChange={handlePriceChange}
                >
                  <option value="">Tous</option>
                  <option value="gratuit">Gratuit</option>
                  <option value="payant">Payant</option>
                </select>
              </div>
              <div className="col-md-2">
  <select
    className="form-select mt-lg-0 mt-2"
    value={selectedMatch}
    onChange={handleMatchChange}
  >
    <option value="">Tous</option>
    <option value="profile">Par Profil</option>
    <option value="location">Par Localisation</option>
    <option value="interest">Par Centre d'intérêt</option>
    <option value="all">Par Tout</option>
  </select>
</div>

            </div>
          </div>
        )}
      </div>
        
        </div>
     
      
        </div>
  
    <div className="row">
    <div className="col-6">

    <div class="ui-input-container">
    <input
    placeholder={t('event.type-something-placeholder')}
    className="ui-input"
    type="text"
    value={searchTerm}
    onChange={handleSearch}
  />
<div class="ui-input-underline"></div>
<div class="ui-input-highlight"></div>
<div class="ui-input-icon">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <path
    stroke-linejoin="round"
    stroke-linecap="round"
    stroke-width="2"
    stroke="currentColor"
    d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
  ></path>
</svg>
</div>
</div>
</div>
    <div className="col-6 ">


<div className='text-end mt-2'>
    <button type="button" className="btn btn-secondaire" data-bs-toggle="modal" data-bs-target="#exampleModal">
    <FontAwesomeIcon icon={faPlus} className=' me-2' style={{ color: '#fff' }} />  {t('event.add-event-placeholder')} 
    </button>
    </div>

    < CreateEvent  />
         
    
    </div>
    </div>



    <div className="row mt-5">
    {loading ? (
      <div className="col text-center">
        <img src={loadingImage} alt="Loading" />
      </div>
    ) : filteredEvents.length > 0 ? (
      filteredEvents.map(event => (
        <div key={event._id} className="col-md-4 mb-4">
        <div className="card border-0 shadow mb-3 h-100" style={{boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
        <img src={`http://localhost:5000/images/${event.image}`} className="card-img-top aspect-ratio" alt="Event" />
        <div className="card-body">
        <p className="text-muted text-end">{new Date(event.date).toLocaleDateString()} - Créé le {new Date(event.date).toLocaleTimeString()}</p>

        <Link to={`/event/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h5 className="card-title mt-3">{highlightSearchTerm(event.name)}</h5>
      </Link>
              

      <p className="card-text mt-3">
                <FontAwesomeIcon icon={faCalendar} className=' me-2' style={{ color: '#7447FF' }} />
                {new Date(event.dateStart).getDate()} {new Date(event.dateStart).toLocaleString('default',  { month: 'short' })} {new Date(event.dateStart).getFullYear().toString().substr(-2)} - 
                {new Date(event.dateEnd).getDate()} {new Date(event.dateEnd).toLocaleString('default', { month: 'short' })} {new Date(event.dateEnd).getFullYear().toString().substr(-2)}

                <FontAwesomeIcon icon={faMapMarkerAlt} className='ms-4 me-2' style={{ color: '#7447FF' }} />
                {event.city}
              </p>


              <p className="card-text">
              Unsubscribe Deadline: {calculateRemainingTime(event.unsubscribeDeadline)}

            </p>
            {event.price > 0 ? (
              <span className="badge bg-primary rounded-pill position-absolute top-0 end-0 me-3 mt-3">
                {event.price} {event.currency}
              </span>
            ) : (
              <span className="badge bg-success rounded-pill position-absolute top-0 end-0 me-3 mt-3">
                Gratuit
              </span>
            )}


            {event.isRecommended && (
              <p className="card-text">
                {event.isRecommended === 'interest' && (
                  <span>
                    <FontAwesomeIcon icon={faHeart} style={{ color: '#7447FF' }} className="me-1" />
                    <b>Vos centres d'intérêt</b> concordent  à cette activité
                  </span>
                )}
                {event.isRecommended === 'profile' && (
                  <span>
                    <FontAwesomeIcon icon={faUser} style={{ color: '#7447FF' }} className="me-1" />
                   <b> Votre profil </b> correspond à cette activité
                  </span>
                )}
                {event.isRecommended === 'location' && (
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#7447FF' }} className="me-1" />
                    <b> Votre localisation </b> correspond à cette activité
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
{event.participants.slice(0, 3).map((participant, index) => (
<img
  key={participant._id}
  src={`http://localhost:5000/images/${participant.profilePicture}`}
  alt={participant.username}
  className="rounded-circle me-1"
  style={{ width: '40px', height: '40px' }}
/>
))}
{/* Vérifier s'il y a plus de participants que ceux déjà affichés */}
{event.participants.length > 3 && (
<div className="rounded-circle bg-secondary text-center text-white me-1" style={{ width: '40px', height: '40px' }}>
  <div className='mt-1'>+{event.participants.length - 3}</div>
</div>
)}

{event.participants.length === 0 && (
<p>Aucun participant</p>
)}

</div>

                </div>
                <div className="col text-end">
                {/* Appeler la méthode renderActionButton */}
                {renderActionButton(event._id,event.waitingList, event.participants, event.unsubscribeDeadline)}

                
              </div>
              
              
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center mt-5">
      <img src={image1} alt="No events" className='img-fluid' style={{ maxWidth: '300px' }} />

     
        <h2> {t('event.no-upcoming-activities.title')} </h2>
        <p>
        {t('event.no-upcoming-activities.descritpion1')}</p> <p> {t('event.no-upcoming-activities.descritpion2')}
        </p>
      </div>
    )}
  </div>




     
    </div>
  );
};

export default MyeventsUpComing;
