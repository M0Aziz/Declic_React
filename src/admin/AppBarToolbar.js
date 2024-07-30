import React, { useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator, LocalesMenuButton, TextField, ToggleThemeButton, useTranslate } from 'react-admin';
import { useThemeContext } from './ThemeContext';
import axios from 'axios';
import { Badge } from '@material-ui/core';

export const AppBarToolbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeContext();
    const [profilePicture, setProfilePicture] = useState(null);

    const translate = useTranslate();



    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
              // Récupérer le token du localStorage (ou de l'endroit où vous le stockez)
              const token = localStorage.getItem('token');
        
              // Configurer les en-têtes de la requête avec le token
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
        
              // Faire une requête à votre backend pour récupérer l'URL de la photo de profil
              const response = await axios.get('http://localhost:5000/api/dashboard/profilePicture', config);
              setProfilePicture(response.data.profilePicture);
            } catch (error) {
              console.error('Erreur lors de la récupération de la photo de profil:', error);
            }
          };
    
        fetchProfilePicture();
      }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la déconnexion');
            }
    
            // Effacer le token et le rôle du localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
    
            // Rediriger vers la page de login ou la page d'accueil
            window.location.href = '/login';
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    const handleProfile = () => {
        // Rediriger vers la page de profil
        navigate('/profile/admin');
        handleClose();
    };

    return (
        <>
            <LocalesMenuButton languages={[
                { locale: 'fr', name: 'Français' },

                { locale: 'en', name: 'English' },
                { locale: 'ar', name: 'Arabe' },

            ]}  style={{ backgroundColor: '#7447FF' }} />
            <LoadingIndicator style={{ color: '#7447FF' }} />

            <ToggleThemeButton  style={{ backgroundColor: '#7447FF' }}/>


            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                
            >
            {profilePicture ? (
                <img src={`http://localhost:5000/images/${profilePicture}`} alt="profile" style={{ width: '24px', height: '24px', borderRadius: '50%' }}  />
              ) : (
                <AccountCircle style={{ color: '#7447FF' }} />
              )}
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >

            <MenuItem>
           <p>{translate('messages.welcome')}</p>
            </MenuItem>
                <MenuItem onClick={handleProfile}>            {translate('menu.profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{translate('menu.logout')}</MenuItem>

               
            </Menu>
        </>
    );
};
