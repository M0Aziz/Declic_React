import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const EditMapComponent = ({ location, onSelectLocation }) => {
    const [center, setCenter] = useState(null);
  
    useEffect(() => {
      if (location) {
        const fetchCoordinates = async () => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
            const data = await response.json();
            console.log('Response from Nominatim:', data); // Vérifier la structure de la réponse
            if (data && data.length > 0) {
              const firstResult = data[0];
              const lat = parseFloat(firstResult.lat);
              const lon = parseFloat(firstResult.lon);
              setCenter({ lat, lng: lon });
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des coordonnées depuis l\'adresse :', error);
          }
        };
        fetchCoordinates();
      }
    }, [location]);
  
    return (
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDO8V7kPTfg09AmWWLt-7TBoJupdAsvt04' }} 
          defaultCenter={{ lat: 48.8566, lng: 2.3522 }} 
          defaultZoom={11}
          center={center}
          onClick={({ lat, lng }) => onSelectLocation(`${lat}, ${lng}`)}
        >
          {center && <AnyReactComponent lat={center.lat} lng={center.lng} text="My Marker" />}
        </GoogleMapReact>
      </div>
    );
  };
  
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  
  export default EditMapComponent;
  