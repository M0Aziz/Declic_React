import React from 'react';
import { Admin, Resource, useTranslate } from 'react-admin';
import dataProvider from './dataProvider';
import MyLayout from './MyLayout';
import { ActivityList, ActivityEdit, ActivityShow } from './activities';
import { UserList, UserEdit, UserCreate, UserShow } from './users';
import './admin.css';
import { ThemeProviderComponent } from './ThemeContext'; // Importez le fournisseur de thème
import SportsIcon from '@mui/icons-material/Sports';
import PersonIcon from '@mui/icons-material/Person';
import { ContactList, ContactShow } from './contacts';
import { NewsletterList, NewsletterShow } from './newsletters';
import { darkTheme, lightTheme } from './themes';
import Dashboard from './Dashboard';
import i18nProvider from './src/i18n/i18nProvider';
import { ReportEdit, ReportShow, ReportedList, ReportedListComment, ReportedListMessage } from './report';

const CustomActivityIcon = () => <SportsIcon sx={{ color: '#7447FF' }} />;
const CustomUserIcon = () => <PersonIcon sx={{ color: '#7447FF' }} />;

const AdminDashboard = () => {
  const translate = useTranslate(); 
return(
    <ThemeProviderComponent>

    <Admin dashboard={Dashboard} layout={MyLayout} dataProvider={dataProvider}  theme={lightTheme}
    darkTheme={darkTheme}         i18nProvider={i18nProvider}
    >
      <Resource
        name="activities"
        list={ActivityList}
        edit={ActivityEdit}
        show={ActivityShow}
        icon={CustomActivityIcon}
      />

      <Resource
      name="report"
      list={ReportedList}
      edit={ReportEdit}
      show={ReportShow}

     
    />


    <Resource
    name="report/Message"
    list={ReportedListMessage}
   

   
  />


  <Resource
  name="report/Comment"
  list={ReportedListComment}
 

 
/>
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        icon={CustomUserIcon}
        show={UserShow}
      />

      <Resource name="contacts"  list={ContactList} show={ContactShow} />
      <Resource name="newsletters"  list={NewsletterList} show={NewsletterShow} />
   

    </Admin>
    </ThemeProviderComponent>
)
};

export default AdminDashboard;
