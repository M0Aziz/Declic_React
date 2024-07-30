import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/users/reset-password', { email });
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response?.data || 'Une erreur s\'est produite.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="reset-password-container">
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="email">Adresse Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Entrez votre adresse mail'
          />
        </div>
        <button type="submit mt-4" className="btn btn-secondaire" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Réinitialiser'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
