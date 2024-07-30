// Importations nécessaires de React et de React Admin
import * as React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    EditButton,
    FormDataConsumer,
    useTranslate,
    SimpleList,
    TabbedShowLayout,
    SimpleShowLayout,
    Show,
    RichTextField,
} from 'react-admin';
import { useIntl } from 'react-intl'; // Importez useIntl pour accéder aux traductions

import { Typography } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';


export const ReportedList = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const translate = useTranslate();

    return (
        <List {...props} perPage={25} title={'Signalements des événements'}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => (
                        <span>{`${record.reported.user.firstName} ${record.reported.user.lastName}`}</span>
                    )}
                    tertiaryText={(record) => (
                        <span>{`${record.organizer.firstName} ${record.organizer.lastName}`}</span>
                    )}
                    linkType="show"
                />
            ) : (
                <Datagrid rowClick='show'>
                    <TextField source="name" label="Nom de l'activité" />
                  
                    <ReferenceField
                        source="reported.user._id"
                        reference="users"
                        label="Utilisateur signalé"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>
                    <ReferenceField
                        source="organizer._id"
                        reference="users"
                        label="Organisateur"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>
                    <DateField source="reported.date" showTime label="Date du signalement" />
                    <TextField source="reported.reason" label="raison" />

                    <TextField source="reported.status" label="Statut" />
                    <EditButton label={false} />
                </Datagrid>
            )}
        </List>
    );
};



export const ReportedListMessage = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const translate = useTranslate();
    const page =  1;

    return (
        <List {...props} perPage={25} title={'Signalements des messages '}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => (
                        <span>{`${record.reported.user.firstName} ${record.reported.user.lastName}`}</span>
                    )}
                    tertiaryText={(record) => (
                        <span>{`${record.organizer.firstName} ${record.organizer.lastName}`}</span>
                    )}
                    linkType="show"
                />
            ) : (
                <Datagrid rowClick='show'>
                
                    <ReferenceField
                        source="reported.user._id"
                        reference="users"
                        label="Utilisateur signalé"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>


                    <ReferenceField
                        source="message.userConcentred._id"
                        reference="users"
                        label="Utilisateur concerné"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>
              
                    <DateField source="reported.date" showTime label="Date du signalement" />
                    <TextField source="reported.reason" label="raison" />
                    <TextField source="message.content" label="Contenu" />

                    <TextField source="reported.status" label="Statut" />
                    <EditButton label={false} />
                </Datagrid>
            )}


        </List>
    );
};


export const ReportedListComment = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const translate = useTranslate();
    return (
        <List {...props} perPage={25} title={'Signalements des commentaires'}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => (
                        <span>{`${record.reported.user.firstName} ${record.reported.user.lastName}`}</span>
                    )}
                    tertiaryText={(record) => (
                        <span>{`${record.organizer.firstName} ${record.organizer.lastName}`}</span>
                    )}
                    linkType="show"
                />
            ) : (
                <Datagrid rowClick='show'>
                
                    <ReferenceField
                        source="reported.user._id"
                        reference="users"
                        label="Utilisateur signalé"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>


                    <ReferenceField
                        source="comment.user._id"
                        reference="users"
                        label="Organisateur"
                                                link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>
              
                    <DateField source="reported.date" showTime label="Date du signalement" />
                    <TextField source="reported.reason" label="raison" />
                    <TextField source="comment.content" label="Contenu" />

                    <TextField source="reported.status" label="Statut" />
                    <EditButton label={false} />
                </Datagrid>
            )}


        </List>
    );
};


export const ReportEdit = (props) => (

   
        <Edit {...props}>
            <SimpleForm>
                <FormDataConsumer>
                    {({ formData, ...rest }) => (
                        <>
                            <Typography variant="h6" className="mb-3">
                                Détails du Signalement
                            </Typography>
                            <label className='my-2 fw-bold' >Nom de l'activité :</label>
                            <TextField source="activity.name" label="Nom de l'activité" />
                            <label className='my-2 fw-bold' >Utilisateur signalé :</label>

                            <ReferenceField
                                source="user._id"
                                reference="users"
                                label="Utilisateur signalé"
                                link="show"
                            >
                                <TextField source="firstName" />                                 <TextField source="lastName" />

                            </ReferenceField>
                            <label className='my-2 fw-bold' >Organisateur :</label>

                            <ReferenceField
                                source="activity.organizer.id"
                                reference="users"
                                label="Organisateur"
                                link="show"
                            >
                                <TextField source="firstName" />   <TextField source="lastName" />
                            </ReferenceField>
                            <label className='my-2 fw-bold'>Date du signalement :</label>

                            <DateField source="date" showTime label="Date du signalement" />

                            <Typography variant="h6" className="mt-3">
                                Modifier le Statut
                            </Typography>
                            <SelectInput
                                source="status"
                                label="Statut"
                                choices={[
                                    { id: 'N', name: 'Nouveau' },
                                    { id: 'O', name: 'Résolu' },
                                ]}
                            />
                        </>
                    )}
                </FormDataConsumer>
            </SimpleForm>
        </Edit>
   
    );



export const ReportShow = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const translate = useTranslate();

    return (
        <Show {...props}>
            {isSmall ? (
                <SimpleShowLayout>
                    <TextField source="activity.name" label="Nom de l'activité" />
                    <ReferenceField
                    source="activity.id"
                    reference="activities"
                    label="Activity"
                    link="show"
                >
                    <TextField source="name" />
                </ReferenceField>
                    <ReferenceField
                        source="user._id"
                        reference="users"
                        label="Utilisateur signalé"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>
                    <ReferenceField
                        source="activity.organizer.id"
                        reference="users"
                        label="Organisateur"
                        link="show"
                    >
                        <TextField source="firstName" />
                    </ReferenceField>
                    <DateField source="date" showTime label="Date du signalement" />
                    <TextField source="status" label="Statut" />
                </SimpleShowLayout>
            ) : (
                <TabbedShowLayout>


                <TabbedShowLayout.Tab label="name" path="activity.name">
                <TextField source="activity.name" label="Nom de l'activité" />
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab label="Activité" path="activity.id">
            <ReferenceField
            source="activity.id"
            reference="activities"
            label="Activity"
            link="show"
        >
            <TextField source="name" />
        </ReferenceField>
                </TabbedShowLayout.Tab>
              


                <TabbedShowLayout.Tab label="Utilisateur" path="user._id">
                <ReferenceField
                source="user._id"
                reference="users"
                label="Utilisateur signalé"
                link="show"
            >
                <TextField source="firstName" />                 <TextField source="lastName" />

            </ReferenceField>
                        </TabbedShowLayout.Tab>
             



                        <TabbedShowLayout.Tab label="Organisateur" path="activity.organizer.id">
                        <ReferenceField
                        source="activity.organizer.id"
                        reference="users"
                        label="Organisateur"
                        link="show"
                    >
                        <TextField source="firstName" />                 <TextField source="lastName" />
        
                    </ReferenceField>
                                </TabbedShowLayout.Tab>
            
                <TabbedShowLayout.Tab label="date" path="date">
                <DateField source="date" showTime label='Date du signalement' />
            </TabbedShowLayout.Tab>

            
            <TabbedShowLayout.Tab label="reason" path="reason">
            <TextField source="reason"  label='reason' />
        </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Statut" path="Statut">
            <TextField source="status" label="Statut" />
            </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            )}
        </Show>
    );
};