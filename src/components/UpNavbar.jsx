import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faGlobe, faTiktok, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const UpNavbar = ({ isAuthenticated }) => {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'fr'); // Par défaut, utilisez 'fr' si aucune langue n'est sélectionnée

  const { t ,i18n } = useTranslation();
  console.log('Current language:', language);
  useEffect(() => {
    if (isAuthenticated) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });

          translateCoordsToAddress(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.error('Erreur lors de la récupération de la position :', error);
          setCoords(null);
          setAddress('Localisation non disponible');
        }
      );
    }
  }, [isAuthenticated]);

  const translateCoordsToAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      console.log(data);
      //data.display_name
      const address = data.address.county+', '+data.address.country;
      setAddress(address);
    } catch (error) {
      console.error('Erreur lors de la traduction des coordonnées en adresse :', error);
      setAddress('Adresse non disponible');
    }
  };

  useEffect(() => {
    console.log('Updating language:', language);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language); // Stockez la langue sélectionnée dans localStorage
  }, [language]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    console.log('Selected language:', selectedLanguage);
    setLanguage(selectedLanguage);
  };

/*
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };*/


  const options = [
    {
      value: 'fr',
      label: (
        <div>
          <img src="https://flagcdn.com/24x18/fr.png" alt="Français" style={{ marginRight: '8px' }} />
          Français
        </div>
      )
    },
    {
      value: 'en',
      label: (
        <div>
          <img src="https://flagcdn.com/24x18/us.png" alt="English" style={{ marginRight: '8px' }} />
          English
        </div>
      )
    }
  ];

  const selectedOption = options.find(option => option.value === language);

  const handleChange = (selectedOption) => {
    handleLanguageChange({ target: { value: selectedOption.value } });
  };


  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '35px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '35px',
      display: 'flex',
      alignItems: 'center'
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '35px',
    }),
  };
  return (
    <div className="container">
      <div className="row mt-1 mb-1 ">
        <div className="col-lg-6 col-4 mt-lg-0 mt-md-0 mt-2">
          {/* Icônes des réseaux sociaux */}
          <FontAwesomeIcon icon={faFacebook} className="me-3" style={{ color: '#3b5998' }} />
          <FontAwesomeIcon icon={faTiktok} className="me-3" style={{ color: '#000000' }} />
          <FontAwesomeIcon icon={faInstagram} className="me-3" style={{ color: '#c13584' }} />
          <FontAwesomeIcon icon={faLinkedin} className="me-3" style={{ color: '#0077b5' }} />
          
        </div>
        <div className="col-lg-4 col-8 text-end mt-lg-1 mt-md-0 mt-2">
          {isAuthenticated && coords ? (
            <>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" style={{color:'#7447FF'}} />
              <span className="text-muted me-4">{t('navbar.location.Available')}: {address}</span>
            </>
          ) : (
            <span className="text-muted me-4">{t('navbar.location.notAvailable')}</span>
          )}
        </div>
        <div className="col-lg-2 mt-lg-0 mt-md-0 mt-2 ">
        <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        styles={customStyles}
      />

    {/*
     <select className="form-select" aria-label="Select Language" value={language} onChange={handleLanguageChange}>
      <option value="fr">{t('navbar.languageSelect.french')}<img src="https://flagcdn.com/24x18/us.png" alt="Drapeau USD" /></option>
      <option value="en">{t('navbar.languageSelect.english')}</option>
    </select> 
        */}
        </div>
      </div>
    </div>
  );
};

export default UpNavbar;
