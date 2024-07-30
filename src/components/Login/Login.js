import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import ResetPassword from './ResetPassword'; 
import { Button, Modal } from 'react-bootstrap';

const Login = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);


  const [showResetPassword, setShowResetPassword] = useState(false);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  useEffect(() => {
    const message = localStorage.getItem('successMessage');
    if (message) {
      setSuccessMessage(message);
      localStorage.removeItem('successMessage');
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault(); 
    if (!email) {
      setEmailError('L\'email est requis.');
      return;
    }
    if (!password) {
      setPasswordError('Le mot de passe est requis.');
      return;
    }
    try {
    /*  const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();*/

      const response = await axios.post('http://localhost:5000/users/login', {
        email,
        password
      });
    
      const { data } = response;

      if (response.status === 200) {
        const { token, firstTime,username,role  } = data;
        if (role ==='admin'){
          localStorage.setItem('role', role);
          localStorage.setItem('token', token);
window.location.href = '/'


        }else{
        if (firstTime === true) {
        localStorage.setItem('firstTime', firstTime);
        localStorage.setItem('token', token);

        }else {
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);

        localStorage.setItem('username', username);
        }
       window.location.href = firstTime ? '/first-time' : `/profile/${username}`;

      }
      } else {

        setErrorMessage(data.message);
        toast.error(data.error);

       /* if (response.status === 401) {
          setErrorMessage('Mot de passe incorrect');
        } else {
          setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
        }*/
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage(error.response.data.message);
      toast.error(error.response.data.message);

    }
  };
  



  useEffect(() => {


    if (i18n.language) {
        setLanguageInitialized(true);
    }
}, [i18n.language]);

if (!languageInitialized) {
    return null; 
}

  return (
    <section style={{overflow : 'hidden'}} >

    <div className='row' >

    <div className='col-lg-6 p-3'>
    <div className='container'>
    <h1 className='mt-5 text-center text-uppercase'>{t('Login.Connexion.header')}</h1>
   
    <div className="d-flex justify-content-center mt-5">
    <button className="btn btn-outline-custom-secondaire mx-2"><FontAwesomeIcon icon={faGoogle} size="lg" /> {t('Login.Connexion.connect_with_google')} </button>
    <button className="btn btn-outline-custom-primaire mx-2"><FontAwesomeIcon icon={faApple} size="lg" />  {t('Login.Connexion.connect_with_apple')}</button>
  </div>
            {successMessage && <p className="text-success text-center">{successMessage}</p>}
            <form onSubmit={handleLogin} className='mb-5'>
              <div className="form-group mt-5 text-start">
                <label htmlFor="email" >
                <FontAwesomeIcon icon={faEnvelope} style={{color:'#7447FF'}} className="mr-2" /> {t('Login.Connexion.email')}  

                </label>
                <input  type="email" id="email" className={`form-control ${emailError && 'is-invalid'}`} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                {emailError && <p className="text-danger text-start">{emailError}</p>}
              </div>
              <div className="form-group mt-5 text-start">
                <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} style={{color:'#7447FF'}} className="mr-2" /> {t('Login.Connexion.password')}   
                </label>
                <input type="password" id="password" className={`form-control ${passwordError && 'is-invalid'}`} placeholder={t('Login.Connexion.password')}  value={password} onChange={e => setPassword(e.target.value)} />
                {passwordError && <p className="text-danger text-start">{passwordError}</p>}
              </div>
              <div className="text-end">
              <a href="#" onClick={() => setShowResetPassword(true)} style={{textDecoration:'none'}}>Mot de passe oublié ?</a>
              </div>
              {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                  {errorMessage}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
              )}
              <div className='text-center'>

              <button type="submit" className="btn btn-secondaire-per  mt-5 mb-3">  {t('Login.Connexion.login_button')}  </button>
              </div>
            </form>
          </div>

          <Modal show={showResetPassword} onHide={() => setShowResetPassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Réinitialiser le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResetPassword />
        </Modal.Body>
        <Modal.Footer>
        <p className="text-muted">
        <FontAwesomeIcon icon={faInfoCircle} className="me-2" style={{color:'#7447FF'}} />
          Vous recevrez un email avec votre nouveau mot de passe. Vous pouvez le changer à tout moment depuis votre profil.</p>
              </Modal.Footer>
      </Modal>
   </div>
   
   <div className='col-lg-6 bg-linear-login d-flex align-items-center justify-content-center'>
   <div className='container'>
       <div className="p-3 text-center" style={{color : '#0C134F'}}>
           <h1 className='fw-bold mb-3'> {t('Login.Welcome_Back.header')}  </h1>
           <p style={{fontSize : '19px'}} >  {t('Login.Welcome_Back.subheader')}</p>
           <a href='/register' >  <button className="btn btn-outline-custom-primaire-per mt-3"> {t('Login.Welcome_Back.sign_in_button')} </button></a>
       </div>
   </div>
</div>
   
   
   
   </div>

  </section>
  );
};

export default Login;
