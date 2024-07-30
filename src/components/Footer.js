import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin , faTiktok } from '@fortawesome/free-brands-svg-icons';

import { faApple, faAndroid } from '@fortawesome/free-brands-svg-icons';
import Logo from '../télécharger.png';
import { useTranslation } from 'react-i18next';

import './Footer.css'
import { Link } from 'react-router-dom';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const Footer = () => {
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);
  const [userEmail, setUserEmail] = useState('');

const isAuthenticated = localStorage.getItem('token');
  useEffect(() => {


      if (i18n.language) {
          setLanguageInitialized(true);
      }
  }, [i18n.language]);

  if (!languageInitialized) {
      return null; 
  }


const handleNewsletterSignup = async () => {
  try {
    const response = await axios.post('http://localhost:5000/newsletter/newsletter', { email: userEmail });
    toast.success(response.data.message)
    console.log(response.data.message); // Afficher le message de succès
  } catch (error) {
    toast.error(error.response.data.message)

    console.error(error.response.data.message); // Afficher le message d'erreur
  }
};
  return (
    <footer className="footer mt-1" style={{ boxShadow: '0px 0px 10px 0.3px rgba(0, 0, 0, 0.3)' }}>
    {/* <ToastContainer /> */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-4">
            <img src={Logo} alt="Logo" className="footer-logo" />
            <p className="footer-description">
            {t('footer.description')}         
               </p>
          </div>
          <div className="col-lg-4">
            <h5>Decouvrir</h5>
            <ul className="footer-links">
            {!isAuthenticated &&
              <>
            <li><Link to={'/register'}>{t('footer.signUp')}</Link></li>
            <li><Link to={'/login'}>{t('footer.logIn')}</Link></li>
            </>           
            }
            <li><Link to={'/upComingGuest'}>{t('footer.events')}</Link></li>
            <li><Link href="#">{t('footer.contactUs')}</Link></li>
            <li><Link to={'about_us'}>{t('footer.aboutUs')}</Link></li>
            {/* Ajoutez d'autres liens selon vos besoins */}
          </ul>
          
          </div>
          <div className="col-lg-4">
            <h5>Newsletter</h5>
            <div className="input-group mb-3">
            <input 
            type="email" 
            className="form-control" 
            placeholder={t('footer.emailPlaceholder')} 
            aria-label={t('footer.emailPlaceholder')} 
            value={userEmail} 
            onChange={(e) => setUserEmail(e.target.value)} 
          />
          <button 
            className="btn btn-secondaire" 
            type="button"
            onClick={handleNewsletterSignup}
          >
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' }} />
            {t('footer.subscribeButton')}
          </button>
    
           </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-lg-6 ">
            <ul className="footer-social-icons">
              <li><FontAwesomeIcon icon={faFacebook}  style={{ color: '#7447FF' }}/></li>
              <li><FontAwesomeIcon icon={faLinkedin} className='mx-3'  style={{ color: '#7447FF' }}/></li>
              <li><FontAwesomeIcon icon={faInstagram} className='mx-1' style={{ color: '#7447FF' }} /></li>
              <li><FontAwesomeIcon icon={faTiktok} className='mx-1' style={{ color: '#7447FF' }} /></li>

              {/* Ajoutez d'autres icônes de réseaux sociaux selon vos besoins */}
            </ul>
          </div>
          <div className="col-lg-6">
            <div className="download-buttons">
              <button className="btn btn-outline-custom-secondaire mx-2"><FontAwesomeIcon icon={faApple} /> {t('footer.downloadOnAppStore')}</button>
              <button className="btn btn-outline-custom-primaire mx-2"><FontAwesomeIcon icon={faAndroid} /> {t('footer.downloadOnGooglePlay')}</button>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-lg-12 text-center">
            <p>{t('footer.copyRight')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
