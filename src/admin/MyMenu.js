import * as React from 'react';
import { Menu, useTranslate } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MailIcon from '@mui/icons-material/Mail';
import ReportIcon from '@mui/icons-material/Report';

export const MyMenu = () => {
    const translate = useTranslate(); 

    return(
    <Menu sx={{ 
        '& .RaMenuItemLink-icon': { 
            color: '#7447FF', 
        },
    }}>
        <Menu.DashboardItem primaryText={translate('resources.dashboard') } />
        <Menu.Item to="/activities" primaryText={translate('resources.activities') } leftIcon={<BookIcon sx={{ color: '#7447FF' }} />}/>
        <Menu.Item to="/report" primaryText={translate('resources.report')} leftIcon={<ReportIcon sx={{ color: '#7447FF' }} />} />
        <Menu.Item to="/report/Message" primaryText={translate('resources.report')} leftIcon={<ReportIcon sx={{ color: '#7447FF' }} />} />
        <Menu.Item to="/report/Comment" primaryText={translate('resources.report')} leftIcon={<ReportIcon sx={{ color: '#7447FF' }} />} />

        <Menu.Item to="/users" primaryText={translate('resources.users') } leftIcon={<PeopleIcon sx={{ color: '#7447FF' }} />}/>
        <Menu.Item to="/contacts" primaryText={translate('resources.contacts') } leftIcon={<ContactMailIcon sx={{ color: '#7447FF' }} />} />
        <Menu.Item to="/newsletters" primaryText={translate('resources.newsletters') } leftIcon={<MailIcon sx={{ color: '#7447FF' }} />} />

        </Menu>
);
};