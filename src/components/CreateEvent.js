
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import GoogleMapReact from 'google-map-react';
import MapComponent from './MyMapComponent';
import { transcode } from 'buffer';

const CreateEvent = () => {
    const [selectedImage, setSelectedImage] = useState(null);


    const defaultProps = {
        center: {
          lat: 10.99835602,
          lng: 77.01502627
        },
        zoom: 11
      };


      const [formData, setFormData] = useState({
        file: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        unsubscribeDeadline : '',
        location: '',
        repeat: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        },
        currency: '',
        city: '',
        category: [],
        showLocation:'',
        price: 0,
        type: 'public'
      });

      const [cityGoogle, SetCityGoogle] = useState('');
      const [showLocation, setShowLocation] = useState(false);

      const [showMap, setShowMap] = useState(false); // État pour contrôler l'affichage de la carte

      const openMap = () => {
        setShowMap(true);
      };
    
      // Fonction pour gérer la fermeture de la carte
      const closeMap = () => {
        setShowMap(false);
      };

      
      

      const cities = [
        { label: "Abu Dhabi", value: "Abu Dhabi", latitude: 24.4539, longitude: 54.3773 },
        { label: "Dubai", value: "Dubai", latitude: 25.276987, longitude: 55.296249 },
        { label: "Paris", value: "Paris", latitude: 48.8566, longitude: 2.3522 },
        { label: "London", value: "London", latitude: 51.5074, longitude: -0.1278 },
        { label: "Marrakech", value: "Marrakech", latitude: 31.6295, longitude: -7.9811 },
        { label: "Tunis", value: "Tunis", latitude: 36.8065, longitude: 10.1815 },
        { label: "New York", value: "New York", latitude: 40.7128, longitude: -74.0060 },
        { label: "Tokyo", value: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
        { label: "Sydney", value: "Sydney", latitude: -33.8688, longitude: 151.2093 },
    ];
    

      const options = [
        { value: 'USD', label: 'USD', icon: <img src="https://flagcdn.com/24x18/us.png" alt="Drapeau USD" /> },
        { value: 'EUR', label: 'EUR', icon: <img src="https://flagcdn.com/24x18/eu.png" alt="Drapeau EUR" /> },
        { value: 'GBP', label: 'GBP', icon: <img src="https://flagcdn.com/24x18/gb.png" alt="Drapeau GBP" /> },
        // Ajoutez d'autres options avec les drapeaux correspondants
      ];

      
      
      
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
    
      // Fonction pour traiter la sélection de la ville
      const handleCitySelect = (selectedOption) => {
        SetCityGoogle(selectedOption);
        setFormData({ ...formData, city: selectedOption });
    };
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dateStart') {
          const endDateValue = formData.dateEnd;
          // Vérifier si la date de début est postérieure à la date de fin
          if (endDateValue !== ''){
          if (value > endDateValue) {
            alert("La date de début ne peut pas être postérieure à la date de fin");
            return;
          }
        }

          const currentDate = new Date().toISOString().slice(0, 16);
          if (value < currentDate) {
            alert("La date de début ne peut pas être antérieure à la date actuelle");
            return;
          }
        } else if (name === 'dateEnd') {
          const startDateValue = formData.startDate;
          // Vérifier si la date de fin est antérieure à la date de début
          if (value < startDateValue) {
            alert("La date de fin ne peut pas être antérieure à la date de début");
            return;
          }
          // Vérifier si la date de fin est postérieure à la date actuelle
          const currentDate = new Date().toISOString().slice(0, 16);
          if (value < currentDate) {
            alert("La date de fin ne peut pas être antérieure à la date actuelle");
            return;
          }
        } else if ( name === 'unsubscribeDeadline'){
          const startDateValue = formData.dateStart;
          if (value > startDateValue) {
            alert("La date de fin ne peut pas être postérieure à la date de début");
            return;
          }
          // Vérifier si la date de fin est postérieure à la date actuelle
          const currentDate = new Date().toISOString().slice(0, 16);
          if (value < currentDate) {
            alert("La date de fin ne peut pas être antérieure à la date actuelle");
            return;
          }
        }

        
        setFormData({ ...formData, [name]: value });
      };
    
    
      const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });

        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = () => {
          setSelectedImage(reader.result); 
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };


      const handleRemoveImage = () => {
        setSelectedImage(null); // Réinitialiser l'état de l'image sélectionnée
      };
      const handleCheckboxChange = (e) => {
        setFormData({ ...formData, repeat: { ...formData.repeat, [e.target.id]: e.target.checked } });
      };


    const handleToggleSwitch = () => {
        setShowLocation(!showLocation);
        setFormData({ ...formData, showLocation: !showLocation });

      };


      const handleCategorySelect = (selectedOptions) => {
        console.log(selectedOptions);
        setFormData({ ...formData, category: selectedOptions });
      };
    
      const handleCurrencySelect = (selectedOption) => {
        setFormData({ ...formData, currency: selectedOption.value });
    };
    const handleSelectLocation = (location) => {
        console.log("Emplacement choisi :", location);

        setFormData({ ...formData, location: location});
      };


      const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            console.log(formData)

          const response = await axios.post('http://localhost:5000/activitys/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log('Réponse de l\'API :', response.data);
          const message = `L'événement "${response.data.name}" a été mis à jour avec succès`;
          localStorage.setItem('successMessage', message);
          window.location.href = '/myevents';
            
        
        
        } catch (error) {
          console.error('Erreur lors de la soumission du formulaire :', error);
          // Gérez l'erreur ou affichez un message d'erreur à l'utilisateur
        }
      };
return (


    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel"> Ajouter un événement
          </h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form onSubmit={handleSubmit}>

        <div className="modal-body">
    

        <div className="mb-3">
        {!selectedImage && (


          <label class="custum-file-upload" for="file">
<div class="icon">
<svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clip-rule="evenodd" fill-rule="evenodd"></path> </g></svg>
</div>
<div class="text text-center">
 <span>Ajouter une photo de vignette de l'événement</span><br/>
 <span className='text-danger'>JPG, PNG, HEIC</span>

 </div>
 <input type="file" id="file" name="file" onChange={handleFileChange}     accept="image/png, image/jpeg"  required/>
</label>

        )}
{selectedImage && (
    <div style={{ position: 'relative', display: 'inline-block' }}>
    <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%' }} />
    {/* Positionner l'icône de fermeture en haut à droite */}
    <FontAwesomeIcon
      icon={faTimes}
      onClick={handleRemoveImage}
      style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        cursor: 'pointer',
        zIndex: 1 ,
        color : '#7447FF',
        background : 'transaprant',
        texShadow : '0px 4px 8px #000'
      }}
    />
  </div>
  )}
        </div>



        <div className="mb-3">
        <label>Ajouter le titre de l'évenement : </label>

          <input type="text" className="form-control" name='title' placeholder="Titre de l'événement" value={formData.title}  onChange={handleChange} />
        </div>
        <div className="mb-3">
        <label>Ajouter une description de l'évenement :</label>

          <textarea className="form-control" name='description' placeholder="Description de l'événement" value={formData.description}  onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Date de début :</label>
          <input type="datetime-local" className="form-control" name='dateStart' value={formData.dateStart} onChange={handleChange} />
          </div>
        <div className="mb-3">
          <label>Date de fin :</label>
          <input type="datetime-local" className="form-control" name='dateEnd' value={formData.dateEnd} onChange={handleChange} />
          </div>

        <div className="mb-3">
        <label>Date de fin de l'inscription :</label>
        <input type="datetime-local" className="form-control" name='unsubscribeDeadline' value={formData.unsubscribeDeadline} onChange={handleChange} />
      </div>
        <div className="mb-3">
          <label>Répéter l'événement chaque :</label>
          <div>
          <div>
          <input type="checkbox" className='form-check-input form-checkbox' id="monday"       checked={formData.repeat.monday} 
          onChange={handleCheckboxChange} />
          <label htmlFor="monday" >Lun</label>
          <input type="checkbox" className='form-check-input form-checkbox ms-1' id="tuesday"      checked={formData.repeat.tuesday} 
          onChange={handleCheckboxChange}  />
          <label htmlFor="tuesday">Mar</label>
          <input type="checkbox" className='form-check-input form-checkbox ms-1' id="wednesday"      checked={formData.repeat.wednesday} 
          onChange={handleCheckboxChange}  />
          <label htmlFor="wednesday">Mer</label>
          <input type="checkbox" className='form-check-input form-checkbox ms-1' id="thursday"      checked={formData.repeat.thursday} 
          onChange={handleCheckboxChange}  />
          <label htmlFor="thursday">Jeu</label>
          <input type="checkbox" className='form-check-input form-checkbox ms-1' id="friday"      checked={formData.repeat.friday} 
          onChange={handleCheckboxChange}  />
          <label htmlFor="friday">Ven</label>
          <input type="checkbox" className='form-check-input form-checkbox ms-1' id="saturday"      checked={formData.repeat.saturday} 
          onChange={handleCheckboxChange}  />
          <label htmlFor="saturday">Sam</label>
          <input type="checkbox" className='form-check-input form-checkbox ms-1' id="sunday"      checked={formData.repeat.sunday} 
          onChange={handleCheckboxChange}  />
          <label htmlFor="sunday">Dim</label>
        </div>
          </div>
        </div>
        <div className="mb-3">
          <label>Ville :</label>
          <Select options={cities} value={formData.city} onChange={handleCitySelect} />
          </div>

          
        <div className="mb-3">
        <label>Emplacement :</label>
        <div className='mt-3'>
         
        <span onClick={openMap} style={{cursor:'pointer',color:'#7447FF'}}>
        <FontAwesomeIcon icon={faMapMarkerAlt}   /> Sélectionnez votre broche sur la carte
      </span>
        </div>
        {/* Afficher la carte si showMap est true */}
        {showMap && formData.city && <MapComponent  city={cityGoogle} onSelectLocation={handleSelectLocation} />}
        <label class="toggle-switch mt-3 ">
        <span class="toggle-switch-text me-5">Montrer l'adresse :</span> 

        <input type="checkbox" checked={showLocation} onChange={handleToggleSwitch} />
        <div class="toggle-switch-background">
          <div class="toggle-switch-handle"></div>
        </div>
        </label>
        </div>
        {showLocation ? (
          formData.location ? (
            <p>Emplacement choisi : {formData.location}</p>
          ) : (
            <p>Pas d'adresse disponible pour le moment</p>
          )
        ) : null}
        
        

        <div className="mb-3">
          <label>Catégorie :</label>
          <Select
          options={categories}
          isMulti
          value={formData.category}
          onChange={(selectedOptions) => handleCategorySelect(selectedOptions)}
        />
        
        
                      </div>
       
      <div className="mb-3">
        <label>Prix :</label>
        
        <div className="input-group">
        <Select
        options={options}
        value={options.find(option => option.value === formData.currency)}
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
      <input type="number" className="form-control mx-1" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
      </div>
      </div>
      
        <div className="mb-3">
          <label>Type :</label>
          <div>
            <input type="radio" id="public" className='form-check-input form-radio' name="type" value="public" checked={formData.type === 'public'} onChange={() => setFormData({ ...formData, type:'public'})} />
            <label htmlFor="public" className='ms-1'>Public</label> 
            <input type="radio" id="private" name="type" className='form-check-input form-radio ms-3' value="private" checked={formData.type === 'private'} onChange={() => setFormData({ ...formData, type:'private'})}/>
            <label htmlFor="private" className='ms-1'>Privé</label>
          </div>
        </div>

                    </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-secondaire">Ajouter</button>
          </div>

        </form>

      </div>
    </div>
  </div>  

);


}

export default CreateEvent;