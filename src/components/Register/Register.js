import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { faUser, faEnvelope, faLock, faImage } from '@fortawesome/free-solid-svg-icons';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePicture: null,
  });

  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profilePictureError, setProfilePictureError] = useState('');

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);


  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });



  
  useEffect(() => {
    const fetchData = async () => {
        if (user) {
            try {
                const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                });
                setProfile(response.data);

                const response2 = await axios.post('http://localhost:5000/users/google-login', {
                    email: response.data.email,
                    given_name: response.data.given_name,
                    family_name: response.data.family_name,
                    picture: response.data.picture
                });

                console.log(response2.data); 

                const { token, firstTime,username  } = response2.data; 

                if (firstTime === true) {
                    localStorage.setItem('firstTime', firstTime);
                }else{

                  localStorage.setItem('username', username);
                }
                
                localStorage.setItem('token', token);

                window.location.href = firstTime ? '/first-time' : `/profile/${username}`;
            } catch (error) {
                console.log(error);
            }
        }
    };

    fetchData();
}, [user]);



useEffect(() => {


  if (i18n.language) {
      setLanguageInitialized(true);
  }
}, [i18n.language]);

if (!languageInitialized) {
  return null; 
}


  const handleGoogleLoginSuccess = async (response) => {
    const tokenId = response.tokenId;
    console.log(tokenId);
    try {
      const { data } = await axios.post('http://localhost:5000/users/google-login', { tokenId });
      onLoginSuccess(data.token);
      console.log(data.token);
    } catch (error) {
      onLoginFailure(error);
    }
  };

  const onLoginSuccess = (res) => {
    console.log('Connexion Google réussie',res);
    setUser(res); // Stocker les informations de connexion dans l'état utilisateur

 
 
  };

  const onLoginFailure = (err) => {
    console.error('Erreur lors de la connexion avec Google :', err);
  };
 
  if (user) {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.accessToken}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        Accept: 'application/json'
      }
    })
    .then((res) => {
      setProfile(res.data); // Stocker les informations du profil dans l'état profile
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des informations du profil :', err);
    });
  }
  const logOut = () => {
    googleLogout();
    setProfile(null);
};
  /*const onLoginFailure = (error) => {
    // Gérer l'échec de la connexion Google ici
    console.error('Erreur lors de la connexion avec Google :', error);
  };*/

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 /* const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };*/

 
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file){
    if (file.size > 10485760) { // Vérification si la taille du fichier est supérieure à 10 Mo (10 * 1024 * 1024)
      setProfilePictureError('La taille du fichier ne doit pas dépasser 10 Mo.');
    } else {
      setFormData({
        ...formData,
        profilePicture: file,
      });
      setProfilePictureError(''); // Effacez les messages d'erreur précédents si le fichier est valide
    }
  }else {
    setProfilePictureError('Il faut choisir une image.');


  }
  };
  
  

  const handleRegister = async (e) => {
    e.preventDefault();
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    try {

      if (!formData.firstName) {
        setFirstNameError('Veuillez entrer votre prénom');
        return;
      }
      if (!formData.lastName) {
        setLastNameError('Veuillez entrer votre nom');
        return;
      }
      if (!formData.email) {
        setEmailError('Veuillez entrer votre adresse email');
        return;
      }
      if (!formData.password) {
        setPasswordError('Veuillez entrer votre mot de passe');
        return;
      }
      const formDataToSend = new FormData(); // Créez un nouvel objet FormData

      // Ajoutez les champs du formulaire à l'objet FormData

      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('profilePicture', formData.profilePicture);
      
  
      //const response = await axios.post('http://192.168.33.10:5000/users/add-user',formData, {
        const response = await axios.post('http://localhost:5000/users/add-user',formData, {

        headers: {
          'Content-Type': 'multipart/form-data'
        }
     
      });
      console.log('Réponse du serveur:', response.data);
   
  
      if (response.status !==201 ) {
        throw new Error('Erreur lors de la requête');
      }
    
      setIsRegistered(true);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      setErrorMessage('Erreur lors de la création de l\'utilisateur');
    }
  };
  

  if (isRegistered) {
    localStorage.setItem('successMessage', 'Inscription réussie. Vous pouvez maintenant vous connecter.');

    return <Navigate to={{ pathname: '/login', state: { successMessage: 'Inscription réussie. Vous pouvez maintenant vous connecter.' } }} />;
  }



  




  return (

    <section style={{overflow:'hidden'}}>
    <div className='row' >
    <div className='col-lg-6 bg-linear d-flex align-items-center justify-content-center'>
    <div className='container'>
        <div className="p-3 text-center" style={{color : '#0C134F'}}>
            <h1 className='fw-bold mb-3'>{t('Register.Hello_Friend')}</h1>
            <p style={{fontSize : '19px'}} >{t('Register.Enter_your_personal_details')}</p>
           <a href='/login' > <button className="btn btn-outline-custom-primaire-per mt-3">{t('Register.Sign_Up')}</button></a>
        </div>
    </div>
</div>

    <div className='col-lg-6'>
    <div className='container'>
    <h1 className='mt-5 text-center text-uppercase'>{t('Register.title')}</h1>

    <div className="d-flex justify-content-center mt-5">


      <button onClick={login} className="btn btn-outline-custom-secondaire mx-2"><FontAwesomeIcon icon={faGoogle} size="lg" /> {t('Register.connect_with_google')} </button>
      <button className="btn btn-outline-custom-primaire mx-2"><FontAwesomeIcon icon={faApple} size="lg" /> {t('Register.connect_with_apple')} </button>
    </div>


    {errorMessage && <p className="text-danger">{errorMessage}</p>}
    <form onSubmit={handleRegister} className='mb-5'>
      <div className="row mt-5">
        <div className={`form-group col-md-6 mt-2 ${firstNameError && 'has-error'}`}>
        <label htmlFor="firstName"><FontAwesomeIcon icon={faUser} className="mr-2" style={{color:'#7447FF'}} /> {t('Register.First_Name')}  </label>
          <input type="text" id="firstName" className={`form-control ${firstNameError && 'is-invalid'}`} placeholder={t('Register.First_Name')} name="firstName" value={formData.firstName} onChange={handleInputChange} />
          {firstNameError && <p className="text-danger">{firstNameError}</p>}
        </div>
        <div className={`form-group col-md-6 mt-2 ${lastNameError && 'has-error'}`}>
        <label htmlFor="lastName"><FontAwesomeIcon icon={faUser} className="mr-2" style={{color:'#7447FF'}} /> {t('Register.Last_Name')}</label>
          <input type="text" id="lastName" className={`form-control ${lastNameError && 'is-invalid'}`} placeholder={t('Register.Last_Name')} name="lastName" value={formData.lastName} onChange={handleInputChange} />
          {lastNameError && <p className="text-danger">{lastNameError}</p>}
        </div>
      </div>
      <div className="row mt-5">
        <div className={`form-group col-md-6 mt-3 ${emailError && 'has-error'}`}>
        <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} className="mr-2" style={{color:'#7447FF'}}/> {t('Register.Email')}</label>
          <input type="email" id="email" className={`form-control ${emailError && 'is-invalid'}`} placeholder= {t('Register.Email')} name="email" value={formData.email} onChange={handleInputChange} />
          {emailError && <p className="text-danger">{emailError}</p>}
        </div>
        <div className={`form-group col-md-6 mt-3 ${passwordError && 'has-error'}`}>
        <label htmlFor="password"><FontAwesomeIcon icon={faLock} className="mr-2" style={{color:'#7447FF'}}/>  {t('Register.Password')}</label>
          <input type="password" id="password" className={`form-control ${passwordError && 'is-invalid'}`} placeholder={t('Register.Password_Length')} name="password" value={formData.password} onChange={handleInputChange} />
          {passwordError && <p className="text-danger">{passwordError}</p>}
        </div>
      </div>
      <div className={`form-group mt-5 ${profilePictureError && 'has-error'}`}>
      <label htmlFor="profilePictureInput"><FontAwesomeIcon icon={faImage} className="mr-2" style={{color:'#7447FF'}} /> {t('Register.Profile_Picture')}</label><br></br>
      <input type="file" id="profilePictureInput" className={`form-control-file ${profilePictureError && 'is-invalid'}`} name="profilePicture" accept="image/*" onChange={handleFileChange} />
      {profilePictureError && <p className="text-danger">{profilePictureError}</p>}
  </div>
  <div className='text-center'>
      <button type="submit" className="btn btn-secondaire-per mt-5">{t('Register.Register')}</button>
      </div>
    </form>
    </div>
    </div>
    </div>
    <div className='container'>



    {profile && (
      <div>
        <h2>Profil utilisateur</h2>
        <p>Nom : {profile.name}</p>
        <p>Email : {profile.email}</p>
        {/* Affichez d'autres informations du profil ici */}
      </div>
    )}
</div>
</section>
  );
};

export default Register;
