import React, { useEffect, useRef } from 'react';
import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, Create, DeleteButton, Show, SimpleShowLayout, ImageField, useRecordContext, BooleanField, DateInput, EditButton, BooleanInput, FormDataConsumer, Filter, SimpleList, useTranslate, FileInput, FileField, useRedirect } from 'react-admin';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useNotify, useRefresh, useDataProvider } from 'react-admin';

import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import axios from 'axios';


const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Rechercher par nom" source="lastName" alwaysOn />
    </Filter>
);
// Liste des utilisateurs
export const UserList = (props) => {
    const translate = useTranslate(); 

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <List {...props} filters={<UserFilter />} perPage={10} title={translate('resources.users')}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.firstName}
                    secondaryText={(record) => record.lastName}
                    tertiaryText={(record) => record.email}
                    linkType="show"
                />
            ) : (
                <Datagrid rowClick="show">
                    <TextField source="firstName" label={translate('fields.firstName')}/>
                    <TextField source="lastName" label={translate('fields.lastName')}/>
                    <TextField source="email" label={translate('fields.email')}/>
                    <TextField source="role" label={translate('fields.role')}/>
                    <ImageField source='profilePicture' label={translate('fields.profilePicture')}/>
                    <BooleanField source='isBanned' label={translate('fields.isBanned')} />
                    <BooleanField source='isSuspended' label={translate('fields.isSuspended')} />
                    <EditButton label={false} />
                    <DeleteButton label={false} undoable={false} />
                </Datagrid>
            )}
        </List>
    );
};

const SuspendUserButton = ({ record }) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const handleSuspendUser = () => {
        const userId = record.id;
        const suspendedUntil = new Date(); // Exemple de date de suspension (ajustez selon vos besoins)
        const reasonForSuspension = "Raison de la suspension"; // Exemple de motif de suspension (ajustez selon vos besoins)

        dataProvider.update('users/suspend', { id: userId, data: { suspendedUntil, reasonForSuspension } })
            .then(() => {
                notify('Compte utilisateur suspendu avec succès');
                refresh();
            })
            .catch(error => {
                notify(`Erreur lors de la suspension du compte utilisateur: ${error.message}`, 'error');
            });
    };

    return (
        <button onClick={handleSuspendUser}>Suspendre le compte utilisateur</button>
    );
};




const UsersTitle = () => {
    const translate = useTranslate(); 

    const record = useRecordContext();
    if (!record) return null;
    return <span>{translate('resources.users')} <b>{record.lastName} {record.firstName}</b></span>;
};
// Édition des utilisateurs
export const UserEdit = (props) => {
    const translate = useTranslate(); 
return(
    <Edit {...props} title={<UsersTitle />}>
        <SimpleForm>
            <TextInput source="firstName" label={translate('fields.firstName')}/>
            <TextInput source="lastName" label={translate('fields.lastName')}/>
            <TextInput source="email" label={translate('fields.email')}/>
            <BooleanInput source="isSuspended" label={translate('fields.isSuspended')}/>

            {/* Afficher les champs de suspension uniquement si l'utilisateur est suspendu */}
            <FormDataConsumer>
                {({ formData, ...rest }) =>
                    formData.isSuspended ? (
                        <>
                            <DateInput source="suspensionEndDate" label="Date de suspension jusqu'à" />
                            <TextInput source="reasonForSuspension" label="Motif de la suspension" />
                        </>
                    ) : null
                }
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);
                }

// Création d'un utilisateur
/*export const UserCreate = (props) => {
    const translate = useTranslate(); 
    const notify = useNotify();

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      // Traitez le fichier ici pour obtenir l'URL ou le chemin
      // Par exemple, utilisez FileReader pour lire l'URL du fichier
  
      // Exemple d'utilisation de FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target.result; // C'est l'URL que vous devez envoyer au backend
        notify('Fichier téléchargé avec succès');
        // Maintenant, envoyez l'URL (fileUrl) au backend lorsque vous créez un utilisateur
      };
      reader.readAsDataURL(file);
    };
    return(
    <Create {...props}>
        <SimpleForm>


            <TextInput source="firstName"  label={translate('fields.firstName')}/>
            <TextInput source="lastName" label={translate('fields.lastName')}/>
            <TextInput source="email" label={translate('fields.email')}/>
            <TextInput source="password"  label={translate('fields.password')}/>

            <FileInput source="profilePicture"  label={translate('fields.profilePicture')}  onChange={handleFileChange}   accept="image/png, image/jpeg"
            />

        </SimpleForm>
    </Create>
);
                }*/


export const UserCreate = (props) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();

    const handleSubmit = async (data) => {

        try {
            // Créer une instance de FormData
            const formData = new FormData();
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('password', data.password);

            if (data.profilePicture && data.profilePicture.rawFile) {
                formData.append('profilePicture', data.profilePicture.rawFile); // Ajoutez le fichier ici
            }

            // Récupérer le token depuis localStorage
            const token = localStorage.getItem('token');
            console.log(...formData);

            // Envoyer les données à votre backend avec axios
            const response = await axios.post('http://localhost:5000/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Vérifier la réponse
            if (response.status !== 201) {
                throw new Error('Erreur lors de la création de l\'utilisateur');
            }

            notify(translate('notifications.userCreated'));
            window.location.href='/users'

            // Redirection ou autres actions après la création réussie
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            notify(translate('notifications.userCreationError'), 'warning');

        }
    };

    return (
        <Create {...props}>
            <SimpleForm onSubmit={handleSubmit}>
                <TextInput source="firstName" label={translate('fields.firstName')} />
                <TextInput source="lastName" label={translate('fields.lastName')} />
                <TextInput source="email" label={translate('fields.email')} />
                <TextInput source="password" label={translate('fields.password')} />
                      
                <FileInput source="profilePicture" label={translate('fields.profilePicture')} accept="image/png, image/jpeg">
                    <FileField source="src" title="title" />
                </FileInput>
                {/* Vous pouvez ajouter d'autres champs ici */}
            </SimpleForm>
        </Create>
    );
};

  
// Fonction pour générer le graphique des commentaires par événement
const generateCommentChart = (commentCountPerEvent) => {
    if (!commentCountPerEvent || Object.keys(commentCountPerEvent).length === 0) {
        return <p>Aucune donnée disponible</p>;
    }

    const data = Object.entries(commentCountPerEvent).map(([event, count]) => ({ event, 'Nombre de commentaires': count }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Nombre de commentaires" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};


const generateReportChart = (reportCountPerEvent) => {
    if (!reportCountPerEvent || Object.keys(reportCountPerEvent).length === 0) {
        return <p>Aucune donnée disponible</p>;
    }

    const data = Object.entries(reportCountPerEvent).map(([event, count]) => ({ event, 'Nombre de signalements': count }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Nombre de signalements" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};
// Composant pour afficher les détails de l'utilisateur
const UserDetails = () => {
    // Utiliser useRecordContext pour obtenir le record
    const record = useRecordContext();
    const translate = useTranslate(); 

    // Récupérer les données des commentaires par événement depuis le record
    const commentCountPerEvent = record ? record.commentCountPerEvent : null;
    const  reportCountPerEvent = record ? record.formattedReportedEvents : null;
    return (
        <SimpleShowLayout>
            <TextField source="id" className='mt-3' label={translate('fields.id')} />
            <TextField source="firstName" className='mt-3' label={translate('fields.firstName')} />
            <TextField source="lastName" className='mt-3' label={translate('fields.lastName')} />
            <TextField source="email" className='mt-3' label={translate('fields.email')} />
            <ImageField source="profilePicture" className='mt-3' label={translate('fields.profilePicture')}/>
            <TextField source="eventCount"   label={translate('fields.eventsCreated')} />
            <TextField source="followerCount"  label={translate('fields.followersCount')} />
            <TextField source="followingCount"   label={translate('fields.followingCount')} />
            <TextField source="username"   label={translate('fields.username')} />

            <h3 className='text-center my-4'>{translate('fields.commentsPerEvent')}</h3>
            {generateCommentChart(commentCountPerEvent)}

            <div className="chart-container">
                <h3 className='text-center my-4'>{translate('fields.reportsCount')}</h3>
                {generateReportChart(reportCountPerEvent)}
                </div>
        </SimpleShowLayout>
    );
};

// Composant Show personnalisé qui utilise UserDetails
export const UserShow = (props) => (
    <Show {...props} title={<UsersTitle />}>
        <UserDetails />
    </Show>
);