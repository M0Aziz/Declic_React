import React from 'react';
import { Button } from 'react-admin';

const LogoutButton = () => {

    const handleLogout = () => {
        // Mettez ici votre logique de déconnexion
        // Par exemple, supprimer le token JWT de localStorage
        localStorage.removeItem('token');
        // Redirigez l'utilisateur vers la page de connexion
        window.location.href = '/login';
    };

    return (
        <Button label="Déconnexion" onClick={handleLogout} />
    );
};

export default LogoutButton;
