import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import loadingImage from '../loading.gif';
import NotData from '../No data-rafiki.png';

import { jwtDecode } from 'jwt-decode';
import Badge from 'react-bootstrap/Badge';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBook, faCalendarAlt, faCalendarTimes, faCamera, faCopy, faDollarSign, faDumbbell, faExclamationTriangle, faFlag, faFutbol, faInfoCircle, faLaptop, faMapMarkerAlt, faMusic, faPalette, faPlane, faPlus, faSeedling, faShareAlt, faShoePrints, faSignInAlt, faSmileWink, faSyncAlt, faTrash, faTshirt, faUserCheck, faUserFriends, faUsersSlash, faUtensils } from '@fortawesome/free-solid-svg-icons';
const EventDescription = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comment, setComment] = useState([]);
  const [remainingTime, setRemainingTime] = useState(null);
  const intervalRef = useRef(null);
  const token = localStorage.getItem('token');
  const [newComment, setNewComment] = useState('');

  const [isExpired, setIsExpired] = useState(false);
  const [isInWaitingList, setIsInWaitingList] = useState(false);
  const [isInParticipants, setIsInParticipants] = useState(false);
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [isWaitingDate, setIsWaitingDate] = useState(false);

  const [waitingList, setWaitingList] = useState([]);
  const [participantsList, setParticipantsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // État pour suivre le chargement des commentaires
const [total,setTotal]= useState(0);
const [friends, setFriends] = useState([]);

const [selectedReason, setSelectedReason] = useState('Spam');;

const [showReportModal, setShowReportModal] = useState(false);
const [showReportModalComment, setShowReportModalComment] = useState(false);

const [idComment , setIdComment]=useState('');
const [showShareModal, setShowShareModal] = useState(false);
const [showConfirmation, setShowConfirmation] = useState(false);
const [loading, setLoading] = useState(true);
const [invitationsSent, setInvitationsSent] = useState({});

  const options = [
    { value: 'USD', label: 'USD', abbreviation: '$', icon: <img src="https://flagcdn.com/24x18/us.png" alt="Drapeau USD" /> },
    { value: 'EUR', label: 'EUR', abbreviation: '€', icon: <img src="https://flagcdn.com/24x18/eu.png" alt="Drapeau EUR" /> },
    { value: 'GBP', label: 'GBP', abbreviation: '£', icon: <img src="https://flagcdn.com/24x18/gb.png" alt="Drapeau GBP" /> },
  ];
  
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken._id : null;
  const [page, setPage] = useState(1);



  const [copySuccess, setCopySuccess] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDeleteConfirmation = () => {
    setShowConfirmationModal(false);
    deleteActivity(event._id);
  };
  const copyToClipboard = () => {
    const urlInput = document.getElementById('urlInput');
    urlInput.select();
    document.execCommand('copy');
    setCopySuccess('URL copiée !');
  };
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  const fetchEvent = async () => {
    try {
   

      const url = token ? `http://localhost:5000/activitys/${id}` : `http://localhost:5000/activitys/${id}/public`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(url, { headers });
      setEvent(response.data);
      checkUserStatus(response.data);

      console.log(response.data)
if (token ){
setIsLoading(true);
      const responseComment = await axios.get(`http://localhost:5000/comments/${id}/comments?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    console.log(responseComment)
    setTotal(responseComment.data.totalComments)
      setComment(oldComments => [...oldComments, ...responseComment.data.comments]);    
      setIsLoading(false)
    }
  } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error.response.data.message);
      } else {
        console.error('Une erreur s\'est produite !', error);
      }     
    }
  };
  useEffect(() => {
   
  
    fetchEvent();
  }, [id, page,token]);
  
  const loadMoreComments = () => {
    setPage(oldPage => oldPage + 1);
  };

  
  

  const handleReport = async () => {
    if (token ){
    try {
        const response = await axios.put(`http://localhost:5000/activitys/${event._id}/report`, {        reason: selectedReason
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            toast.success('Signalement ajouté avec succès');
        } else {
            toast.error('Erreur lors de l\'ajout du signalement');
        }
    } catch (error) {
        toast.error('Erreur lors de l\'ajout du signalement');
    } finally {
        setShowReportModal(false);
    }
  }
};



const handleReportComment = async () => {
  if (token ){
  try {
      const response = await axios.put(`http://localhost:5000/comments/${idComment}/report`, {        reason: selectedReason
      }, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });

      if (response.status === 200) {
          toast.success('Signalement ajouté avec succès');
      } else {
          toast.error('Erreur lors de l\'ajout du signalement');
      }
  } catch (error) {
      toast.error('Erreur lors de l\'ajout du signalement');
  } finally {
      setShowReportModal(false);
  }
}
};

const fetchFriends = async () => {
  if (token ){
  try {
    const response = await axios.get(`http://localhost:5000/profiles/get/friends`, {
      params: { id },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    setFriends(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des amis depuis l\'API :', error);
  }
}
};

const handleInvite = async (friendId) => {
  if (token ){
  if (invitationsSent[friendId] && Date.now() < invitationsSent[friendId]) {
    return;
  }
    try {
        const response = await axios.post('http://localhost:5000/messages/', {
            username: friendId,
            content: `Je vous invite à rejoindre cet événement : http://localhost:3001/event/${event._id}`,
            
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
          toast.success('Invitation envoyée avec succès');
    
          const updatedInvitations = {
            ...invitationsSent,
            [friendId]: Date.now() + 24 * 60 * 60 * 1000, // Ajouter 24 heures en millisecondes
          };
          localStorage.setItem('invitationsSent', JSON.stringify(updatedInvitations));
          setInvitationsSent(updatedInvitations);
        } else {
          toast.error('Erreur lors de l\'envoi de l\'invitation');
        }
    } catch (error) {
        toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
        setShowShareModal(false);
    }
  }
};

useEffect(() => {
  const storedInvitations = localStorage.getItem('invitationsSent');
  if (storedInvitations) {
    setInvitationsSent(JSON.parse(storedInvitations));
  }
}, []);
 
  const checkUserStatus = (event) => {
    if (!userId) return;

    setIsInWaitingList(event.waitingList.includes(userId));
    setIsInParticipants(event.participants.includes(userId));
  };
  useEffect(() => {
    intervalRef.current = setInterval(() => {
        if (event && new Date(event.unsubscribeDeadline) > new Date() && event.visibility) {
          setRemainingTime(calculateRemainingTime(event.unsubscribeDeadline));
        }
      }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id,event]); 

  if (!event) {
    return (
      <div className='container'>
      {/* <ToastContainer /> */}

        <div className='row'>
          <div className="col text-center">
            <img src={loadingImage} alt="Loading" />
          </div>
        </div>
      </div>
    );
  }


  if ( new Date(event.unsubscribeDeadline) <= new Date() && userId !== event.organizer._id){

    return (
      <div className='container mb-5'>
      {/* <ToastContainer /> */}

        <div className='row'>
          <div className="col-lg-12 text-center">
          <img src={NotData} alt="NoData" className='img-fluid' width={'500px'} />
          </div>
        </div>

        <div className='row'>
        <div className="col text-center">
         
          <h3> <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#7447FF', fontSize: '2rem' }} />L'événement n'est plus disponible !</h3>
          <p>Oops ! Il semble que cet événement n'est plus disponible.</p>
          <p>Revenez à la <Link to="/upcoming"  onClick={handleLinkClick} style={{textDecoration:'none'}}> page </Link> pour découvrir d'autres événements passionnants.</p>
          <p>Ou restez à l'écoute pour les prochaines activités passionnantes !</p>
          <FontAwesomeIcon icon={faSmileWink} style={{ color: '#7447FF', fontSize: '2rem' }} />
        </div>
      </div>
      </div>
    );

  }


  if ( !event.visibility ){

    return (
      <div className='container mb-5'>
      {/* <ToastContainer /> */}

        <div className='row'>
          <div className="col text-center">
          <img src={NotData} alt="NoData"  className="img-fluid" width={'500px'} />
          </div>
        </div>

        <div className='row'>
        <div className="col text-center">
          <h3> <FontAwesomeIcon icon={faExclamationTriangle} className='me-2'style={{ color: '#7447FF', fontSize: '2rem' }} />L'événement n'est plus disponible !</h3>
          <p>Oops ! Il semble que cet événement n'est plus disponible.</p>
          <p>Revenez à la <Link to="/upcoming"  onClick={handleLinkClick} style={{textDecoration:'none'}}> page </Link> pour découvrir d'autres événements passionnants.</p>
          <p>Ou restez à l'écoute pour les prochaines activités passionnantes !</p>
          <FontAwesomeIcon icon={faSmileWink} style={{ color: '#7447FF', fontSize: '2rem' }} />
        </div>
      </div>
      </div>
    );

  }

  
  const calculateRemainingTime = (unsubscribeDeadline) => {
    const currentTime = new Date();
    const deadlineTime = new Date(unsubscribeDeadline);
    const difference = deadlineTime - currentTime;
  
    if (difference <= 0) {
      setIsExpired(true);
      setIsWaitingDate(true)
      return "Expired";

    }
  
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    return `${days}j ${hours}h ${minutes}min ${seconds}s`;
  };


  const getCurrencyFlag = (currency) => {
    const currencyOption = options.find(option => option.value === currency);
    return currencyOption ?  currencyOption.abbreviation : null;
  };


  
  const showWaitingListModal = () => {
    setShowWaitingList(true);
  };
  
  const showParticipantsListModal = () => {
    setShowParticipantsList(true);
  };



  const showWaitingListGet = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/activitys/waitingList/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      if (response.status === 200) {
        setWaitingList(response.data);
        console.log(waitingList);
      } else {
        console.error('Erreur lors de la récupération de la liste d\'attente');
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
    }
  };


  const showParticipantsListGet = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/activitys//participants/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      if (response.status === 200) {
        setParticipantsList(response.data);
        console.log(participantsList);
      } else {
        console.error('Erreur lors de la récupération de la liste d\'attente');
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
    }
  };

  const handleAccept = async (activityId,userIdAccepet) => {

    try {
        const response = await axios.put(`http://localhost:5000/activitys/${activityId}/accept/${userIdAccepet}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.message) {
            console.log('Succès : ', response.data.message);
            
 
fetchEvent();
    
            setShowWaitingList(false);
            setShowWaitingList(false);

            toast.success(response.data.message);
       } else {
            console.log('Erreur : ', response.data.error);
            setShowWaitingList(false);

            toast.error(response.data.error);
        }
    } catch (error) {
        throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de l\'acceptation de la participation');
    } 
};



const handleRemove = async (activityId,userIdAccepet) => {

  try {
      const response = await axios.put(`http://localhost:5000/activitys/${activityId}/remove/${userIdAccepet}`, {}, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      if (response.data.message) {
          console.log('Succès : ', response.data.message);
          

fetchEvent();
  
          setShowParticipantsList(false);

          toast.success(response.data.message);
     } else {
          console.log('Erreur : ', response.data.error);
          setShowWaitingList(false);

          toast.error(response.data.error);
      }
  } catch (error) {
      throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de l\'acceptation de la participation');
  } 
};

const addComment = async (activityId, content) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(`http://localhost:5000/comments/${activityId}/comment`, {
      content
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'ajout du commentaire :', error);
    throw error;
  }
};






const methodeTest = (id)=>{

  alert(`Méthode appelée avec activityId : ${id}`);


}
const participateInActivityAndCheck = async (activityId) => {

  try {


    if (new Date(event.unsubscribeDeadline) > new Date() && event.visibility) {

      const response = await axios.put(
          `http://localhost:5000/activitys/${activityId}/participate/`,
          {},
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      if (response.data.message) {
          console.log('Succès : ', response.data.message);
          toast.success(response.data.message);
          setEvent((prevEvent) => ({
              ...prevEvent,
              waitingList: [...prevEvent.waitingList, userId],
          }));

          setIsInWaitingList(true);
      } else {
          console.log('Erreur : ', response.data.error);
          toast.error(response.data.error);
      }

    } else {
      if (new Date(event.unsubscribeDeadline) <= new Date()) {
          toast.error('Vous ne pouvez plus vous inscrire à cette activité car la date limite est dépassée.');
      } else {
          toast.error('Cette activité n\'est pas disponible actuellement.');
      }
  }
  } catch (error) {
      console.error('Erreur : ', error);
      throw new Error(
          error.response?.data?.message ||
              'Une erreur s\'est produite lors de la demande de participation'
      );
  }
};


const unsubscribeFromWaitingList = async (activityId) => {

  try {

    if (new Date(event.unsubscribeDeadline) > new Date() && event.visibility) {

    const response = await axios.put(`http://localhost:5000/activitys/${activityId}/unsubscribe-waitinglist/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.message) {
      console.log('Succès : ', response.data.message);
      toast.success(response.data.message);
     setEvent(prevEvent => ({
                ...prevEvent,
                waitingList: prevEvent.waitingList.filter(id => id !== userId)
            }));

            setIsInWaitingList(false);



    } else {
      console.log('Erreur : ', response.data.error);
      toast.error(response.data.error);
    }
  } else {
    if (new Date(event.unsubscribeDeadline) <= new Date()) {
        toast.error('Vous ne pouvez plus vous inscrire à cette activité car la date limite est dépassée.');
    } else {
        toast.error('Cette activité n\'est pas disponible actuellement.');
    }
}
  } catch (error) {
    throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de la désinscription de la liste d\'attente');
  }
};



const unsubscribeFromparticipants = async (activityId) => {

  try {

    if (new Date(event.unsubscribeDeadline) > new Date() && event.visibility) {

    const response = await axios.put(`http://localhost:5000/activitys/${activityId}/unsubscribe/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.message) {
      console.log('Succès : ', response.data.message);
      toast.success(response.data.message);
      setIsInParticipants(false);
     
    } else {
      console.log('Erreur : ', response.data.error);
      toast.error(response.data.error);
    }
  } else {
    if (new Date(event.unsubscribeDeadline) <= new Date()) {
        toast.error('Vous ne pouvez plus vous inscrire à cette activité car la date limite est dépassée.');
    } else {
        toast.error('Cette activité n\'est pas disponible actuellement.');
    }
}
  } catch (error) {

    toast.error(error.response.data.message || 'Une erreur s\'est produite lors de la désinscription de la liste d\'attente')
    //throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de la désinscription de la liste d\'attente');
  } 
};



const deleteActivity = async (activityId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/activitys/${activityId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assurez-vous que token est défini ou passé comme paramètre
      },
    });

    if (response.status === 200) {
      toast.success('Activité supprimée avec succès');
    } else {
     toast.error('Erreur lors de la suppression de l\'activité');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité :', error);
  }
};

const handleSubmitComment = async (e) => {
  e.preventDefault();
  try {
    if (!newComment.trim()) {
      toast.error('Le commentaire est vide. Veuillez écrire un commentaire avant de soumettre.'); 
      return; 
    }

    const addedComment = await addComment(id, newComment);
    const response = await axios.get(`http://localhost:5000/comments/${addedComment._id}`);

    setComment(prevComments => [...prevComments, response.data]);
    setNewComment(''); // Réinitialiser le champ de commentaire après l'ajout
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'ajout du commentaire :', error);
  }
};


const hasReported = event.reported.some(report => report.user === userId && report.status === 'N') ;


const reportReasons = [
  'Spam',
  'Contenu offensant',
  'Contenu inapproprié',
  'Harcèlement',
  'Fausse information',
  'Violation des droits d\'auteur',
  'Fraude',
  'Violence',
  'Discours haineux',
  'Autre'
];

const categoryIcons = {
  Sports: faFutbol,
  Musique: faMusic,
  Cuisine: faUtensils,
  Voyage: faPlane,
  Art: faPalette,
  Technologie: faLaptop,
  Photographie: faCamera,
  Mode: faTshirt,
  Lecture: faBook,
  Jardinage: faSeedling,
  Danse: faShoePrints,
  Fitness: faDumbbell
};
  return (
    <div className="container mb-5">
 {/* <ToastContainer /> */} 
    <div className='row mt-5 '>
<div className='col-3'>
   
<Link to="#" onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
  <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> Retour
</Link>


        </div>
        <div className='col-lg-6'>

                <h1 className='text-center text-uppercase '>{event.name}</h1>
        </div>
        </div>


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
    

      <div className="row mt-5">
        <div className='col-lg-6'>
        <img
        src={`http://localhost:5000/images/${event.image}`}
        alt={`ImageEvent ${event.image}`}
        className='img-fluid rounded shadow'
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)" , height:'600px', objectFit:'cover' }}
      />
              </div>
        <div className='col-lg-6'>
          <h2 className='mt-lg-0 mt-3'>{event.name}</h2>
          <small className='mt-lg-0 mt-3 text-muted'> Créé le  {new Date(event.date).toISOString().replace('T', ' ').slice(0, -8)} {token && <span>par : </span>}</small>

        {token && userId !== event.organizer._id &&

                <div className='row mt-4'>

                          <div className='col-2'>
                          <img src={`http://localhost:5000/images/${event.organizer.profilePicture}`} alt={`ImageProfile ${event.organizer.profilePicture}`} className='img-fluid' style={{  height: '50px',  objectFit:'cover', borderRadius:'20px' }} />

                          </div>

                          <div className='col-7'>
                          <h5>{event.organizer.lastName} {event.organizer.firstName}</h5>
                                    <div className='row'>
                                    <div className='col'>
                                   <p>@{event.organizer.profile.username}</p>
                                    </div>
                                    </div>
                          </div>


                          <div className='col'>
<a href={`/profile/${event.organizer.profile.username}`} className="btn btn-outline-custom-secondaire">Voir le profile</a>
                          
                          </div>
                </div>


        }
        <h6 className='mt-3'><FontAwesomeIcon style={{ color: '#7447FF' }} className='me-2' icon={faCalendarAlt} /> Date de début - Date de fin : </h6>

          <p className='mt-2'>
          {new Date(event.dateStart).toISOString().replace('T', ' ').slice(0, -8)} - {new Date(event.dateEnd).toISOString().replace('T', ' ').slice(0, -8)}</p>

          <h6 className='mt-3'><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#7447FF' }} className='me-2' /> Ville : </h6>


          <p className='mt-2'>  {event.city}</p>

          {event.showLocation && <h6 className='mt-3'><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#7447FF' }} className='me-2' /> Localisation :</h6>}


          {event.showLocation && <p className='mt-2'> {event.location}</p>}
          {event.repeat && event.repeat.length>0 && (
            <div className='mt-3'>
              <h6><FontAwesomeIcon icon={faSyncAlt} style={{ color: '#7447FF' }} className='me-2' />
              Répétition :</h6>
              <ul>
                {event.repeat.map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            </div>
          )}


          {event.price > 0 ? (
            <div>
            <h6 className='mt-3'><FontAwesomeIcon icon={faDollarSign} style={{ color: '#7447FF' }} className='me-3' /> Prix : </h6>

            <p className='mt-2'>
         {event.price}  {getCurrencyFlag(event.currency)}</p>
         </div>
          ) : (
            <div>
            <h6 className='mt-3'><FontAwesomeIcon icon={faDollarSign} style={{ color: '#7447FF' }} className='me-3' /> Prix : </h6>

           <p className='mt-2'>
           Gratuit</p>
           </div>
          )}

          {event.unsubscribeDeadline && (
            <div className='mt-3'>
              <h6><FontAwesomeIcon icon={faCalendarTimes} style={{ color: '#7447FF' }} className='me-2' /> Date limite d'annulation :</h6>
              <p className='mt-2'>{remainingTime}</p>
            </div>
          )}

          <div>
            {userId === event.organizer._id ? (
                <>
                    <button className="btn btn-secondaire mt-3" onClick={() => { showWaitingListModal(); showWaitingListGet(event._id) }}>Waiting List ({event.waitingList.length})</button>
                    <button className="btn btn-outline-custom-secondaire mx-2 mt-3" onClick={() => { showParticipantsListModal(); showParticipantsListGet(event._id) }}>Participants List ({event.participants.length})</button>
                    {event.profileType === 'private' && (
                        <button className="btn btn-secondaire  mt-3" onClick={() => {setShowShareModal(true);fetchFriends();}}>
                            <FontAwesomeIcon icon={faPlus} className='me-2' style={{ color: '#fff' }} />  Invitez vos amis !
                        </button>
                    )}

                    <button className='btn btn-outline-danger ms-2 mt-3' onClick={() => setShowConfirmationModal(true)} name='Supprimer' >        <FontAwesomeIcon icon={faTrash} />                    </button>
                    <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette activité ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmation}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
                </>
            ) : (
                <>
                    {event.unsubscribeDeadline && new Date(event.unsubscribeDeadline) <= new Date() ? (
                        <button className="btn btn-secondaire" disabled>Expired</button>
                    ) : isInWaitingList ? (
                        <button className="btn btn-outline-custom-secondaire"  disabled={new Date(event.unsubscribeDeadline) <= new Date() }      onClick={() => setShowConfirmation(true)} > Cancel</button>
                    ) : isInParticipants ? (
                        <button className="btn btn-outline-custom-secondaire" disabled={new Date(event.unsubscribeDeadline) <= new Date() }  onClick={() => unsubscribeFromparticipants(id)}  >Leave</button>
                    ) : !token ? (
                        <Link to="/login" onClick={handleLinkClick}>
                            <button className="btn btn-secondaire-per mt-3">Join</button>
                        </Link>
                    ) : (
                     <>
                     


                        <button className="btn btn-secondaire" onClick = {()=>participateInActivityAndCheck(id)} disabled={ new Date(event.unsubscribeDeadline) <= new Date() }> <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Join </button>
                        </>
                    )}

                    {token &&
                    <button className="btn btn-outline-danger mx-3" onClick={() => setShowReportModal(true)} disabled={hasReported} >
                        <FontAwesomeIcon icon={faFlag} className="me-2" /> Signaler
                    </button>
                  }
                    {token && event.profileType === 'private' && (
                        <button className="btn btn-outline-custom-secondaire " onClick={() => {setShowShareModal(true);fetchFriends();}}>
                            <FontAwesomeIcon icon={faShareAlt} className="me-2" /> Partager
                        </button>
                  
                    )}
                </>
            )}
           
        </div>



        <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Signaler l'activité</Modal.Title>
        </Modal.Header>
        <Modal.Body>



            {reportReasons.map((reason, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`reason-${index}`}
                  name="reportReason"
                  value={reason}
                  className="form-check-input me-2"
                  checked={selectedReason === reason} 

                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <label htmlFor={`reason-${index}`}>{reason}</label>
              </div>
            ))}


            <p className='mt-5'>Êtes-vous sûr de vouloir signaler cette activité ?</p>


        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
                Non
            </Button>
            <Button variant="danger" onClick={handleReport}>
                Oui
            </Button>
        </Modal.Footer>
    </Modal>

    <Modal show={showReportModalComment} onHide={() => setShowReportModalComment(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Signaler le commentaire</Modal.Title>
    </Modal.Header>
    <Modal.Body>



        {reportReasons.map((reason, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`reason-${index}`}
              name="reportReason"
              value={reason}
              className="form-check-input me-2"
              checked={selectedReason === reason} 

              onChange={(e) => setSelectedReason(e.target.value)}
            />
            <label htmlFor={`reason-${index}`}>{reason}</label>
          </div>
        ))}


        <p className='mt-5'>Êtes-vous sûr de vouloir signaler ce commentaire ?</p>


    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowReportModalComment(false)}>
            Non
        </Button>
        <Button variant="danger" onClick={handleReportComment}>
            Oui
        </Button>
    </Modal.Footer>
</Modal>


    <Modal show={showShareModal} onHide={() =>{ setShowShareModal(false) ;setCopySuccess('');}} >
        <Modal.Header closeButton>
            <Modal.Title>Partager l'activité</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
           {friends.length > 0 && <p>Sélectionnez les amis à inviter :</p>}


            {friends.length === 0 && (
              <div>
                <p><FontAwesomeIcon icon={faUsersSlash} style={{color:'#7447FF'}} /> Aucun ami disponible pour l'invitation. </p>
               
    
              </div>
            )}


            {friends && friends.map(friend => (
            


                <li key={friend._id} className="list-group-item d-flex align-items-center justify-content-between">
                <div onClick={() => { window.location.href = `/profile/${friend.username}` }} style={{cursor:'pointer'}} > 
                  <div className="d-flex align-items-center">
                    <img src={`http://localhost:5000/images/${friend.profilePicture}`} alt="Profile" className="me-3" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <div>
                      <p className="mb-0">{friend.firstName} {friend.lastName}</p>
                      <p className="mb-0 text-muted">@{friend.username}</p>
                    </div>
                  </div>
                  </div>

                  <button className="btn btn-outline-custom-secondaire ms-2" onClick={() => handleInvite(friend.username)}>
                  {invitationsSent[friend.username] && Date.now() < invitationsSent[friend.username] ? 'Invitation envoyée' : 'Inviter'}
                  </button>
                  </li>
            ))}

            <p className='fw-bold mt-4'>Informations supplémentaires</p>
            <p> <FontAwesomeIcon icon={faUserFriends}  style={{color:'#7447FF'}}/> Ajoutez des amis pour pouvoir les inviter.</p>
            <p> <FontAwesomeIcon icon={faInfoCircle} style={{color:'#7447FF'}} /> Consultez votre liste d'amis pour choisir qui inviter.</p>
            <p><FontAwesomeIcon icon={faUserCheck}  style={{color:'#7447FF'}}/> Cliquez sur le bouton "Inviter" pour envoyer une invitation à un ami sous forme de message. </p>
            <p><FontAwesomeIcon icon={faExclamationTriangle} style={{color:'#7447FF'}} /> Les amis doivent être actifs pour recevoir votre invitation. </p>
           

            <div className="mt-4">
            <p>Vous pouvez également partager l'événement en utilisant les options disponibles sur cette page.</p>
            <p>Copiez l'URL de cette page en cliquant sur l'icône à droite :               <FontAwesomeIcon icon={faCopy} style={{color:'#7447FF'}} />            </p>

            <div className="d-flex align-items-center">
            <input id="urlInput" type="text" className="form-control me-2" value={window.location.href} readOnly />
            <button style={{textDecoration:'none'}} className="btn btn-secondaire" onClick={copyToClipboard}>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
          
            {copySuccess && <span style={{color:'#1e2455'}}>{copySuccess}</span>}
          </div>
          
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() =>{ setShowShareModal(false) ;     setCopySuccess('');  }}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
          <Modal show={showWaitingList} onHide={() => setShowWaitingList(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Waiting List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {waitingList.length === 0 ? (
            <p>Aucune personne en attente pour le moment. Partagez cet événement pour attirer plus de participants !</p>
        ) : (
          waitingList.map(person => (
            <div key={person.userId} className="d-flex align-items-center mb-3">
              <img src={`http://localhost:5000/images/${person.profilePicture}`} alt="Profile" style={{ width: '50px', aspectRatio:'3/3', borderRadius: '50%' }} className="me-3" />
              <div>
              <Link to={`/profile/${person.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>  <p>{person.firstName} {person.lastName}</p> </Link>
              <Button className={`btn btn-secondaire ${new Date(event.unsubscribeDeadline) <= new Date() || !event.visibility ? 'disabled' : ''}`} onClick={() => handleAccept(event._id, person.userId)}>Accepter</Button>
              </div>
            </div>
        ))
    )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWaitingList(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    
        {/* Modal pour afficher la liste des participants */}
        <Modal show={showParticipantsList} onHide={() => setShowParticipantsList(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Participants List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {participantsList.length === 0 ?(

            <p>Aucun participant pour l'instant. Soyez le premier à organiser cet événement et inspirez les autres à vous rejoindre pour une expérience unique !</p>
        ):(
          participantsList.map(person => (
            <div key={person.userId} className="d-flex align-items-center mb-3">
              <img src={`http://localhost:5000/images/${person.profilePicture}`} alt="Profile" style={{ width: '50px', aspectRatio:'3/3', borderRadius: '50%' }} className="me-3" />
              <div>
              <Link to={`/profile/${person.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>  <p>{person.firstName} {person.lastName}</p> </Link>
                <Button className={`${new Date(event.unsubscribeDeadline) <= new Date() || !event.visibility ? 'disabled' : ''}`} variant="danger" onClick={() => handleRemove(event._id,person.userId)}>Supprimer</Button>
              </div>
            </div>
        ))
    )}

           </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowParticipantsList(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        </div>
      </div>
      <div className="row mt-5">

      <div className={`col-lg-6 ${window.innerWidth >= 992 ? 'border-end' : 'border-bottom'} mb-3`}>
      <h5>
      <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#7447FF' }} className="me-2" />
      Description
    </h5>
          <h6 className="mt-3 mb-3" style={{ textAlign: 'justify' }}>{event.description}</h6>

          </div>


          <div className='col-lg-6 '>
          <h5>
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#7447FF' }} className="me-2" />
          Catégories
        </h5>
        <div className="d-flex flex-wrap mt-3">

        {event.category.map((category, index) => (
          <div key={index} className="me-3 mb-3">
          <Link to={`/upcoming?category=${category}`} style={{ textDecoration: 'none' , color: 'inherit'}} onClick={handleLinkClick}>

            <FontAwesomeIcon icon={categoryIcons[category]} style={{ color: '#7447FF' }} className="me-2" />
            <span>{category}</span>
            </Link>
          </div>
        ))}    
              </div>
              </div>

    </div>
    <hr className='mt-5 mb-3'></hr>
    <div className="row mt-5">
    <span className='mb-3 fw-bold'>Commentaires</span>
    {!isInParticipants && !isInWaitingList && !userId === event.organizer._id &&
    <p>Aucun commentaire pour le moment. Il faut rejoindre l'activité pour pouvoir commenter </p>}

 {(isInParticipants || isInWaitingList || userId === event.organizer._id) &&  <span className='mb-3'>Nombre total de commentaires : {total}</span>}
 {!isInParticipants && !isInWaitingList && userId !== event.organizer._id && (
  <span>
  <FontAwesomeIcon icon={faInfoCircle} className="me-2" style={{ color: '#7447FF' }} />

    Pour ajouter des commentaires, vous devez d'abord rejoindre la liste des participants.
    Pour simplement consulter les commentaires, vous devez être dans la liste d'attente.
  </span>
)}

    {!comment.length && isInParticipants && isInWaitingList  ? (
      <p>Aucun commentaire pour le moment.</p>
    ) : ( (isInParticipants || isInWaitingList || userId === event.organizer._id )&&
      comment.map((comment, index) => (
        <div key={index} className="col-lg-12">
          <div className="card mb-3 commentairecard">
            <div className="card-body">
            <div className='d-flex'>
            <img src={`http://localhost:5000/images/${comment.user.profilePicture}`} className='me-3' alt="Selected" width={'30px'} />
              <h6 className="card-title mt-2">{comment.user.firstName} {comment.user.lastName}</h6>
              </div>
              <p className="card-text mt-3 ms-2">{comment.content}</p>

            </div>
            <div className="card-footer">
            <div className='text-start text-muted'>
              {new Date(comment.date).toLocaleString()} 
              </div>
              {comment.user._id !== userId &&
              <div className='text-end' >
              <button className="btn btn-outline-danger mx-3 comment-button" onClick={() => { setShowReportModalComment(true); setIdComment(comment._id)}} >
              <FontAwesomeIcon icon={faFlag} className="me-2" /><span className="button-text"> Signaler </span>
          </button>

                        </div>
              }
            </div>
          </div>
        </div>
      ))
    )}
  </div>
  {isLoading && <p>Chargement des commentaires...</p>}
  {comment.length > 0 && (isInParticipants || isInWaitingList || userId === event.organizer._id)  &&   (
    <button className='btn  btn-outline-custom-secondaire mt-2' onClick={loadMoreComments}>Afficher plus</button>
  )}
    {isInParticipants &&  new Date(event.unsubscribeDeadline) > new Date() &&
      <div className="row mt-5 mb-5">
        <div className="col-lg-12 ">
        <form onSubmit={handleSubmitComment} className='d-flex'>

          <input type="text" className='form-control' placeholder="Ajouter un commentaire..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button className="btn btn-secondaire">Commenter</button>
       </form>
          </div>
      </div>
    }


    {userId === event.organizer._id  && comment.length >= 1 && event.participants.length>=1 && new Date(event.unsubscribeDeadline) > new Date() &&
      <div className="row mt-5 mb-5">
        <div className="col-lg-12 ">
        <form onSubmit={handleSubmitComment} className='d-flex'>

          <input type="text" className='form-control' placeholder="Ajouter un commentaire..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button className="btn btn-secondaire">Commenter</button>
       </form>
          </div>
      </div>
    }
    
    

    </div>
  );
}

export default EventDescription;





