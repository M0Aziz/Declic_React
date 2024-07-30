// newsletters.js

import * as React from 'react';
import { List, Datagrid, TextField, EmailField, ShowButton, DateField, Show, SimpleShowLayout,DateTimeField, SimpleList, Button, SimpleForm, useNotify, useRefresh, useRedirect, useTranslate, useRecordContext  } from 'react-admin';
import { useTheme } from '@material-ui/core/styles';
import { Dialog, useMediaQuery } from '@material-ui/core';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';

export const NewsletterList = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const translate = useTranslate(); 


    function countVisibleCharacters(text) {
        const strippedText = text.replace(/<[^>]*>/g, ''); 
        return strippedText.trim().length; 
    }
    const handleReply = async () => {

        if (message.trim().length === 0) {
            notify('Veuillez entrer un message.', 'warning');
            return;
        }
    
        if (message.trim().length < 5) {
            notify('Le message doit contenir au moins 5 caractères.', 'warning');
            return;
        }

        if (countVisibleCharacters(message) < 5) {
            notify('Le message doit contenir au moins 5 caractères.', 'warning');
            return;
        }


        try {
            const response = await axios.post(
                `http://localhost:5000/api/newsletters/send-emails`, // Endpoint pour envoyer une réponse
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                notify('Réponse envoyée avec succès');
                refresh(); // Rafraîchir la liste des newsletters
                redirect('list', 'newsletters'); // Rediriger vers la liste des newsletters après l'envoi
                setOpen(false); // Fermer la boîte de dialogue après envoi
            } else {
                notify('Erreur lors de l\'envoi de la réponse', 'warning');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la réponse:', error);
            notify('Erreur lors de l\'envoi de la réponse', 'warning');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    return (
        <React.Fragment>
      
            <List {...props} title={translate('resources.newsletters')}>
            <div className="text-end my-2 mx-2">
            <FontAwesomeIcon icon={faReply} style={{ color: '#7447FF' }} />
    
            <Button onClick={handleClickOpen} label={translate('fields.repondre')} />
        </div>
                {isSmall ? (
                    <SimpleList 
                        primaryText={(record) => record.email}
                        secondaryText={(record) =>
                            new Date(record.date).toLocaleDateString()
                        }
                        linkType="show"

                    />
                ) : (
                    <Datagrid rowClick="show">
                        <EmailField source="email"  label={translate('fields.email')}/>
                        <DateField source="date" label={translate('fields.date')} />
                        <ShowButton label={false} />
                    </Datagrid>
                )}
            </List>
            <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            aria-labelledby="reply-dialog-title"
        >
            <SimpleForm
                variant="standard"
                onSubmit={handleReply}
                toolbar={<React.Fragment></React.Fragment>}
                style={{ padding: '20px' }} // Ajouter un padding au formulaire pour l'espacement
            >
                <h2 style={{ margin: '0', textAlign: 'center' }}>
                    Répondre aux abonnés
                </h2>
                <ReactQuill
                    value={message}
                    onChange={(value) => setMessage(value)}
                    style={{ height: '300px',width:'100%', marginBottom: '50px' }} // Ajuster le marginBottom pour plus d'espace
                />
                <div style={{ textAlign: 'center' }}>
                    <Button label={translate('fields.cancel')}  onClick={handleClose} />
                    <Button
                    label={translate('fields.send')} 
                                            type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleReply}
                        style={{ marginLeft: '10px' }} 
                    />
                </div>
            </SimpleForm>
        </Dialog>
        </React.Fragment>
    );
};




const NewsletterTitle = () => {
    const translate = useTranslate(); 

    const record = useRecordContext();
    if (!record) return null;
    return <span>{translate('resources.newsletters')} <b>{record.email} </b></span>;
};


export const NewsletterShow = (props) => {
    const translate = useTranslate(); 
return(
    <Show {...props} title={<NewsletterTitle />}>
        <SimpleShowLayout>
            <EmailField source="email" label={translate('fields.email')} />
            <DateField source="date" label={translate('fields.date')}   showTime />
        </SimpleShowLayout>
    </Show>
);
}
