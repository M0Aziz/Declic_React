// contacts.js

import * as React from 'react';
import { List, Datagrid, TextField, EmailField, ShowButton, DateField, Show, SimpleShowLayout, SimpleList, Button, useNotify, useRefresh, useRedirect, useRecordContext, useTranslate } from 'react-admin';
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
export const ContactList = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const translate = useTranslate(); 

    return (
        <List {...props} title={translate('resources.contacts')}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.firstName}
                    secondaryText={(record) => record.lastName}
                    tertiaryText={(record) => record.email}
                    linkType="show"
                />
            ) : (
                <Datagrid rowClick="show">
                    <TextField source="firstName" label={translate('fields.firstName')} />
                    <TextField source="lastName" label={translate('fields.lastName')} />
                    <EmailField source="email" label={translate('fields.email')} />
                    <TextField source="subject" label={translate('fields.date')} />
                    <DateField source="date" label={translate('fields.date')} />
                    <ShowButton label={false} />
                </Datagrid>
            )}
        </List>
    );
};




const ContactTitle = () => {
    const translate = useTranslate(); 

    const record = useRecordContext();
    if (!record) return null;
    return <span>{translate('resources.contacts')} <b>{record.email} </b></span>;
};



/*export const ContactShow = (props) => (
    <Show {...props} title="Contact Details">
        <SimpleShowLayout>
            <TextField source="firstName" label="Prénom" />
            <TextField source="lastName" label="Nom" />
            <EmailField source="email" />
            <TextField source="subject" label="Sujet" />
            <TextField source="message" label="message" />

            <DateField source="date" label="Date" showTime />
        </SimpleShowLayout>
    </Show>
);*/

export const ContactShow = (props) => { const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    
    // Récupération de l'ID de l'enregistrement depuis les props
   // const { id } = props;
   const { id } = useParams();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    function countVisibleCharacters(text) {
        const strippedText = text.replace(/<[^>]*>/g, ''); 
        return strippedText.trim().length; 
    }
    

    const handleSend = async () => {
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
    
        console.log('Sending email to record ID:', id); 
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/contacts/send-email/${id}`,
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                    },
                }
            );
    
            console.log('Response status:', response.status); 
    
            if (response.status === 200) {
                notify('Email sent successfully');
                refresh();
                redirect('list', 'contacts');
            } else {
                notify('Error sending email', 'warning');
            }
        } catch (error) {
            console.error('Error sending email:', error); 
            notify('Error sending email', 'warning');
        }
    
        setOpen(false);
    };
    
    const translate = useTranslate(); 

    return (
        <Show {...props} title={<ContactTitle />}>
            <SimpleShowLayout>

            <TextField source="firstName" label={translate('fields.firstName')} />
            <TextField source="lastName" label={translate('fields.lastName')} />
            <EmailField source="email" label={translate('fields.email')} />
            <TextField source="subject"  />
             
                <TextField source="message" label="Message" />
                <DateField source="date" label={translate('fields.date')} showTime />
                <label className='text-muted mt-3'>{translate('fields.repondre')}</label>
                <Button onClick={handleClickOpen} variant="contained"  className='mt-1' >{translate('fields.repondre')}</Button>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{translate('fields.replyByEmail')} </DialogTitle>
                    <DialogContent>
                        <ReactQuill value={message} onChange={setMessage} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                        {translate('fields.cancel')}
                        </Button>
                        <Button onClick={handleSend}  variant="contained"
                        color="primary"                         style={{ marginRight: '20px' }} 
                        >
                        {translate('fields.send')}

                        </Button>
                    </DialogActions>
                </Dialog>
            </SimpleShowLayout>
        </Show>
    );
};