
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faChevronRight, faCalendar , faPlus, faL, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GoogleMapReact from 'google-map-react'; // Assurez-vous d'installer cette bibliothèque
import MapComponent from './MyMapComponent';
import ReactDOM from 'react-dom';
import CreateEvent from './CreateEvent';
import './Myevents.css'
import image1 from '../4063980.jpg';
import EditEvent from './EditEvent';
import { format } from 'date-fns';
import loadingImage from '../loading.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MyEvents = () => {
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [successMessage, setSuccessMessage] = useState(searchParams.get('message'));

  const [remainingTime, setRemainingTime] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventIdisOk, setSelectedEventIdisOk] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);



  
  const handleEditEvent = (eventId) => {
    setSelectedEventIdisOk(true);

    setSelectedEventId(eventId);
  };


  

  const handleCloseAlert = () => {
    setSuccessMessage(null); // Mettre à jour successMessage à null
    
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };


  const [formData, setFormData] = useState({
    file: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    repeat: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    currency: '',
    city: '',
    category: [],
    price: 0,
    type: 'public'
  });


  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  const [cityGoogle, SetCityGoogle] = useState('');
  const [showLocation, setShowLocation] = useState(false);

  const [showMap, setShowMap] = useState(false); // État pour contrôler l'affichage de la carte


  
  const openMap = () => {
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
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

  

  const options = [
    { value: 'USD', label: 'USD', icon: <img src="https://flagcdn.com/24x18/us.png" alt="Drapeau USD" /> },
    { value: 'EUR', label: 'EUR', icon: <img src="https://flagcdn.com/24x18/eu.png" alt="Drapeau EUR" /> },
    { value: 'GBP', label: 'GBP', icon: <img src="https://flagcdn.com/24x18/gb.png" alt="Drapeau GBP" /> },
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

 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/activitys/myevents?page=${currentPage}&searchTerm=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentPage, searchTerm]);



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  


 /* const highlightSearchTerm = (text) => {
    const regex = new RegExp(searchTerm, 'gi');
    return text.split(regex).map((part, index) => 
      index % 2 === 0 ? part : <span key={index} className="highlight">{part}</span>
    );
  };*/


  /*

const highlightSearchTerm = (text) => {
  return text.split('').map((char, index) => (
    char.toLowerCase() === searchTerm.toLowerCase() ?
    <span key={index} className="highlight">{char}</span> :
    char
  ));
};




  */


const highlightSearchTerm = (text) => {
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


const pageNumbers = [];
for (let i = 1; i <= totalPages; i++) {
  pageNumbers.push(i);
}
 

  // Fonction pour traiter la sélection de la ville
  const handleCitySelect = (selectedOption) => {

    SetCityGoogle(selectedOption);
    setFormData({ ...formData, city: selectedOption.value });
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, repeat: { ...formData.repeat, [e.target.id]: e.target.checked } });
  };


const handleToggleSwitch = () => {
    setShowLocation(!showLocation);
  };


  const handleCategorySelect = (selectedOptions) => {
    console.log(selectedOptions);
    setFormData({ ...formData, category: selectedOptions });
  };

  const handleCurrencySelect = (selectedOption) => {
    setFormData({ ...formData, currency: selectedOption.value });
};
const handleSelectLocation = (location) => {
    console.log("Emplacement choisi :", location);

    setFormData({ ...formData, location: location});
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        console.log(formData)

      const response = await axios.post('http://localhost:5000/activitys/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Réponse de l\'API :', response.data);
      // Traitez la réponse de l'API ou effectuez d'autres actions nécessaires
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
      // Gérez l'erreur ou affichez un message d'erreur à l'utilisateur
    }
  };

  


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





  useEffect(() => {
    const message = localStorage.getItem('successMessage');
    const successMessageDisplayed = localStorage.getItem('successMessageDisplayed');
    
    if (message && !successMessageDisplayed) {
      setSuccessMessage(message);
      toast.success(message);

      localStorage.setItem('successMessageDisplayed', true);
      localStorage.removeItem('successMessage');
    }
    localStorage.removeItem('successMessageDisplayed');

  }, []);

  useEffect(() => {
    setTimeout(() => {

      const message= "Événements chargés avec succès !"
      // Une fois les événements chargés, définir le message de succès
      toast.success(message);

    }, 1000);
  }, []);
 

  
  useEffect(() => {


    if (i18n.language) {
        setLanguageInitialized(true);
    }
  }, [i18n.language]);
  
  if (!languageInitialized) {
    return null; 
  }
    return (

        <div className="container mt-4 mb-5">
  {/* <ToastContainer /> */}

<div className='row mt-4 '>
<div className='col-3'>
    

<Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
  <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> {t('event.back') }
</Link>


        </div>
        <div className='col-6'>

                <h1 className='text-center text-uppercase'>{t('navbar.my-events')}</h1>
        </div>
        </div>

        <div className="row mt-3">
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
        <FontAwesomeIcon icon={faPlus} className=' me-2' style={{ color: '#fff' }} />   {t('event.add-event-placeholder')} 
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
        ) : events.length > 0 ? (
          events.map(event => (
            <div key={event._id} className="col-md-4 mb-4">
            <div className="card border-0 shadow mb-3" style={{boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
            <img src={`http://localhost:5000/images/${event.image}`} className="card-img-top aspect-ratio" alt="Event" />
            <div className="card-body">
            <p className="text-muted text-end">{new Date(event.date).toLocaleDateString()} - Créé le {new Date(event.date).toLocaleTimeString()}</p>

            <Link to={`/event/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> <h5 className="card-title mt-3">{highlightSearchTerm(event.name)}</h5> </Link>
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
                    <button
                      type="button"
                      className="btn btn-secondaire"
                      onClick={() => handleEditEvent(event._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalEdit"
                    >
                      Modifier l'événement
                    </button>
                      <ModalEditEvent eventId={selectedEventId} />
                  </div>
                  
                  
                  </div>
                </div>
              </div>

      
            </div>


            
          ))


          
        ) : (
          <div className="col text-center">
            <img src={image1} alt="No events" className='img-fluid '  style={{ maxWidth: '300px' }} />
            <h4 className="mt-3"> {t('event.no-events-found.title')}</h4>
            <p> {t('event.no-events-found.description')}</p>
            
          </div>
        )}


        <div className='row text-center'>
  <div className='col-lg d-flex justify-content-center'>
    {events.length > 0 && (
      <ul className="pagination ">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </li>
      </ul>
    )}
  </div>
</div>


      
      </div>




</div>
    );
}




const ModalEditEvent = ({ eventId }) => {
  

    return (
   <EditEvent eventId={eventId} />
    );

};


export default MyEvents;
