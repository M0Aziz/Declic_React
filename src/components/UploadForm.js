import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    image: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('prenom', formData.prenom);
    data.append('image', formData.image);

    try {
      await axios.post('http://localhost:5000/test/api/upload', data);
      console.log('Données envoyées avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
      <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
      <input type="file" name="image" onChange={handleFileChange} />
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default UploadForm;
