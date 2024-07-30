import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PublicProfileComponent from './PublicProfileComponent';
import PrivateProfileComponent from './PrivateProfileComponent';
import OwnerProfileComponent from './OwnerProfileComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlockProfileComponent from './BlockProfileComponent';
import image1 from '../9571047.jpg';
import loadingImage from '../loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';


const fetchUserData = async (token, username, setUser, setError) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/UserProfile/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setUser(response.data);
  } catch (error) {
    setError('Erreur lors de la récupération des informations de l\'utilisateur');
  }
};
const Profile = () => {
  const { username } = useParams(); 

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state && location.state.successMessage);
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);

  localStorage.removeItem('userInterests');
      localStorage.removeItem('predefinedInterests');

  const handleCloseAlert = () => {
    setSuccessMessage(null); 
    
  };



  const RemoveFollowers = async (username) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
    const response = await axios.put(`http://localhost:5000/profiles/followers/${username}/remove`, {}, config);
    toast.success(response.data.message);

     await fetchUserData(token, username, setUser, setError);

    } catch (error) {
      setError('Erreur lors de la récupération des informations de l\'utilisateur');
    }
    setIsLoading(false);
  }
  
  const AddFollowers = async (username) => {
    setIsLoading(true);
    try {

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.put(`http://localhost:5000/profiles/followers/${username}`, {}, config);
      toast.success(response.data.message);

     await fetchUserData(token, username, setUser, setError);
    } catch (error) {
      setError('Erreur lors de la récupération des informations de l\'utilisateur');
      return; 
    }
    setIsLoading(false);
  }
  
  

  useEffect(() => {
 
 
    if (token) {
      try {
          try {
            fetchUserData(token, username, setUser, setError);

            
          } catch (error) {
            setError('Erreur lors de la récupération des informations de l\'utilisateur');
          }
      

      } catch (error) {
        setError('Erreur lors de la lecture du token');
      }
    } else {
      setError('Token non trouvé');
    }
  }, []);



  const CancelFriendShip = async (username) => {
    try {
      const response = await axios.put(`http://localhost:5000/profiles/cancel/friendrequest/${username}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
  
      if (response.status === 200) {
        toast.success(response.data.message);

        await fetchUserData(token, username, setUser, setError);


      } else {
        throw new Error('Erreur lors de l\'annulation de la demande d\'ami');
      }
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  };


  if (error) {
    return <div className='container'><div className='text-center mt-5 mb-5'> <img src={image1} width='400px' /> 
    <p>Erreur : <span className='fw-bold'>{error}</span></p>

    <p><FontAwesomeIcon icon={faInfoCircle} style={{color:'#7447FF'}} /> Nous n'avons pas pu trouver l'utilisateur spécifié. Veuillez vérifier le username et réessayer.</p>
    <p><FontAwesomeIcon icon={faExclamationTriangle} style={{color:'#7447FF'}}  /> Si le problème persiste, il est possible que l'utilisateur ait été supprimé ou désactivé.</p>
    <p><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#7447FF'}}  /> Pour plus d'informations ou de l'aide, veuillez contacter le support technique.</p>
 
    </div> 
    </div>;
  }

  if (!user) {
    return <div className='container'><div className='text-center mt-5 mb-5'> <img src={loadingImage} width='400px' /> <p>Chargement en cours...</p></div> </div>;
  }

  const followersCount = user.profile.followers ? user.profile.followers.length : 0;
  const followingCount = user.profile.following ? user.profile.following.length : 0;

    const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;
  const isOwner = user.user._id === userId;
  const isPublicProfile = user.profile.profileType === 'public';

 const isBlock = user.profile.blockedUsers.includes(userId);

  const isFollowing = user.profile.following.includes(userId); // Vérifie si l'utilisateur connecté suit le profil consulté
  const isFollower = user.profile.followers.includes(userId);

  return (
    <div className="container mb-5">

    {isOwner && (
      <OwnerProfileComponent 
        user={user} 
        followersCount={followersCount} 
        followingCount={followingCount} 
        userId={userId} 
        username={username} 
     
      />
    )}
    
    {(user.verif || isBlock) && (
      <BlockProfileComponent 
        user={user} 
  
      />
    )}
    
    {!isOwner && (!user.verif && !isBlock) && isPublicProfile && (
      <PublicProfileComponent 
        user={user} 
        followersCount={followersCount} 
        followingCount={followingCount} 
        isFollower={isFollower} 
        isFollowing={isFollowing}
        RemoveFollowers={RemoveFollowers} 
        AddFollowers={AddFollowers} 
        userId={userId} 
        username={username} 
        isLoading={isLoading}
      />
    )}
    
    {!isOwner && (!user.verif && !isBlock) &&  !isPublicProfile && (
      <PrivateProfileComponent 
        user={user} 
        followersCount={followersCount} 
        followingCount={followingCount} 
        isFollower={isFollower} 
        isFollowing={isFollowing}
        RemoveFollowers={RemoveFollowers} 
        AddFollowers={AddFollowers} 
        CancelFriendShip = {CancelFriendShip}
        userId={userId} 
        username={username} 
        
      />
    )}
    






    </div>
  );
};

export default Profile;
