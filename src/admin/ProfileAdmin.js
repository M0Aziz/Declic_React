import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Avatar, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const ProfileAdmin = () => {
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const [user, setUser] = useState({});
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const theme = localStorage.getItem('RaStore.theme'); // Utilisez le hook useThemeContext

    useEffect(() => {
        // Remplacez l'URL par celle de votre backend
        fetch('http://localhost:5000/users/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Erreur lors de la récupération des informations du profil:', error));
    }, []);


    const handleShowPasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        setPassword('');
        setRepeatPassword('');
        setPasswordError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value !== repeatPassword) {
            setPasswordError('Les mots de passe ne correspondent pas');
        } else {
            setPasswordError('');
        }
    };

    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
        if (e.target.value !== password) {
            setPasswordError('Les mots de passe ne correspondent pas');
        } else {
            setPasswordError('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser(prevUser => ({ ...prevUser, profilePicture: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageRemove = () => {
        setSelectedImage(null);
        setUser(prevUser => ({ ...prevUser, profilePicture: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.firstName || !user.lastName || !user.profilePicture ) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
    
        console.log('showPasswordFields',showPasswordFields);
   if (showPasswordFields){
        // Vérifier si les mots de passe correspondent
        if (password !== repeatPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        if (!password || !repeatPassword) {
            alert('Veuillez remplir Les mots de passe.');
            return;
        }
    }
        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('password', user.password); // Assurez-vous de gérer correctement le champ password côté backend
        formData.append('profilePicture', user.profilePicture);
    
        try {
            const response = await axios.put('http://localhost:5000/users/admin/information', formData, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data'
                }
              });
    
              if (response.status !== 200) {
                throw new Error('Erreur lors de la mise à jour du profil');
            }
    
            alert('Profil mis à jour avec succès');
            navigate('/admin');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
        }
    };
    

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <section style={{
            backgroundColor: theme === `"light"` ? '#fff' : '#303030',
            color: theme === `"light"` ? '#000' : '#fff',
            padding: '20px',
            borderRadius: '8px', height:'750px'
        }} >
        <Container >
        <h2 className='mt-5'>Modifier votre profil</h2>
        <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Prénom"
                            name="firstName"
                            value={user.firstName || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"

                            InputLabelProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                            InputProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Nom"
                            name="lastName"
                            value={user.lastName || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                            InputProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={7}>
                        <TextField
                            label="Email"
                            name="email"
                            value={user.email || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                                style: { color: theme === `"light"` ? '#000' : '#fff' } 
                            }}
                            InputLabelProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                        />
                    </Grid>
                    {!user.profilePicture && (

                    <Grid item xs={4} >
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                                fullWidth
                                style={{ backgroundColor: '#7447FF' }}

                            >
                                Choisir une image
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleImageChange}
                                    />
                            </Button>
                    </Grid>
                )}

                    {(user.profilePicture || selectedImage) && (
                        <Grid item xs={4} container alignItems="center" >
                            <Grid item>
                                <Avatar 
                                    src={selectedImage ? user.profilePicture : `http://localhost:5000/images/${user.profilePicture}`} 
                                    alt="Profile" 
                                />
                            </Grid>
                            <Grid item>
                                <IconButton  onClick={handleImageRemove}>
                                    <DeleteIcon style={{color : '#7447FF'}}  />
                                </IconButton>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
               
                <Button onClick={handleShowPasswordFields}>
                {showPasswordFields ? 'Je veux pas changer mon mot de passe' : 'Changer mon mot de passe'}
                </Button>
                {showPasswordFields && (
                    <>
                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            fullWidth
                            margin="normal"

                            InputLabelProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                            InputProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                        />
                        <TextField
                            label="Répéter le mot de passe"
                            type="password"
                            value={repeatPassword}
                            onChange={handleRepeatPasswordChange}
                            fullWidth
                            margin="normal"
                            error={Boolean(passwordError)}
                            helperText={passwordError}

                            InputLabelProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                            InputProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                        />
                    </>
                )}


                <TextField
                    label="Rôle"
                    name="role"
                    value={user.role || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                        style: { color: theme === `"light"` ? '#000' : '#fff' }
                    }}

                                                InputLabelProps={{ style: { color: theme === `"light"` ? '#000' : '#fff' } }}
                />
                <Grid container spacing={2} className='mt-4' justifyContent="flex-start">
                    <Grid item>
                        <Button type="submit" variant="contained" style={{  backgroundColor: '#7447FF',  color: 'white', borderColor: '#7447FF'}}>
                            Enregistrer
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained"     style={{ backgroundColor: '#6c757d', color: '#fff' }}
                        onClick={handleCancel}>
                            Annuler
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
        </section>
    );
};

export default ProfileAdmin;
