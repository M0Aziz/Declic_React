import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Navbar.css';
import { faUser, faEnvelope, faBell, faBars, faSearch, faCircle, faComment, faUserFriends, faUserPlus, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import Logo from '../télécharger.png'
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const socket = io('http://localhost:5000');

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const isAuthenticated = localStorage.getItem('token');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isnavbarDropdownBars, setnavbarDropdownBars] = useState(false);
const username = localStorage.getItem('username');
const location = useLocation();
const [friendList, setFriendList] = useState([]);

const [conversations, setConversations] = useState([]);
const [keyword, setKeyword] = useState('');
const history = useNavigate();

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};

const handleSearch = () => {
  if (keyword.length >= 2) {
    navigate(`/search/${keyword}`);
  } else {
    // Affichez un message d'erreur si le mot-clé est trop court
    const message = 'Le mot-clé doit comporter au moins deux caractères';
    toast.error(message);
  }
};


const handleLogout = async () => {
  try {
      // Récupérer le token depuis le stockage local
      const token = localStorage.getItem('token');

      // Envoyer une requête POST à l'API /users/logout avec le token d'authentification
      const response = await axios.post('http://localhost:5000/users/logout', {}, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      // Vérifier si la déconnexion a réussi
      if (response.status === 200) {
          // Effacer les données du stockage local
          localStorage.removeItem('token');
          localStorage.removeItem('firstTime');
          localStorage.removeItem('username');
          localStorage.removeItem('role');

          // Rediriger vers la page de connexion
          window.location.href = '/login';
      } else {
          console.error('Failed to logout:', response.data.error);
      }
  } catch (error) {
      console.error('Error during logout:', error);
  }
};
 

  const toggleProfileDropdown = () => {

      // Fermer tous les dropdowns sauf celui cliqué
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  dropdowns.forEach(dropdown => {
    if (dropdown.id !== 'profileDropdown') {
      dropdown.classList.remove('show');
    }
  });

  // Ouvrir ou fermer le dropdown actuel
    setIsProfileDropdownOpen(prevState => !prevState);
  };
  
  const toggleMessageDropdown = () => {

      // Fermer tous les dropdowns sauf celui cliqué
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  dropdowns.forEach(dropdown => {
    if (dropdown.id !== 'MessageDropdown') {
      dropdown.classList.remove('show');
    }
  });

  // Ouvrir ou fermer le dropdown actuel
    setIsMessageDropdownOpen(prevState => !prevState);
  };
  
  const toggleNotificationDropdown = () => {
      // Fermer tous les dropdowns sauf celui cliqué
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  dropdowns.forEach(dropdown => {
    if (dropdown.id !== 'NavbarDropdown') {
      dropdown.classList.remove('show');
    }
  });

  // Ouvrir ou fermer le dropdown actuel
    setIsNotificationDropdownOpen(prevState => !prevState);
  };
  
  const togglenavbarDropdownBars = () => {
  // Fermer tous les dropdowns sauf celui cliqué
  const dropdowns = document.querySelectorAll('.dropdown-menu.show');
  dropdowns.forEach(dropdown => {
    if (dropdown.id !== 'navbarDropdownBars') {
      dropdown.classList.remove('show');
    }
  });

  // Ouvrir ou fermer le dropdown actuel
  setnavbarDropdownBars(prevState => !prevState); 
 };

  
  const closeAllDropdowns = () => {
    setIsProfileDropdownOpen(false);
    setIsMessageDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setnavbarDropdownBars(false);
  };



  const handleNotificationClickAll = async () => {
    try {
      const notificationIds = notifications.map(notification => notification._id);
      await axios.put('http://localhost:5000/notifications/markAllAsRead', { notificationIds });
      setNotifications(prevNotifications => {
        return prevNotifications.map(notification => {
          return { ...notification, vu: true };
        });
      });
        } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de toutes les notifications:', error);
    }
  };
  
  const handleAcceptFriendRequest = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/profiles/followers/private/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajoutez votre token JWT ici
            },
            body: JSON.stringify({ action: 'accept' })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'acceptation de la demande d\'ami');
        }

        const message = 'La demande a été acceptée avec succès.';
        toast.success(message);
        // Rafraîchir la liste des amis après l'acceptation de la demande
        fetchFriendList();
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande d\'ami :', error.message);
    }
}

const handleDeclineFriendRequest = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/profiles/followers/private/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajoutez votre token JWT ici
            },
            body: JSON.stringify({ action: 'delete' })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du refus de la demande d\'ami');
        }

        // Rafraîchir la liste des amis après le refus de la demande
        fetchFriendList();
    } catch (error) {
        console.error('Erreur lors du refus de la demande d\'ami :', error.message);
    }
}


  const Profile = ()=>{

    window.location.href= `/profile/${username}`;

  }
  
  const handleNotificationClick = async (notification) => {
    // Marquer la notification comme vue (s'il n'est pas déjà marqué)

      if (!notification.vuByUser) {
        try {
          await axios.put(`http://localhost:5000/notifications/${notification._id}/markAsRead`);
          // Mettre à jour l'état uniquement si la notification a été marquée comme lue avec succès
          setNotifications(prevNotifications => {
            return prevNotifications.map(prevNotification => {
              if (prevNotification._id === notification._id) {
                return { ...prevNotification, vu: true };
              } else {
                return prevNotification;
              }
            });
          }); 
        }catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la notification:', error);
      }
    }
    
    if ( notification.type === 'add_friends_private-accepet'){
    // Naviguer vers l'URL spécifique de la notification
    window.location.href= `/profile/${notification.content}`;
    }else if (notification.type === 'new-commentaire' || notification.type === 'participation_request'){

      window.location.href= `/event/${notification.content}`;


    }else if (notification.type === 'participation_accepted' ||  notification.type === 'participation_removed' ||  notification.type === 'participation_not_valid') {
      const eventId = notification.content.split('-')[0];
      
      window.location.href = `/event/${eventId}`;
    }
    
   // window.location.reload();
  };



const handleVubyUserClick = async (friend) => {
  // Marquer la notification comme vue (s'il n'est pas déjà marqué)
  if (!friend.vuByUser) {
    try {
      await axios.put(`http://localhost:5000/profiles/friends/${friend._id}/markAsRead`, {
      }, {
         headers: {
           Authorization: `Bearer ${localStorage.getItem('token')}`
         }
       });
      // Mettre à jour l'état uniquement si la notification a été marquée comme lue avec succès
      setFriendList(prevFriendList => {
        return prevFriendList.map(prevFriend => {
          if (prevFriend._id === friend._id) {
            return { ...prevFriend, vuByUser: true };
          } else {
            return prevFriend;
          }
        });
      }); 
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la notification:', error);
    }
  }

  console.log(friend.username);
  // Naviguer vers l'URL spécifique de la notification
  window.location.href= `/profile/${friend.username}`;
 // navigate(`/profile/${friend.username}`);
};


  const fetchFriendList = async () => {
    try {
        const response = await axios.get('http://localhost:5000/profiles/Friend/get', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFriendList(response.data);
        console.log(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste des amis :", error);
    }
};


const fetchConversations = async () => {
  try {
    const response = await axios.get('http://localhost:5000/messages/navbarMessage', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    setConversations(response.data);
    console.log('setConversations',response.data);
  } catch (error) {
    console.error('Error fetching conversations:', error);
  }
};

const token = localStorage.getItem('token');

const fetchNotifications = async () => {
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken._id;
    const response = await axios.get(`http://localhost:5000/notifications/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setNotifications(response.data.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};
  useEffect(() => {
    if (isAuthenticated) {

      const checkTokenAndUsername = async () => {
        try {
        
               // Envoyer une requête au backend pour vérifier le token
          const response = await axios.get('http://localhost:5000/users/auth/check-token', {
            headers: {
              'Authorization': `Bearer ${isAuthenticated}`
            }
          });
      
         
          const { usernameBack } = response.data; // Récupérer le nom d'utilisateur depuis la réponse
      
          if (usernameBack !== username) {
            localStorage.setItem('username', usernameBack);
          }
          
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          if (error.response && error.response.status === 401) {
            if (['Token expiré', 'Token invalide'].includes(error.response.data.error)) {
              handleInvalidToken();

            } else {
              console.error('Erreur d\'authentification:', error.response.data.error);
            }
          } else {
            console.error('Erreur du serveur:', error.response ? error.response.data.error : error.message);
          }
        }
      };

      const handleInvalidToken = () => {

        localStorage.setItem('showSessionExpiredModal', 'true'); 
      };

      checkTokenAndUsername();

   


   
  
      const handleNewNotification = async (notification) => {
        const notificationExists = notifications.some(n => n._id === notification._id);
        if (!notificationExists) {
          await fetchNotifications();
        }
      };

      const handleNewFriends = async (friend) => {
        const friendExists = friendList.some(n => n._id === friend._id);
        if (!friendExists) {
          await fetchFriendList();
        }
      };

      const handleNewMessage = async (conversation) => {
        const conversationExists = conversations.some(conv => conv._id === conversation._id);
        if (!conversationExists) {
          await fetchConversations();
          await fetchNotifications();

        }
      };
      

      fetchFriendList();
      fetchConversations();
  
  
        fetchNotifications();
  
      socket.on('connect', () => {
        console.log('Connecté au serveur websocket');
      });
  

      socket.on('newNotification', (notification) => {
        handleNewNotification(notification);
        handleNewFriends(notification);
      });
      
      socket.on('newMessage', (conversation) => {
        handleNewMessage(conversation);
        handleNewNotification(conversation);
      });
      

      return () => {
        socket.off('newNotification', handleNewNotification);
        socket.off('newMessage', {handleNewNotification,handleNewMessage});

      };
    }





  }, [isAuthenticated, location.pathname]);
  



  useEffect(() => {


    if (i18n.language) {
        setLanguageInitialized(true);
    }
  }, [i18n.language]);
  
  if (!languageInitialized) {
    return null; 
  }


  const markNotificationsAsReadMessage = async () => {
    try {
      await axios.put('http://localhost:5000/messages/mark', {
     }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Mettre à jour localement les notifications après les avoir marquées comme lues
      setNotifications(
        notifications.map(notification => {
          if (notification.type === 'new_message') {
            return {
              ...notification,
              vuByUser: true
            };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error('Erreur lors du marquage des notifications comme lues :', error);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


// Définir une fonction pour formater la date
const formatDateCon = (date) => {
  let dateFormate ='' ;
  if (date) {
    const messageDate = moment(date);
    const currentDate = moment();

    if (currentDate.diff(messageDate, 'days') < 1) {
      // Si le message a été envoyé aujourd'hui, afficher l'heure et les minutes
      dateFormate = messageDate.format('HH:mm');
    } else {
      // Sinon, afficher la date au format DD/MM/YYYY
      dateFormate = messageDate.format('DD/MM/YYYY');
    }
  }
  return dateFormate;
};

// Utilisation de la fonction formatDate avec la date du dernier message



  return (

    
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ boxShadow: '0px 0px 10px 0.3px rgba(0, 0, 0, 0.3)' }}>
    
    <div className="container">
      <Link className="navbar-brand" to="/">
      <img src={Logo} alt="Logo" width={'150px'}/>
    </Link>

  
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

      
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mx-auto me-auto mb-2 mb-lg-0 text-capitalize">
        <li className="nav-item">
        <a className="nav-link" href="/">{t('navbar.home')}</a>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown" data-bs-toggle="dropdown"  role="button" aria-expanded="false">{t('navbar.event')}</a>
        <ul className="dropdown-menu">

        {isAuthenticated &&
         <div>
          <li><a className="dropdown-item" href='/myevents' title={t('navbar.my-events')}>{t('navbar.my-events')}</a></li>
          <li><a className="dropdown-item" href='/joined'  title={t('navbar.joined')} >{t('navbar.joined')}</a></li>
          <li><a className="dropdown-item"   href='/upComing'  title={t('navbar.upcoming')}>{t('navbar.upcoming')}</a></li>

          </div>
        }
        {!isAuthenticated &&

          <li><a className="dropdown-item"   href='/upComingGuest'  title={t('navbar.upcoming')}>{t('navbar.upcoming')}</a></li>
        }
        </ul>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/about_us">{t('navbar.aboutUs')}</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/contact">{t('navbar.contactUs')} </a>
      </li>
      


      </ul>

          
       
        {isAuthenticated && (

<>   

<li className="nav-item list-unstyled">
          <Link className="nav-link search-container " >
          <input type="text" className="search-input" value={keyword} onChange={e => setKeyword(e.target.value)}   onKeyDown={handleKeyDown} placeholder="Recherche..." />

            <FontAwesomeIcon icon={faSearch}  style={{color:'#7447FF'}} className="search-icon mx-2"/>
          </Link>
        </li>
        <li className="nav-item dropdown list-unstyled">
        <a className="nav-link dropdown mx-3" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"   onClick= {() =>{toggleProfileDropdown();handleNotificationClickAll()}}>
          <FontAwesomeIcon icon={faUser} style={{ color: '#7447FF' }} />
          {Array.isArray(notifications) && notifications.filter(notification => !notification.vu && (notification.type === 'add_friends' || notification.type === 'add_friends_private' )).length > 0 && <span className="badge bg-danger">{notifications.filter(notification => !notification.vu && (notification.type === 'add_friends' || notification.type === 'add_friends_private')).length}</span>}

          </a>
        <ul className={`dropdown-menu dropdown-menu-start ${isProfileDropdownOpen ? 'show' : ''}`} aria-labelledby="profileDropdown" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      
        {Array.isArray(friendList) && friendList.length > 0 ? (
            <li className="mt-2">
                <h6 className="dropdown-header">Demandes d'amis</h6>
                <ul className="list-unstyled">
                    {friendList.map(friend => (
                        <li key={friend._id}   className={` mt-2 m-3 ${friend.vuByUser ? '' : 'bg_personalized'}`}>
                        <div className="dropdown-item" >
                        <div className="friend-info" style={{ display: 'flex', alignItems: 'center', cursor:'pointer' }} onClick={() => { handleVubyUserClick(friend)}}>
                            <img src={`http://localhost:5000/images/${friend.user.profilePicture}`} alt={friend.user.firstName} style={{ width:'40px', height:'40px', marginRight: '10px' }} className="friend-avatar" />
                            <div className="friend-details">
                                <div className='fw-bold'>{friend.user.firstName} {friend.user.lastName}</div>
                            </div>
                        </div>
                        {friend.status === 'O' ? (
                            <div>à commence à vous suivre.</div>
                        ) : friend.status === 'N' ? (
                            <div className='mt-1'> 
                            <p>Demande à vous suivre.</p>
                            <button className="btn btn-secondaire me-2" onClick={() => handleAcceptFriendRequest(friend.user._id)}>Accepter</button>
                                <button className="btn btn-primaire" onClick={() => handleDeclineFriendRequest(friend.user._id)}>Supprimer</button>
                            </div>
                        ) : null}
                        <div className="text-end mt-2 text-muted">
                            {formatDate(friend.date)}
                        </div>
                    </div>
                    
                    
                        </li>
                      ))}

                      </ul>
            </li>
          ) : (
            <li className="mt-2">
                <h6 className="dropdown-header">Demandes d'amis</h6>
                <p className="text-muted mx-2 mt-3">Vous n'avez pas de demande d'amis.</p>
            </li>
        )}
    </ul>
      </li>
      

      <li className="nav-item dropdown list-unstyled">
      <a className="nav-link dropdown mx-3" id="messageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"  onClick = {() => {toggleMessageDropdown();markNotificationsAsReadMessage()}}>
        <FontAwesomeIcon icon={faEnvelope}  style={{color:'#7447FF'}} /> 
        {Array.isArray(notifications) && notifications.filter(notification => !notification.vuByUser && notification.type === 'new_message').length > 0 && <span className="badge bg-danger">{notifications.filter(notification => !notification.vuByUser && notification.type === 'new_message').length}</span>}
      </a>
      <ul className={`dropdown-menu dropdown-menu-start ${isMessageDropdownOpen ? 'show' : ''}`} aria-labelledby="messageDropdown" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      {Array.isArray(conversations) && conversations.length > 0 ? (
        <li className="mt-2">

      {conversations.map(conversation => (
        <li key={conversation.id} style={{cursor:'pointer', backgroundColor: conversation.unreadCount > 0 ? '#f2f2f2' : ''  }}  onClick={() => { window.location.href = `/messages/${conversation.username}`; }} >

        <div className="message-item" style={{ width: '300px' }}>
        <img src={`http://localhost:5000/images/${conversation.profilePicture}`} style={{width:'30px'}} alt="Profile" className="message-photo mx-2 mt-2" />
        <span className="fw-bold  message-name">{conversation.firstName} {conversation.lastName}</span>
          </div>
          <div className='d-flex justify-content-between mt-2'>

          {conversation.lastMessage && (
            <div>
              {conversation.lastMessage.type === 'image' ? (
                <p className="message-text ms-5 text-justify ">Image</p>
              ) : conversation.lastMessage.type === 'voice' ? (
                <p className="message-text ms-5 text-justify">Vocale</p>
              ) : (
                <p className="message-text ms-5 text-justify" style={{ textAlign: 'justify' }}>
                  {conversation.lastMessage.content.length > 20 ? conversation.lastMessage.content.substring(0, 12) + '...' : conversation.lastMessage.content}
                </p>
              )}
            </div>
          )}
          
          {conversation.unreadCount > 0 ? (
            <span className='ms-auto me-5' style={{ backgroundColor: 'gray', color: 'white', width: '20px', height: '25px', borderRadius: '50%', textAlign: 'center', lineHeight: '25px' }}>{conversation.unreadCount}</span>
          ) : (
            <span className='ms-auto me-5 text-muted'>{formatDateCon(conversation.lastMessage.date)}</span>
          )}
          </div>
          <hr></hr>
        </li>
      ))}
     
     

        </li>
      ) : (
        <li className="mt-2">
            <h6 className="dropdown-header">Messages</h6>
            <p className="text-muted mx-2 mt-3">Vous n'avez pas de Message.</p>
        </li>
    )}
  
    <li>
    <a href="/messages" className="dropdown-item text-center mt-4 btn-secondaire">Voir tout</a>
  </li>

      </ul>
   
    </li>
    <li className="nav-item dropdown list-unstyled">
    <a className="nav-link dropdown mx-3" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"  onClick= {() =>{toggleNotificationDropdown();handleNotificationClickAll()}}> 
    <FontAwesomeIcon icon={faBell}  style={{color:'#7447FF'}}  />
    {Array.isArray(notifications) && notifications.filter(notification => !notification.vu && (notification.type === 'add_friends_private-accepet' || notification.type === 'new-commentaire'|| notification.type === 'participation_request'|| notification.type === 'participant_unsubscribed'   || notification.type === 'participation_accepted'|| notification.type === 'participation_removed'   || notification.type === 'waitinglist_unsubscribed' ||  notification.type === 'participation_not_valid')).length > 0 && 
    <span className="badge bg-danger">{notifications.filter(notification => !notification.vu && (notification.type === 'add_friends_private-accepet'  || notification.type === 'new-commentaire' || notification.type === 'participation_request'|| notification.type === 'participant_unsubscribed' || notification.type === 'participation_accepted'|| notification.type === 'participation_removed' || notification.type === 'waitinglist_unsubscribed' ||  notification.type === 'participation_not_valid')).length}</span>}

      </a>
      {Array.isArray(notifications) && notifications.length > 0 ? (
        <ul className={`dropdown-menu dropdown-menu-start notification ${isNotificationDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown" style={{ maxHeight: '500px',maxWidth:'700px', whiteSpace:'normal', wordWrap:'break-word', overflowY: 'auto' }}>
        {notifications.map(notification => {
          if (notification.type === 'add_friends_private-accepet' ) {
            return (
        <>

              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} style={{cursor:'pointer'}}>
              <p className="" onClick={() => handleNotificationClick(notification)}  style={{  whiteSpace:'normal', wordWrap:'break-word'}} >
              <FontAwesomeIcon icon={faUserFriends} style={{ color: '#7447FF' }} className="me-2" />

              Vous avez un nouvel ami ! {notification.content} vous suit maintenant.
              </p>
              <div className='text-end'>
              <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
              </div>
            </li>
            <hr></hr>
            </>
            );
          } else if (notification.type === 'new-commentaire') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} style={{cursor:'pointer'}}>
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}} >
                <FontAwesomeIcon icon={faComment} style={{ color: '#7447FF' }} className="me-2"  />

                  Vous avez un nouveau commentaire sur une activité ! 
                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }


          else if (notification.type === 'participant_unsubscribed') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} >
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}} >
                <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#7447FF' }} className="me-2" />

                  {notification.content }
                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }

          else if (notification.type === 'waitinglist_unsubscribed') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`}  >
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}} >
                <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#7447FF' }} className="me-2" />

                  {notification.content }
                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }

         

          else if (notification.type === 'participation_removed') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} style={{cursor:'pointer'}}>
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}}>
                <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#7447FF' }} className="me-2" />

                {notification.content.split('-').slice(1).join('-')}
                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }


           else if (notification.type === 'participation_not_valid') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} style={{cursor:'pointer'}}>
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}}>
                <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#7447FF' }} className="me-2" />

                {notification.content.split('-').slice(1).join('-')}
                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }
          else if (notification.type === 'participation_accepted') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} style={{cursor:'pointer'}}>
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}} >
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#7447FF' }} className="me-2" />

                {notification.content.split('-').slice(1).join('-')}
                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }
          else if (notification.type === 'participation_request') {
            return (
              <>
              <li key={notification._id} className={` dropdown-item mt-2 ${notification.vuByUser ? '' : 'bg_personalized'}`} style={{cursor:'pointer'}}>
                <p className="" onClick={() => handleNotificationClick(notification)} style={{  whiteSpace:'normal', wordWrap:'break-word'}} >
                <FontAwesomeIcon icon={faUserPlus} style={{ color: '#7447FF' }} className="me-2" />

                Vous avez une nouvelle demande de participation !
                                </p>
                <div className='text-end'>
                <span className='me-3 text-muted'>{new Date(notification.date).toLocaleString()}</span>
                </div>
              </li>
              <hr></hr>
              </>
            );
          }
        })}
        
        </ul>
      ) : (
        <ul className={`dropdown-menu dropdown-menu-start ${isNotificationDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">

       <li> <p className='text-center mx-2'>Vous n'avez pas de notifications.</p></li>

        </ul>
      )}
    </li>


    <li className="nav-item dropdown list-unstyled">
                <a className="nav-link dropdown mx-3"  id="navbarDropdownBars" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={togglenavbarDropdownBars}>
                  <FontAwesomeIcon icon={faBars}   style={{color:'#7447FF'}}/>
                </a>
                <ul className={`dropdown-menu dropdown-menu-start ${isnavbarDropdownBars ? 'show' : ''}`} aria-labelledby="navbarDropdownBars">
                <li>
                   <h6 className="dropdown-item">Hello! {username}</h6>
                  </li> 
                  <hr></hr>
                <li>
                    <Link className="dropdown-item" onClick= {() =>{closeAllDropdowns();Profile()}} >
                      Profile
                    </Link>
                  </li>
                  <li>
                  <Link className="dropdown-item" onClick={() => { handleLogout(); closeAllDropdowns(); }}>
                  Logout
                    </Link>
                  </li>
                </ul>
              </li>
    </> 
    )}

          
          
         
            {!isAuthenticated && (
              <>

              <li className="nav-item dropdown list-unstyled">
              <a className="nav-link dropdown mx-3"  id="navbarDropdownBars" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={togglenavbarDropdownBars}>
                <FontAwesomeIcon icon={faBars}  style={{color:'#7447FF'}} />
              </a>
              <ul className={`dropdown-menu dropdown-menu-start ${isnavbarDropdownBars ? 'show' : ''}`} aria-labelledby="navbarDropdownBars">
                <li>
                <Link className="dropdown-item" onClick={closeAllDropdowns} to="/register">
                {t('navbar.Sign_Up')}
                
                </Link>
                </li>
                <li>
                <Link onClick={closeAllDropdowns} className="dropdown-item" to="/login">
                {t('navbar.Sign_In')}
              </Link>
                </li>
              </ul>
            </li>
             
              </>
            )}
           
        </div>


      </div>


      {/* <ToastContainer /> */}

    </nav>
  );
};

export default Navbar;
