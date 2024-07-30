import React, { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Messages.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faExclamationTriangle, faFlag, faImage, faMicrophone, faStop  } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'; //  formater la date
import image1 from '../19197471.jpg'
import socketIOClient from 'socket.io-client';
import messageSound from '../Message.mp3';

import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

import Linkify from 'react-linkify';

const socket = io('http://localhost:5000');
function Messages() {

  const [audio] = useState(new Audio(messageSound));

  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { username: usernameParam } = useParams();
  const history = useNavigate();
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);
const token = localStorage.getItem('token');
const decodedToken = jwtDecode(token);
const userId = decodedToken._id; 
const [lastUser, setLastUser] = useState(null);
const messagesContainerRef = useRef(null);
const [username, setUsername] = useState('');
const [messageType, setMessageType] = useState('text'); // 'text', 'image' or 'voice'
const [imageFile, setImageFile] = useState(null);
const [voiceFile, setVoiceFile] = useState(null);
const [isRecording, setIsRecording] = useState(false);
const [isTyping, setIsTyping] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [initialUsers, setInitialUsers] = useState([]);
const [isOtherTyping, setIsOtherTyping] = useState(false);
const [showReportModal, setShowReportModal] = useState(false);
const [selectedReason, setSelectedReason] = useState('Spam');;

const [idMessage , setIdMessage]=useState('');


useEffect(() => {
    setUsername(usernameParam);
    console.log('userpara',usernameParam)
  }, [usernameParam]);
// Dans votre composant
useEffect(() => {
  const messagesContainer = messagesContainerRef.current;
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    markMessagesAsRead(username);

  }
}, [messages]);
useEffect(() => {
    if (!username) {
      loadUsersWithMessages();
    } else {
      loadMessagesWithUser(username);
      loadRecipientDetails(username);
      
    }
  }, [username]);
  
console.log('messageSound',messageSound)
  const handleMessageClick = (index) => {
    if (index === activeMessageIndex) {
      setActiveMessageIndex(null); // Si le même message est cliqué à nouveau, réinitialiser l'état à null
    } else {
      setActiveMessageIndex(index); // Sinon, mettre à jour l'index du message actif
    }
  };







  const loadUsersWithMessages = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get('http://localhost:5000/messages/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const users = response.data;
  
      setUsersWithMessages(users); // Stocker les utilisateurs avec lesquels l'utilisateur actuel a échangé des messages
      console.log('users :', users);

      setInitialUsers(users); 

      if (username) {
        setIsLoading(false);
        return;
      }
      if (usersWithMessages.length > 0) {
        const firstUser = usersWithMessages[0];
      
        console.log('Premier utilisateur :', firstUser);
        if (firstUser.username) {
          setUsername(firstUser.username);
        } else {
          setUsername(""); // Par exemple, vous pouvez définir un nom d'utilisateur vide
        }
      } else {
        setUsername(""); // Par exemple, vous pouvez définir un nom d'utilisateur vide
      }
    
    } catch (error) {
      console.error('Error loading users with messages:', error);
    }
    setIsLoading(false);
  };
  
  
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); 
  };

  useEffect(() => {
    if (searchTerm === '') {
      setUsersWithMessages(initialUsers); 
    } else {
      const filteredUsers = initialUsers.filter(user => {
        return user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setUsersWithMessages(filteredUsers); // Filtrer les utilisateurs en fonction du terme de recherche
    }
  }, [searchTerm, initialUsers]);

  const loadMessagesWithUser = async (username) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/messages/${username}/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(response.data.messages);

      console.log('messages : ',response.data);
    } catch (error) {
      console.error('Error loading messages with user:', error);
    }
    setIsLoading(false);
  };


  
  const playMessageSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  useEffect(() => {
    socket.on('newMessage', (newMessage) => {
      console.log('Nouveau message reçu:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      if (newMessage.sender !== userId && newMessage.recipient === userId) {
        playMessageSound();
     //setIsTyping(true);
        const senderId = newMessage.sender;

        const updatedUsersWithMessages = usersWithMessages.map(user => {
          if (user.id === senderId) {

            const unreadCount = user.lastMessage && !user.lastMessage.vuByUser ? user.unreadCount + 1 : 1;

            // Mettre à jour le lastMessage
            return {
              ...user,
              lastMessage: newMessage,
              unreadCount : unreadCount
            };
          }
          return user;
        });
  
        setUsersWithMessages(updatedUsersWithMessages);
  
      }
    });
  
    return () => {
      socket.off('newMessage');
    };
  }, [messages]); 
  
  
  const loadRecipientDetails = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRecipientDetails(response.data);
      console.log('setRecipientDetailssssssssssssss:',response.data);
    } catch (error) {
      console.error('Error loading recipient details:', error);
    }
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('username', username);

    formData.append('image', file);
  
    try {
      await axios.post('http://localhost:5000/messages/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Erreur lors de l'envoi du message, réessayer plus tard");
    }
  };

  const handleVoiceRecord = () => {
    setMessageType('voice');
  
    let mediaRecorder; 
  
    if (isRecording) {
      setIsRecording(false);
      if (mediaRecorder) {
        mediaRecorder.stop(); 
      }
      return;
    }
  
    setIsRecording(true);
  
 
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream); 
  
        const chunks = [];
  
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
  
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
  
          const voiceFile = new File([audioBlob], 'voice_message.webm');
  
          setVoiceFile(voiceFile);
  
          try {
            const formData = new FormData();
            formData.append('username', username);

            formData.append('file', voiceFile);
  
            await axios.post('http://localhost:5000/messages/voice', formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
  
            console.log('Voice message sent successfully!');
          } catch (error) {
            console.error('Error sending voice message:', error);
            toast.error("Erreur lors de l'envoi du message, réessayer plus tard");

          }
        };
  
        mediaRecorder.start();
  
        const icon = document.getElementById('voiceRecordIcon');
        if (icon) {
          icon.addEventListener('click', () => {
            setIsRecording(false);
            if (mediaRecorder) {
              mediaRecorder.stop(); 
            }
          });
        }
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };
  
  


  const handleReport = async () => {

    try {
        const response = await axios.put(`http://localhost:5000/messages/${idMessage}/report`, {  reason: selectedReason
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
};

  
  const sendMessage = async (event) => {

    event.preventDefault(); 
    setIsLoading(true);

    if (newMessage.trim() === '') {
      setErrorMessage('Veuillez saisir un message.');
      setIsLoading(false); 
      return;
    }
    try {
      let formData = new FormData();
      formData.append('username', username);
      formData.append('content', newMessage);

  
      await axios.post('http://localhost:5000/messages/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      await loadMessagesWithUser(username);
      await loadUsersWithMessages();
      await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100 millisecondes
      adjustScrollToBottom();
      setNewMessage('');
      setIsLoading(false);

      await axios.post('http://localhost:5000/profiles/typing', {
        recipient: username,
        isTyping: false
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message, réessayer plus tard");

      setIsLoading(false);
    }
  };
  

  const markMessagesAsRead = async (username) => {
    try {
      await axios.put(`http://localhost:5000/messages/mark-as-read/${username}`, {
        // Vous pouvez également envoyer d'autres données si nécessaire
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });


      await axios.put('http://localhost:5000/messages/mark', {
     }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };


  


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
  

  const onMessageButtonClick = (u) => {
    //history(`/messages/${u}`);

    setUsername(u);

    console.log('usernmae', username);
  };


  /*useEffect(() => {
    // Écouter l'événement 'typing' émis par le serveur de socket
   /* socket.on('typing', (data) => {
      const { isTyping, sender } = data;
      if (sender !== localStorage.getItem('username')) {
        setIsTyping(isTyping);
      }
    });
  
    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      socket.off('typing');
    };

    checkTypingState();

  }, [newMessage,localStorage.getItem('username')],localStorage.getItem('usernameTosend'));*/
  useEffect(() => {
    const interval = setInterval(() => {
      checkTypingStatus();
    }, 5000); // Vérifier toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);


  const checkTypingStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/profiles/typing-status/${localStorage.getItem('username')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsOtherTyping(response.data.isTyping);
      console.log(isOtherTyping)
    } catch (error) {
      console.error('Error checking typing status:', error);
    }
  };

  /*const handleKeyDown = async  (e) => {
    if (e.key === 'Enter' && newMessage.trim() !== '') {
      markMessagesAsRead()
      // Envoyer le message lorsque l'utilisateur appuie sur Entrée
      socket.emit('new_message', { message: newMessage });
      await sendMessage(e); // Appelle sendMessage
      // Arrêter d'indiquer que vous êtes en train de taper à l'autre personne
      socket.emit('typing', { isTyping: false, sender: localStorage.getItem('username'), recipient: username });
    } else if (e.key !== 'Enter') {
      // Vérifier si l'utilisateur commence à taper et que le message est vide
      if (!isTyping && newMessage.trim() === '') {
        // Émettre un événement 'typing' au serveur de socket pour informer les autres utilisateurs
        socket.emit('typing', { isTyping: true, sender: localStorage.getItem('username'), recipient: username });
      }
      setIsTyping(true);
    }
  };*/
  

  

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && newMessage.trim() !== '') {
      e.preventDefault();
     await  markMessagesAsRead()
      socket.emit('new_message', { message: newMessage });
      await sendMessage(e);
    }else{
      try {
        await axios.post('http://localhost:5000/profiles/typing', {
          recipient: username,
          isTyping: newMessage.trim() !== ''
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error('Error sending typing status:', error);
      }
    }
  };
  
  
 

  function calculateTimeDifference(lastLogin) {
    const now = new Date();
    const diff = now.getTime() - new Date(lastLogin).getTime();
    const seconds = Math.floor(diff / 1000);
  
    if (seconds < 60) {
      return `${seconds} seconde${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} heure${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} jour${days !== 1 ? 's' : ''}`;
    }
  }
  
  const usersWithLastMessages = usersWithMessages.sort((a, b) => {
    // Extraire les dates des derniers messages pour chaque utilisateur
    const dateA = new Date(a.lastMessage.date);
    const dateB = new Date(b.lastMessage.date);
  
    // Trier les utilisateurs par date du dernier message dans l'ordre décroissant
    return dateB - dateA;
  });
  
  // Maintenant, vous avez usersWithLastMessages trié par date du dernier message
  
  const adjustScrollToBottom = () => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  


  
  
  return (

    <div className="container">
{/* <ToastContainer /> */}
    


      <div className="row mt-5">
        <div className="col-lg-4  border-end " style={{ height: '80vh', overflowY: 'auto' }}>

     
      
      

          <h2>Utilisateurs</h2>

          <div class="ui-input-container">
          <input
          placeholder="Rechercher un utilisateur..."
          className="ui-input"
          type="text"

          value={searchTerm}
          onChange={handleInputChange}
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
          {!isLoading && usersWithMessages.length === 0 && <p>Commencer à parler</p>}
          {!isLoading && usersWithMessages.length > 0 && (
            <ul className='list-unstyled mt-5'>
            {usersWithLastMessages.map((user, index) => {
              // Filtrer les messages pour trouver ceux entre l'utilisateur actuel et l'utilisateur en cours
              //const userMessages = messages.filter(message => (message.sender === userId && message.recipient === user.id) || (message.sender === user.id && message.recipient === userId));
             // const lastMessage = user.lastMessage;
             const lastMessage = user.lastMessage;

              console.log('lastMessage', user);
              // Trouver le dernier message dans la conversation
              //const lastMessage = userMessages[userMessages.length - 1];
          
              // Vérifier si le dernier message est envoyé par l'utilisateur actuel
              const isSentByUser = lastMessage && lastMessage.sender === userId;
          
              let dateToDisplay = '';
              if (lastMessage) {
                const messageDate = moment(lastMessage.date);
                const currentDate = moment();
          
                if (currentDate.diff(messageDate, 'days') < 1) {
                  // Si le message a été envoyé aujourd'hui, afficher l'heure et les minutes
                  dateToDisplay = messageDate.format('HH:mm');
                } else {
                  // Sinon, afficher la date au format DD/MM/YYYY
                  dateToDisplay = messageDate.format('DD/MM/YYYY');
                }
              }
          
              const handleConversationClick = async () => {
                try {
                    // Appeler d'abord la fonction pour marquer les messages comme lus
                    const markAsReadPromise = markMessagesAsRead(user.username);
                    
                    // Ensuite, appeler la fonction pour ouvrir la conversation
                    onMessageButtonClick(user.username);
                    await loadMessagesWithUser(user.username);
    
                    // Charger les détails du destinataire
                    await loadRecipientDetails(user.username);
                    // Attendre que les deux appels asynchrones se terminent
                    await Promise.all([markAsReadPromise]);
                    
                    // Ajoutez ici d'autres logiques, par exemple, ouvrir la conversation dans une nouvelle fenêtre
                } catch (error) {
                    console.error('Error handling conversation click:', error);
                }
            };
            
            
              return (
                <li key={user.id}  className={`mb-3 ${index !== usersWithMessages.length - 1 ? 'border-bottom pb-3' : ''}`} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' , backgroundColor: user.unreadCount > 0 ? '#f2f2f2' : ''  }}>
                <div style={{ position: 'relative' }}>
                <a href={`/profile/${user.username}`} >           
                     <img 
                src={
                  user.profilePicture.startsWith('https://') 
                  ? user.profilePicture 
                  : `http://localhost:5000/images/${user.profilePicture}`
                } 
                className="rounded-circle" 
                alt="Photodeprofil" 
                style={{  
                width: '50px'
              }} 
              />
              </a>
              
              {user.isLoggedIn ? <div className="online-circle" style={{ position: 'absolute', bottom: 0, right: 0 }}></div> : <div className="offline-circle" style={{ position: 'absolute', bottom: 0, right: 0 }}></div>}
                  </div>
                  <div style={{ marginLeft: '10px', whiteSpace: 'nowrap' }} onClick={() => { handleConversationClick(); }}>
                    <span className='fw-bold'>{user.firstName}  {user.lastName ? user.lastName : 'Nom inconnu'}</span>
                    {lastMessage && (
                      <div className='mt-3'>
                      {user.unreadCount > 0 ? (
                        <span className="text-muted">Messages non lus: {user.unreadCount}</span>
                      ) : (
                        <>
                        <span className="text-muted">{isSentByUser ? 'Vous : ' : ''}</span>
                        {lastMessage.type === 'image' ? (
                          <span className="text-muted">Image</span>
                        ) : lastMessage.type === 'voice' ? (
                          <span className="text-muted">Vocale</span>
                        ) : (
                          <span className="text-muted">{lastMessage.content.length > 15 ? lastMessage.content.slice(0, 15) + '...' : lastMessage.content}</span>
                        )}
                    
                        <span className="text-muted ms-lg-5" style={{ marginLeft: '10px' }}>{dateToDisplay}</span>
                    </>
                      )}
                        </div>
                    )}
                    
                  </div>
                </li>
              );
            })}
          </ul>
          
          
          
          
          
          
          
          
          )}
        </div>


  

        <div className="col-lg-8 " style={{ height: '80vh', overflowY: 'auto' }}>
{username == null && (

<div className='text-center'>
  <img src={image1} width={'450px'} className='img-fluid mt-4'/>
  <h4 className='mt-3'>Commencer à parler</h4>
  <p className='text-muted mt-2'>Cliquez sur l'utilisateur avec qui vous souhaitez parler pour démarrer la conversation.</p>
</div>



)}

        {recipientDetails && (
          <>
          <h2>
          Conversation avec {recipientDetails.firstName} {recipientDetails.lastName}
          
        </h2>

        {recipientDetails.isLoggedIn ? (
            <span style={{ marginLeft: '10px', color: 'green' }}>En ligne</span>
          ) : (
            <span style={{ marginLeft: '10px', color: 'gray' }}>Hors ligne ( Vu il y a {calculateTimeDifference(recipientDetails.lastLogin)})</span>
          )}
                    {isLoading && <p>Chargement...</p>}
            {!isLoading && messages.length === 0 && <p>Commencer à parler</p>}
            {!isLoading && messages.length > 0 && (
                <div className="messages-container mt-4" ref={messagesContainerRef}>
                {messages.map((message, index) => {
                  const isSentByUser = message.sender === userId;
                  const messageClass = `message ${isSentByUser ? 'sent' : 'received'}`;
                  const isActive = index === activeMessageIndex; // Vérifier si ce message est actif
                   const isInCurrentConversation = 
      ( message.recipient === userId && message.sender === recipientDetails._id) ||
      (message.recipient ===recipientDetails._id && message.sender === userId);
    if (!isInCurrentConversation) {
      // Si le message n'appartient pas à la conversation actuelle, ne pas l'afficher
      return null;
    }
                  return (
                    
                    <div
                      key={index}
                      className={messageClass}
                      onClick={() => handleMessageClick(index)} // Ajouter un gestionnaire d'événements de clic à chaque message
                      style={{ display: 'flex', alignItems: 'center' , maxWidth:'80%'  }} // Ajouter une style pour aligner les éléments sur la même ligne
                    >

                    
                      {!isSentByUser && (
                        <img
                        src={
                          recipientDetails.profilePicture.startsWith('https://') 
                          ? recipientDetails.profilePicture 
                          : `http://localhost:5000/images/${recipientDetails.profilePicture}`
                        }
                        className="img-fluid rounded-circle profile-image me-3"
                        alt="Photode profilXzzzzzzzz"
 style={{ 
    marginRight: '10px', 
    cursor: 'pointer'
    // Rapport hauteur/largeur égal à 1 pour un cercle
  }}                        width={'25px'}
                        onClick={() => history(`/profile/${username}`)}
                      />
                      
                      )}
              

                      <div className="message-content" >
                      {message.type === 'text' && (
                        <span style={{ overflowWrap:'anywhere'}}>
                        <Linkify> {message.content} </Linkify>
                        </span>
                      )}
                      {message.type === 'image' && (
                        <img src={`http://localhost:5000/images/${message.content}`} alt="Image" width={'200px'} />
                      )}
                      {message.type === 'voice' && (
                        <audio controls>
                          <source src={`http://localhost:5000/images/${message.content}`} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    
                      {isActive && (
                        <small className="text-muted">
                          <br />
                          {moment(message.date).format('MMMM Do YYYY, h:mm:ss a')}
                        </small>
                      )}


                    </div>
{isActive && !isSentByUser &&
                    <button className="btn btn-outline-danger me-2 comment-button " onClick={() => { setShowReportModal(true); setIdMessage(message._id)}}  >
                    <FontAwesomeIcon icon={faFlag} /><span className='button-text ms-4'> Signaler </span>
                  </button>
}









                    </div>

                

              
                  );
                })}



            
              </div>
              
           
       
              
              
              
            )}

         

            {!isLoading && (
<div >
{isOtherTyping && <div>L'utilisateur est en train de taper...</div>}

<div className="input-group mt-3" style={{ marginTop: 'auto' }}>

{(!recipientDetails.myblocklist || !recipientDetails.myblocklist.includes(recipientDetails._id)) && (!recipientDetails.blockedUsers || !recipientDetails.blockedUsers.includes(userId)) ? (
  <>
  {recipientDetails.followers && recipientDetails.followers.includes(userId) && recipientDetails.following && recipientDetails.following.includes(userId) ? (
    <>

<span className="input-group-text">
  <label htmlFor="imageUpload">
    <FontAwesomeIcon icon={faImage} style={{ color:'#7447FF' }} />
  </label>
  <input
    type="file"
    id="imageUpload"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleImageUpload}
  />
</span>
<span className="input-group-text" id="voiceRecordIcon" onClick={handleVoiceRecord}>
  <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} style={{ color:'#7447FF' }} />
</span>
<form onSubmit={sendMessage} className="d-flex flex-grow-1">
  <input
    type="text"
    className="form-control me-2 w-100"
    placeholder="Votre message..."
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onKeyDown={handleKeyDown}
  />
  <button type="submit" className="btn btn-secondaire">Envoyer</button>

</form>
</>
) : (
  <div className="d-flex align-items-center justify-content-center">
    <FontAwesomeIcon icon={faExclamationTriangle} className='ms-3' style={{ color: '#FF6347' }} />
    <p className='mt-3 ms-2'>
      Oh non ! Vous ne pouvez pas envoyer de messages pour le moment. L'utilisateur a peut-être temporairement désactivé cette fonctionnalité.
    </p>
  </div>
)}
</>
) : (
  <div className="d-flex align-items-center ">
    <FontAwesomeIcon icon={faBan} className='ms-3' style={{ color: '#FF6347' }} />
    <p className='mt-3 ms-2'>
      Désolé, cet utilisateur n'est pas disponible pour le moment. Il se peut qu'il soit occupé ou hors ligne. Réessayez plus tard !
    </p>
  </div>
)}

</div>
{errorMessage && <div className="text-danger">{errorMessage}</div>} 

                <button style={{display:'none'}} onClick={playMessageSound}>Lire le son</button>

                </div>
              )}
          </>
        )}
      </div>
      
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
<Modal.Header closeButton>
    <Modal.Title>Signaler le message</Modal.Title>
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


    <p className='mt-5'>Êtes-vous sûr de vouloir signaler ce message ?</p>


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
      </div>



   
    </div>

 

  );
}

export default Messages;
