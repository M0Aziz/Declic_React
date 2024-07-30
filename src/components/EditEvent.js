import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faChevronRight, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import GoogleMapReact from 'google-map-react'; 
import MapComponent from './MyMapComponent';
import './Myevents.css'
import EditMapComponent from './EditMyMapComponent';
import { useNavigate  } from 'react-router-dom';
const EditEvent = ({ eventId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate(); 

    const [eventData, setEventData] = useState({
        repeat: [], // Initialiser la propriété repeat comme un tableau vide

        category: [],
    });


    


    const [showMap, setShowMap] = useState(false); // État pour afficher ou masquer la carte
    const [showLocation, setShowLocation] = useState(false); // État pour afficher ou masquer l'emplacement
    const [cityGoogle, setCityGoogle] = useState(''); // État pour stocker la ville sélectionnée sur Google Maps

    const token = localStorage.getItem('token');




    const cities = [
        { label: "Abu Dhabi", value: "Abu Dhabi", latitude: 24.4539, longitude: 54.3773 },
        { label: "Dubai", value: "Dubai", latitude: 25.276987, longitude: 55.296249 },
        { label: "Paris", value: "Paris", latitude: 48.8566, longitude: 2.3522 },
        { label: "London", value: "London" },
        { label: "Marrakech", value: "Marrakech" },
        { label: "Tunis", value: "Tunis" },
        { label: "New York", value: "New York" },
        { label: "Tokyo", value: "Tokyo" },
        { label: "Sydney", value: "Sydney" },
      ];



      const options = [
        { value: 'USD', label: 'USD', icon: <img src="https://flagcdn.com/24x18/us.png" alt="Drapeau USD" /> },
        { value: 'EUR', label: 'EUR', icon: <img src="https://flagcdn.com/24x18/eu.png" alt="Drapeau EUR" /> },
        { value: 'GBP', label: 'GBP', icon: <img src="https://flagcdn.com/24x18/gb.png" alt="Drapeau GBP" /> },
      ];


    useEffect(() => {
if (eventId){
        console.log('EventId', eventId);

        const fetchEventData = async () => {
            try {
              await  axios.get(`http://localhost:5000/activitys/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    const eventData = response.data;
                    setEventData(eventData);

                    console.log(eventData);
                })
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'événement :', error);
            }
        };

        fetchEventData();

    }
    }, [eventId]);

  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };
    


    const handleCitySelect = (selectedOption) => {

        setCityGoogle(selectedOption);
        setEventData({ ...eventData, city: selectedOption.value });
    };
  
    const categories = [
        { label: 'Sports', value: 'Sports' },
        { label: 'Musique', value: 'Musique' },
        { label: 'Cuisine', value: 'Cuisine' },
        { label: 'Voyage', value: 'Voyage' },
        { label: 'Art', value: 'Art' },
        { label: 'Technologie', value: 'Technologie' },
        { label: 'Photographie', value: 'Photographie' },
        { label: 'Mode', value: 'Mode' },
        { label: 'Lecture', value: 'Lecture' },
        { label: 'Jardinage', value: 'Jardinage' },
        { label: 'Danse', value: 'Danse' },
        { label: 'Fitness', value: 'Fitness' }
      ];


      const handleRemoveImage = () => {
        setSelectedImage(null); 
      };
      const  handleRemoveImageExsite = () => {
        setEventData({ ...eventData, image: null }); 

      }

      const handleSelectLocation = (location) => {

        console.log(location);
        setEventData({ ...eventData, location });
        setShowLocation(true);
    };


    const handleToggleSwitch = () => {
        setEventData(prevEventData => ({
          ...prevEventData,
          showLocation: !prevEventData.showLocation
        }));
      };
      


      const handleFileChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            setEventData({ ...eventData, file: file });
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    
   
      

      const openMap = () => {
        setShowMap(true);
      };
     const handleCategorySelect = (selectedOptions) => {
  const selectedValues = selectedOptions.map(option => option.value);
  setEventData({ ...eventData, category: selectedValues }); 
};

      
      
      
      



      const handleCurrencySelect = (selectedOption) => {
        setEventData({ ...eventData, currency: selectedOption.value });
      };

      const handleRepeatChange = (day) => {
        const index = eventData.repeat.indexOf(day);
        if (index === -1) {
            setEventData(prevEventData => ({ ...prevEventData, repeat: [...prevEventData.repeat, day] }));
        } else {
            const updatedRepeat = [...eventData.repeat];
            updatedRepeat.splice(index, 1);
            setEventData(prevEventData => ({ ...prevEventData, repeat: updatedRepeat }));
        }
    };
    
    const handleEdit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', eventData.name);
        if (eventData.file) {
          formData.append('file', eventData.file);
        }
        formData.append('description', eventData.description);
        formData.append('startDate', eventData.dateStart);
        formData.append('endDate', eventData.dateEnd);
        formData.append('unsubscribeDeadline', eventData.unsubscribeDeadline);
        formData.append('location', eventData.location);
        formData.append('repeat', JSON.stringify(eventData.repeat)); // Assurez-vous de convertir le tableau en JSON
        formData.append('currency', eventData.currency);
        formData.append('city', eventData.city);

      
            formData.append('category[]', eventData.category); // Ajouter la catégorie avec le nom "category"
        
          
        
        formData.append('price', eventData.price);
        formData.append('profileType', eventData.profileType);
        

try {
            console.log("Données de l'événement à envoyer :", ...formData);
    
            const response = await axios.put(`http://localhost:5000/activitys/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            const message = `Profil de l'événement "${response.data.name}" mis à jour avec succès`;
           await localStorage.setItem('successMessage', message);
            
        } catch (error) {
            console.error('Erreur lors de la modification de l\'événement :', error);
        }finally{
          window.location.href = '/myevents';


        }
    };
    

    return (
        <div class="modal fade" id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{eventData.name}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form onSubmit={handleEdit} className='text-start'>

      <div class="modal-body">
     
    <div className="mb-3">
        {(!selectedImage && !eventData.image) && (
            <label className="custom-file-upload" htmlFor="file">
                <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
                        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </g>
                    </svg>
                </div>
                <div className="text text-center">
                    <span>Modifier la photo de vignette de l'événement</span><br/>
                    <span className='text-danger'>JPG, PNG, HEIC</span>
                </div>
                <input type="file" id="file" name="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
            </label>
        )}
        {selectedImage  && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%' }} />
                <FontAwesomeIcon
                    icon={faTimes}
                    onClick={handleRemoveImage}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        cursor: 'pointer',
                        zIndex: 1,
                        color: '#7447FF',
                        background: 'transparent',
                        textShadow: '0px 4px 8px #000'
                    }}
                />
            </div>
        )}

        {eventData.image && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={`http://localhost:5000/images/${eventData.image}`} alt="Selected" style={{ maxWidth: '100%' }} />
                <FontAwesomeIcon
                    icon={faTimes}
                    onClick={handleRemoveImageExsite}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        cursor: 'pointer',
                        zIndex: 1,
                        color: '#7447FF',
                        background: 'transparent',
                        textShadow: '0px 4px 8px #000'
                    }}
                />
            </div>
        )}
    </div>
    <div className="mb-3">
        <label>Modifier le titre de l'événement : </label>
        <input type="text" className="form-control" name='name' placeholder="Titre de l'événement" value={eventData.name} onChange={handleChange} />
    </div>
    <div className="mb-3">
        <label>Modifier la description de l'événement :</label>
        <textarea className="form-control" name='description' placeholder="Description de l'événement" value={eventData.description} onChange={handleChange} />
    </div>

    <div className="mb-3">
    <label>Date de début :</label>
    <input 
        type="datetime-local" 
        className="form-control" 
        name='dateStart' 
        value={eventData.dateStart ? new Date(eventData.dateStart).toISOString().slice(0, -8) : ''} 
        onChange={handleChange} 
    />
    
    </div>
<div className="mb-3">
    <label>Date de fin :</label>
    <input type="datetime-local" className="form-control" name='dateEnd'
    value={eventData.dateEnd ? new Date(eventData.dateEnd).toISOString().slice(0, -8) : ''} 
    onChange={handleChange} />
    </div>
<div className="mb-3">
    <label>Date de fin de l'inscription :</label>
    <input type="datetime-local" className="form-control" name='unsubscribeDeadline'
    value={eventData.unsubscribeDeadline ? new Date(eventData.unsubscribeDeadline).toISOString().slice(0, -8) : ''} 
     onChange={handleChange} />
    </div>

    <div className="mb-3">
    <label>Répéter l'événement chaque :</label>
    <div>
        <input type="checkbox" className='form-check-input form-checkbox' id="monday" checked={eventData.repeat.includes("monday")} onChange={() => handleRepeatChange("monday")} />
        <label htmlFor="monday">Lun</label>
        <input type="checkbox" className='form-check-input form-checkbox ms-1' id="tuesday" checked={eventData.repeat.includes("tuesday")} onChange={() => handleRepeatChange("tuesday")} />
        <label htmlFor="tuesday">Mar</label>
        <input type="checkbox" className='form-check-input form-checkbox ms-1' id="wednesday" checked={eventData.repeat.includes("wednesday")} onChange={() => handleRepeatChange("wednesday")} />
        <label htmlFor="wednesday">Mer</label>
        <input type="checkbox" className='form-check-input form-checkbox ms-1' id="thursday" checked={eventData.repeat.includes("thursday")} onChange={() => handleRepeatChange("thursday")} />
        <label htmlFor="thursday">Jeu</label>
        <input type="checkbox" className='form-check-input form-checkbox ms-1' id="friday" checked={eventData.repeat.includes("friday")} onChange={() => handleRepeatChange("friday")} />
        <label htmlFor="friday">Ven</label>
        <input type="checkbox" className='form-check-input form-checkbox ms-1' id="saturday" checked={eventData.repeat.includes("saturday")} onChange={() => handleRepeatChange("saturday")} />
        <label htmlFor="saturday">Sam</label>
        <input type="checkbox" className='form-check-input form-checkbox ms-1' id="sunday" checked={eventData.repeat.includes("sunday")} onChange={() => handleRepeatChange("sunday")} />
        <label htmlFor="sunday">Dim</label>
    </div>
</div>

    <div className="mb-3">
        <label>Ville :</label>
        <Select options={cities} value={cities.find(city => city.value === eventData.city)} onChange={handleCitySelect} />
        </div>
    <div className="mb-3">
        <label>Emplacement :</label>
        <div className='mt-3'>
            <span onClick={openMap} style={{ cursor: 'pointer', color: '#7447FF' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Sélectionnez votre broche sur la carte
            </span>
        </div>
        {showMap && eventData.city && <MapComponent city={cityGoogle} onSelectLocation={handleSelectLocation} />}

        {!showMap && eventData.location && <EditMapComponent location={eventData.location} onSelectLocation={handleSelectLocation} />}

        <label className="toggle-switch mt-3">
        <span className="toggle-switch-text me-5">Montrer l'adresse :</span>
        <input type="checkbox" checked={eventData.showLocation}  onChange={handleToggleSwitch} />
        <div className="toggle-switch-background">
          <div className={`toggle-switch-handle ${showLocation ? 'toggle-switch-handle-checked' : ''}`}></div>
        </div>
      </label>
      
    </div>
    {eventData.showLocation ? (
        eventData.location ? (
            <p>Emplacement choisi : {eventData.location}</p>
        ) : (
            <p>Pas d'adresse disponible pour le moment</p>
        )
    ) : null}
    <div className="mb-3">
    <label>Catégorie :</label>
    <Select
    options={categories}
    isMulti
    value={categories.filter(category => eventData.category.includes(category.value))}
    onChange={(selectedOptions) => handleCategorySelect(selectedOptions)}
  />
  
  



  </div>
  
  <div className="mb-3">
  <label>Prix :</label>
  <div className="input-group">
    <Select
      options={options}
      value={options.find(option => option.value === eventData.currency)}
      onChange={handleCurrencySelect}
      isSearchable={false}
      getOptionLabel={(option) => (
        <div>
          {option.icon}
          {option.label}
        </div>
      )}
      getOptionValue={(option) => option.value}
    />
    <input 
      type="number" 
      className="form-control mx-1" 
      value={eventData.price} 
      onChange={(e) => setEventData({ ...eventData, price: e.target.value })} 
    />
  </div>
</div>
<div className="mb-3">
<label>Type :</label>
<div>
  <input 
    type="radio" 
    id="public" 
    className="form-check-input form-radio" 
    name="type" 
    value="public" 
    checked={eventData.profileType === 'public'} 
    onChange={() => setEventData({ ...eventData, profileType: 'public' })} 
  />
  <label htmlFor="public" className="ms-1">Public</label>
  
  <input 
    type="radio" 
    id="private" 
    name="type" 
    className="form-check-input form-radio ms-3" 
    value="private" 
    checked={eventData.profileType === 'private'} 
    onChange={() => setEventData({ ...eventData, profileType: 'private' })} 
  />
  <label htmlFor="private" className="ms-1">Privé</label>
</div>
</div>
{!eventData.visibility && (
  <div>
  <hr></hr>
    <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#7447FF' }} className="me-2" />
    <span>Cet événement n'est plus visible. Il a peut-être été désactivé par l'administrateur. Veuillez le contacter pour plus d'informations.</span>
  </div>
)}


</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  <button type="submit" className="btn btn-secondaire" disabled={!eventData.visibility}>Enregistrer les modifications</button>
  </div>

</form>

</div>
</div>
</div>
    );
};

export default EditEvent;
