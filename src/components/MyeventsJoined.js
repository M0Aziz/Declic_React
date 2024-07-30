import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import image1 from '../illustration-concept-personnes-visitant-exterieur_114360-2823.avif';
import { Link } from 'react-router-dom';
import CreateEvent from './CreateEvent';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
const MyeventsJoined = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/activitys/joined?page=${currentPage}&searchTerm=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEvents(response.data.activities);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  useEffect(() => {
  

    fetchData();
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

  
const pageNumbers = [];
for (let i = 1; i <= totalPages; i++) {
  pageNumbers.push(i);
}


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

    return "Expired";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${days}j ${hours}h ${minutes}min ${seconds}s`;
};



const unsubscribeFromparticipants = async (activityId) => {
  setLoading(false);

  try {
    const response = await axios.put(`http://localhost:5000/activitys/${activityId}/unsubscribe/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.message) {
      // L'utilisateur a été retiré de la liste d'attente avec succès
      console.log('Succès : ', response.data.message);
      toast.success(response.data.message);
      setEvents(prevActivities => prevActivities.map(activity => activity._id === activityId ? { ...activity, participants: activity.participants.filter(id => id !== userId) } : activity));
      fetchData();
    } else {
      // Gérer le cas où l'utilisateur n'est pas dans la liste d'attente
      console.log('Erreur : ', response.data.error);
      toast.error(response.data.error);
    }
  } catch (error) {

    toast.error(error.response.data.message || 'Une erreur s\'est produite lors de la désinscription de la liste d\'attente')
    //throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de la désinscription de la liste d\'attente');
  } finally {
    setLoading(true);
  }
};

  return (
    <div className="container mb-5">

    <div className='row mt-4 '>
    <div className='col-3'>

    
    <Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
      <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> {t('event.back') }
    </Link>
    
    
            </div>
            <div className='col-6'>
    
                    <h1 className='text-center text-uppercase'>{t('navbar.joined')}</h1>
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
        {events.length > 0 ? (
          events.map(event => (
            <div key={event._id} className="col-md-4 mb-4">
              <div className="card border-0 shadow h-100" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
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
        
                    </div>
                <div className="card-footer align-items-center bg-light mt-3 p-3">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex align-items-center">
                        {/* Afficher les participants */}
                        {event.participants.map(participant => (
                          <img
                            key={participant._id}
                            src={`http://localhost:5000/images/${participant.profilePicture}`}
                            alt={participant.username}
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px' }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="col text-end">
                      <button className="btn btn-secondaire"  onClick={() => { unsubscribeFromparticipants(event._id) }} disabled={!loading || new Date(event.unsubscribeDeadline) <= new Date() }>           {loading ? 'Quitter...' : 'Quitter en cours'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <img src={image1} alt="No events" className='img-fluid' style={{ maxWidth: '300px' }} />
            <h2> {t('event.no-joined-events.title')}</h2>

            
            <p> {t('event.no-joined-events.description1')}</p>
            <p>{t('event.no-joined-events.description2')}            </p>
            
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
};

export default MyeventsJoined;
