import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import image1 from '../about_us.jpg'
const AboutUsPage = React.memo(() => {
  const { t, i18n } = useTranslation();
  const [languageInitialized, setLanguageInitialized] = useState(false);
  const [mountCount, setMountCount] = useState(0); // État local pour suivre le nombre de montages

  useEffect(() => {


      if (i18n.language) {
          setLanguageInitialized(true);
      }
  }, [i18n.language]);

  if (!languageInitialized) {
      return null; 
  }

  return (
    <div className="container mb-5">
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>        {t('aboutUsPage.title')}          </h2>
<p>{t('aboutUsPage.description1')}  </p>
<p>{t('aboutUsPage.description2')}  </p>

<p>{t('aboutUsPage.description3')}  </p>

<p>{t('aboutUsPage.description4')}  </p>
<p>{t('aboutUsPage.description5')}  </p>

  </div>
        <div className="col-md-6">
        <img src={image1} className='img-fluid'/>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
   

          <h2>{t('aboutUsPage.title2')} </h2>
          <p>{t('aboutUsPage.description6')}  </p>
          <p>{t('aboutUsPage.description7')}  </p>
          <p>{t('aboutUsPage.description8')}  </p>
          <p>{t('aboutUsPage.description9')}  </p>
          <p>{t('aboutUsPage.description10')}  </p>
           </div>
      </div>
    </div>
  );
});

export default AboutUsPage;
