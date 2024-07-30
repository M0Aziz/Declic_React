// Importer les composants nécessaires depuis react-admin
import React from 'react';
import { List, Datagrid, TextField, DateField, BooleanField, Edit, SimpleForm, BooleanInput, TextInput, DateInput, DeleteButton, ReferenceField, useDataProvider, useNotify, useRefresh, Show, SimpleShowLayout, ImageField, EditButton, Filter, useRecordContext, PrevNextButtons, SimpleList, useTranslate, NumberField } from 'react-admin';
import { Button } from 'react-admin';
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

// Composant pour afficher les signalements
const ReportField = ({ record }) => {
    if (!record || !record.reported) return 0;
    return (
        <ul>
            {record.reported.map(report => (
                <li key={report._id}>
                    {report.status}
                </li>
            ))}
        </ul>
    );
};

// Composant pour traiter un signalement
const ReportButton = ({ record }) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleReport = () => {
        const updatedReports = record.reported.map(report => {
            if (report.status === 'N') {
                return { ...report, status: 'O' };
            }
            return report;
        });

        dataProvider.update('activities/reports', { 
            id: record.id, 
            data: { 
                reported: updatedReports,
                reportId: record.reported._id // Assuming reported is an array of objects with _id
            } 
        })
            .then(() => {
                notify('Signalement traité avec succès');
                refresh();
            })
            .catch(error => {
                notify(`Erreur lors du traitement du signalement: ${error.message}`, 'error');
            });
    };

    // Vérifier si record est défini et s'il contient la propriété reported
    if (!record || !record.reported) {
        return null; // Si record est indéfini ou ne contient pas la propriété reported, ne rien afficher
    }

    // Vérifier s'il y a des signalements non traités
    const shouldShowButton = record.reported.some(report => report.status === 'N');

    // Afficher le bouton uniquement s'il y a des signalements non traités
    return shouldShowButton ? (
        <Button label="Traiter" onClick={handleReport} />
    ) : null;
};



const ActivityFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Rechercher par nom" source="name" alwaysOn />
    </Filter>
);
// Liste des activités

  
  // Enveloppez votre composant dans ThemeProvider
  export const ActivityList = (props) => {
    const translate = useTranslate(); 

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    
      return (
              <List filters={<ActivityFilter />} {...props} title={translate('resources.activities')}> 
                  {isSmall ? (
                      <SimpleList
                          primaryText={(record) => record.name}
                          secondaryText={(record) => record.city}
                          tertiaryText={(record) => new Date(record.dateStart).toLocaleDateString()}
                      />
                  ) : (
                      <Datagrid rowClick="show">
                          <TextField source="name" label={translate('fields.name')} />
                          <ImageField source='image' label={translate('fields.image')} />
                          <TextField source="city" label={translate('fields.city')} />
                          <DateField source="dateStart" label={translate('fields.dateStart')} />
                          <DateField source="dateEnd" label={translate('fields.dateEnd')}/>
                          <BooleanField source="visibility" label={translate('fields.visibility')} />
                          <ReferenceField source="organizer._id" reference="users" link="show" label={translate('fields.organizer')} >
                              <TextField source="firstName" label={translate('fields.organizer')} />
                          </ReferenceField>
                          <NumberField source="reported.length" label={translate('fields.reported')}/>
                          <DeleteButton label='' />
                          <EditButton label='' />
                      </Datagrid>
                  )}
              </List>
      );
  };

// Édition des activités
export const ActivityEdit = (props) => {
    const translate = useTranslate(); 
return (
    <Edit  {...props} title={<ActivityTitle />}>
        <SimpleForm>
            <TextInput source="name" label={translate('fields.name')}/>
            <TextInput source="description" label={translate('fields.description')}/>

            <DateInput source="dateStart" disabled  label={translate('fields.dateStart')}/>
            <DateInput disabled source="dateEnd" label={translate('fields.dateEnd')}/>
            <BooleanInput source="visibility" label={translate('fields.visibility')}/>
            <ReportButton label="Traiter le signalement" />
        </SimpleForm>
    </Edit>
);
}

const ActivityTitle = () => {
    const translate = useTranslate(); 

    const record = useRecordContext();
    if (!record) return null;
    return <span>{translate('resources.activities')} <b>{record.name}</b></span>;
};

export const ActivityShow = (props) => {
    const translate = useTranslate(); 

    return(
        <Show {...props} title={<ActivityTitle />} emptyWhileLoading >
            <SimpleShowLayout>
            <div className='row'>
            <div className='col-lg-10 border-end'>
                <div className='row'>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>#</h6>
                        <TextField source="id" label={translate('fields.id')} />
                    </div>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.name')} :</h6>

                        <TextField source="name" label={translate('fields.name')}/>
                    </div>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.city')} :</h6>

                        <TextField source="city" label={translate('fields.city')}/>
                    </div>

                    
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.dateStart')} :</h6>

                        <DateField source="dateStart" label={translate('fields.dateStart')}/>
                    </div>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.dateEnd')} :</h6>

                        <DateField source="dateEnd" label={translate('fields.dateEnd')}/>
                    </div>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.visibility')} :</h6>

                        <BooleanField source="visibility" label={translate('fields.visibility')}/>
                    </div>
                </div>
               
                <div className='row mt-3'>
          
                { props.repeat != null && (
                                                <div className='col-lg-4 mt-3'>
                                                <h6 className='fw-bold'>{translate('fields.repeat')} :</h6>

                                    <TextField source="repeat" label={translate('fields.repeat')} />
                                </div>

                )}
                                <div className='col-lg-4 mt-3'>
                                <h6 className='fw-bold'>{translate('fields.category')} :</h6>

                                    <TextField source="category" label={translate('fields.category')} />
                                </div>
                                <div className='col-lg-4 mt-3'>
                                <h6 className='fw-bold'>{translate('fields.category')} :</h6>

                                    <TextField source="price" label={translate('fields.category')} />
                                </div>
                                <div className='col-lg-4 mt-3'>
                                <h6 className='fw-bold'>{translate('fields.category')} :</h6>

                                    <TextField source="currency" label={translate('fields.category')} />
                                </div>

                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.participantsCount')} :</h6>

                        <TextField source="participants.length" label={translate('fields.participantsCount')} />
                    </div>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.waitingListCount')} :</h6>

                        <TextField source="waitingList.length" label={translate('fields.waitingListCount')} />
                    </div>
                    <div className='col-lg-4 mt-3'>
                    <h6 className='fw-bold'>{translate('fields.category')} :</h6>

                    <ImageField source="image" label={translate('fields.category')} />
            
                </div>
                </div>

                <div className='row mt-4'>
                <div className='col-lg-4'>
                <h6 className='fw-bold'>{translate('fields.reportsCount')} :</h6>

                    <TextField source="reported.length" label={translate('fields.reportsCount')} />
                </div>

                <div className='col-lg-4 '>
                    <h6 className='fw-bold'>{translate('fields.dateStart')} :</h6>

                        <DateField source="unsubscribeDeadline" label={translate('fields.dateStart')}/>
                    </div>

                    <div className='col-lg-4 '>
                    <h6 className='fw-bold'>eventType :</h6>

                        <TextField source="profileType" label="eventType"/>
                    </div>
                {props.record && props.record.reported.length > 0 && (
                    props.record.reported.map((report, index) => (
                        <section>
                        <div key={index} className='col-lg-3'>
                            <h6 className='fw-bold'>Utilisateur qui a signalé :</h6>
                            <TextField source={`reported[${index}].user.firstName`} label="Utilisateur qui a signalé" />
                            </div>
                            <div key={index} className='col-lg-3'>

                            <h6 className='fw-bold'>Date du signalement :</h6>
                            

                            <DateField source={`reported[${index}].date`} label="Date du signalement" />
                            </div>
                            <div key={index} className='col-lg-3'>

                            <h6 className='fw-bold'>Statut du signalement :</h6>
                            <TextField source={`reported[${index}].status`} label="Statut du signalement" />
                        </div>
                        </section>
                    ))
                )}
                
            </div>
            </div>

            <div className='col-lg-2 text-center'>
            <h5>{translate('fields.information')}</h5>
            <ImageField className='text-center' source="organizer.profilePicture"  />

            <ReferenceField source="organizer._id" reference="users" link="show">
<div className='text-center mt-4'>
            <TextField source="firstName" className="me-1 " />
            <TextField source="lastName" className="ms-1" /><br></br><br></br>
            <TextField source='email' className='mt-3' ></TextField>
            </div>
        </ReferenceField>
        <h5 className='mt-5 text-muted'>{translate('fields.createdAt')}</h5>
        {translate('fields.Le')} :  <DateField source="date" />
        </div>
            </div>
            </SimpleShowLayout>

            <PrevNextButtons linkType="show" />

        </Show>
    );
}

