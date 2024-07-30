/*import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MyMapComponent = ({ center }) => (
  <MapContainer center={center} zoom={13} style={{ width: '100%', height: '400px' }}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {/* Afficher le marqueur à la position de la ville }  
    /*{center && <Marker position={center}>
      <Popup>Votre emplacement sélectionné</Popup>
    </Marker>}
  </MapContainer>
);

export default MyMapComponent;*/




import React from 'react';
import GoogleMapReact from 'google-map-react';

const MapComponent = ({ city, onSelectLocation  }) => {
  const defaultProps = {
    center: {
      lat: city ? city.latitude : 0,
      lng: city ? city.longitude : 0
    },
    zoom: 11
  };
  const AnyReactComponent = ({ text }) => <div>{text}</div>;


  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        console.log(data);
        //data.display_name
        const address = data.display_name;
        //data.address.county+', '+data.address.country;

        return address;
       // setAddress(address);
      } catch (error) {
        console.error('Erreur lors de la traduction des coordonnées en adresse :', error);
       // setAddress('Adresse non disponible');
      }
  };
  
  const handleMapClick = async (event) => {
    console.log("Event:", event);

    // Vérifier si event.latLng est défini
    if (event) {
      // Récupérer les coordonnées du clic sur la carte
      // Appeler la fonction onSelectLocation avec les coordonnées
     // onSelectLocation({ latitude: event.lat, longitude: event.lng });

      try {
        const address = await getAddressFromCoordinates(event.lat, event.lng);
        onSelectLocation( address);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse :', error);
      }
    }
  };
  

  return (
    <div style={{ height: '50vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDO8V7kPTfg09AmWWLt-7TBoJupdAsvt04' }} // Remplacez YOUR_API_KEY par votre clé API Google Maps
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onClick={handleMapClick}
      >
        {city && <AnyReactComponent lat={city.latitude} lng={city.longitude} text="My Marker" />}
      </GoogleMapReact>
    </div>
  );
};

export default MapComponent;

