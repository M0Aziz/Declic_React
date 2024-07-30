import React, { useEffect, useState } from 'react';
import axios from 'axios';
import image1 from '../Wavy_Bus-19_Single-03.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faHandshake, faMapMarkerAlt, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);

  
  useEffect(() => {


    if (i18n.language) {
        setLanguageInitialized(true);
    }
  }, [i18n.language]);
  
  if (!languageInitialized) {
    return null; 
  }
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if(!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message ){

      toast.error(t("contactUs.fieldsRequired"));
      return;
    }
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/contact', formData);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      toast.success(t("contactUs.messageSent"));

    } catch (error) {
      console.error(error);
      alert(t("contactUs.sendError"));
    }

    setIsSubmitting(false);

  };

  return (
    <div className='container mb-5'>
    {/* <ToastContainer /> */}
    <div className='row mt-4 '>
    <div className='col-3'>

    
    <Link to="#" name='retour' onClick={() => window.history.back()} style={{ textDecoration: 'none', color: 'inherit' }}>
      <FontAwesomeIcon icon={faArrowLeft} className='me-2'/> {t("event.back")}
    </Link>
    
    
            </div>
            <div className='col-6'>
    
                    <h1 className='text-center text-uppercase'>{t("contactUs.title")}</h1>
            </div>
            </div>
    <form onSubmit={handleSubmit} className="row mt-5">
  <div className="col-lg-6">
    <div className="row mb-3 mt-4">
      <div className="col-md-6">
        <input type="text" className="form-control" name="firstName" placeholder={t("contactUs.firstNamePlaceholder")} value={formData.firstName} onChange={handleChange} />
      </div>
      <div className="col-md-6">
        <input type="text" className="form-control" name="lastName" placeholder={t("contactUs.lastNamePlaceholder")} value={formData.lastName} onChange={handleChange} />
      </div>
    </div>
    <div className="mb-3 mt-4">
      <input type="email" className="form-control" name="email" placeholder={t("contactUs.emailPlaceholder")} value={formData.email} onChange={handleChange} />
    </div>
    <div className="mb-3 mt-4">
      <input type="text" className="form-control" name="subject" placeholder={t("contactUs.subjectPlaceholder")} value={formData.subject} onChange={handleChange} />
    </div>
    <div className="mb-3 mt-4">
      <textarea className="form-control" name="message" placeholder={t("contactUs.messagePlaceholder")} value={formData.message} onChange={handleChange} />
    </div>
    <button type="submit" name='submit' className="btn btn-secondaire mt-4" disabled={isSubmitting}>
    
    {isSubmitting ? t("contactUs.sendingButton") : t("contactUs.sendButton")}

    </button>
  </div>
  <div className="col-lg-6 text-center">
    <img src={image1} className="img-fluid" width={'350px'} alt="image" />
  </div>
</form>

<div className="row mt-5">
  <div className="col">
    <p className="text-muted">
      <FontAwesomeIcon icon={faHandshake} style={{color:'#7447FF'}} className="me-2" /> {t("contactUs.introText")}
  </p>
  </div>
</div>


<div className="row mt-3">
  <div className="col-lg-4 border-end">
    <p className="text-muted">
   
      <FontAwesomeIcon icon={faPhoneAlt} style={{color:'#7447FF'}} className="me-2" />  {t("contactUs.phoneInfo")} <a style={{textDecoration:'none'}} name='tel' href="tel:+123456789">{t("contactUs.phoneNumber")}</a>.
  </p>
  </div>

  <div className="col-lg-4 border-end">
    <p className="text-muted">
    
      <FontAwesomeIcon icon={faEnvelope} style={{color:'#7447FF'}} className="me-2" /> {t("contactUs.emailInfo")} <a style={{textDecoration:'none'}} name='email' href="mailto:contact@declic.com">{t("contactUs.emailAddress")}</a>.
          </p>
  </div>



  <div className="col-lg-4">
    <p className="text-muted">
   
      <FontAwesomeIcon icon={faMapMarkerAlt} style={{color:'#7447FF'}} className="me-2" /> {t("contactUs.addressInfo")} {t("contactUs.address")}
    </p>
  </div>
</div>
    </div>
   
  );
};

export default ContactUsForm;
