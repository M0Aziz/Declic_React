// Dashboard.js

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Title, useTranslate } from 'react-admin';
import axios from 'axios';
import { Box, Grid, Typography } from '@material-ui/core';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EmailIcon from '@mui/icons-material/Email';
import CommentIcon from '@mui/icons-material/Comment';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [usersByCity, setUsersByCity] = useState([]);
  const [eventsByCity, setEventsByCity] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsInactive, setStatsInactive] = useState(null);
  const [userEventStats, setUserEventStats] = useState([]);
  const [userCommentStats, setUserCommentStats] = useState([]);
  const [topUserStats, setTopUserStats] = useState(null);
  const translate = useTranslate(); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, eventsResponse, contactsResponse,usersByCityResponse,eventsByCityResponse,statsResponse,
            statsInactiveResponse,userEventResponse,userCommentResponse,topUserResponse, newslettersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/total-users'),
          axios.get('http://localhost:5000/api/dashboard/total-events'),
          axios.get('http://localhost:5000/api/dashboard/total-contacts'),
          axios.get('http://localhost:5000/api/dashboard/users-by-city'),
          axios.get('http://localhost:5000/api/dashboard/events-by-city'),
          axios.get('http://localhost:5000/api/dashboard/user-stats'),
          axios.get('http://localhost:5000/api/dashboard/user-stats-inactive'),
          axios.get('http://localhost:5000/api/dashboard/user-event-stats'),
          axios.get('http://localhost:5000/api/dashboard/user-comment-stats'),
          axios.get('http://localhost:5000/api/dashboard/top-user-stats'),

          axios.get('http://localhost:5000/api/dashboard/total-newsletters')
        ]);

        setTotalUsers(usersResponse.data.totalUsers);
        setTotalEvents(eventsResponse.data.totalEvents);
        setTotalContacts(contactsResponse.data.totalContacts);
        setUsersByCity(usersByCityResponse.data);
        setEventsByCity(eventsByCityResponse.data);
        setStats(statsResponse.data);
        setStatsInactive(statsInactiveResponse.data);
        setUserEventStats(userEventResponse.data);
        setUserCommentStats(userCommentResponse.data);
        console.log(userCommentResponse.data);
        setTopUserStats(topUserResponse.data[0]);
        setTotalNewsletters(newslettersResponse.data.totalNewsletters);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord :', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Grid container spacing={2} className='mt-lg-3 mt-4 mb-4'>
    <Title style={{color:'#636363'}} title=  {translate('dashboard.dashboard')} />

      <Grid item lg={3} md={6} sm={6} xs={6}>
        <Card>
          <CardContent className='text-center p-4'>
            <PersonIcon  style={{color:'#7447FF', fontSize: 40}}  />
            <Typography variant="h5" className='mt-2 mb-2' ><b>{totalUsers}</b></Typography>
            <Typography variant="h6" >  {translate('dashboard.users')}</Typography>

          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={3} md={6} sm={6} xs={6}>
        <Card>
        <CardContent className='text-center p-4'>
        <EventIcon style={{color:'#7447FF', fontSize: 40}}  />
        <Typography variant="h5" className='mt-2 mb-2'> <b>{totalEvents}</b></Typography>

            <Typography variant="h6" >  {translate('dashboard.events')}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={3} md={6} sm={6} xs={6}>
        <Card>
        <CardContent className='text-center p-4'>
        <ContactMailIcon style={{color:'#7447FF', fontSize: 40}}  />
        <Typography variant="h5" className='mt-2 mb-2'><b>{totalContacts}</b></Typography>

            <Typography variant="h6" component="h2">  {translate('dashboard.contacts')}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={3} md={6} sm={6} xs={6}>
        <Card>
        <CardContent className='text-center p-4'>
        <EmailIcon style={{color:'#7447FF', fontSize: 40}}  />
        <Typography variant="h5" className='mt-2 mb-2'><b> {totalNewsletters}</b></Typography>

            <Typography variant="h6" component="h2">  {translate('dashboard.newsletters')}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="center">
          {translate('dashboard.users_by_city')}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={usersByCity}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="userCount" name={translate('dashboard.users_by_city_')} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} lg={6}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="center">
          {translate('dashboard.events_by_city')}
                    </Typography>
          <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={eventsByCity}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend  />
            <Bar dataKey="eventCount" name={translate('dashboard.events_by_city_')} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>        </CardContent>
      </Card>
    </Grid>
<Grid item xs={12} lg={12} className='mb-2'>
    <h2 className='text-center mt-3'  variant="h5" component="h2">
    {translate('dashboard.user_statistics')}
    </h2>
</Grid>
<Grid item xs={12} lg={6} className='mb-5'>

{stats && (
    <div className='text-center'>
    <Box  sx={{ marginLeft: { xs: '20px',sm:'110px', md:'300px', lg: '120px', xl: 'none' } }}  >

      <PieChart width={400} height={400}  >
        <Pie
          data={[
            { name: 'En ligne', value: stats.onlineUsersCount },
            { name: 'Connectés récemment', value: stats.recentUsersCount },
            { name: 'Inactifs', value: stats.inactiveUsersCount }
          ]}
          cx={200}
          cy={200}
          label
          labelLine
          outerRadius={150} // Augmentez le rayon extérieur pour agrandir le donut
          innerRadius={75} 
          fill="#8884d8"
          dataKey="value"
        >
          {[
            { value: stats.onlineUsersCount, fill: '#36A2EB' },
            { value: stats.recentUsersCount, fill: '#FFCE56' },
            { value: stats.inactiveUsersCount, fill: '#FF6384' }
          ].map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

    </Box>
    <p><span style={{ color: '#36A2EB' }}>  {translate('dashboard.online_users')} :</span> {stats.onlineUsersCount}</p>
    <p><span style={{ color: '#FFCE56' }}>  {translate('dashboard.recently_connected')} :</span> {stats.recentUsersCount}</p>
    <p><span style={{ color: '#FF6384' }}>  {translate('dashboard.inactive_users')} :</span> {stats.inactiveUsersCount}</p>
 
    </div>
  )}

</Grid>


<Grid item xs={12} lg={6} className='mb-5'>

  {statsInactive && (
    <div className='text-center'>
      <Box sx={{ marginLeft: { xs: '20px', sm: '110px', md: '300px', lg: '120px', xl: 'none' } }}>

        <PieChart width={400} height={400}>
          <Pie
            data={[
              { name: 'Utilisateurs suspendus (expirés)', value: statsInactive.expiredSuspendedUserCount },
              { name: 'Utilisateurs suspendus (actifs)', value: statsInactive.activeSuspendedUserCount },
              { name: 'Utilisateurs bannis', value: statsInactive.bannedUserCount },
              { name: 'Utilisateurs inactifs', value: statsInactive.inactiveUserCount }
            ]}
            cx={200}
            cy={200}
            label
            labelLine
            outerRadius={150}
            innerRadius={75}
            fill="#8884d8"
            dataKey="value"
          >
            {[
              { value: statsInactive.expiredSuspendedUserCount, fill: '#36A2EB' },
              { value: statsInactive.activeSuspendedUserCount, fill: '#FFCE56' },
              { value: statsInactive.bannedUserCount, fill: '#FF6384' },
              { value: statsInactive.inactiveUserCount, fill: '#FF9933' }
            ].map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

      </Box>
      <p><span style={{ color: '#36A2EB' }}>{translate('dashboard.expired_suspended_users')}  :</span> {statsInactive.expiredSuspendedUserCount}</p>
      <p><span style={{ color: '#FFCE56' }}>{translate('dashboard.active_suspended_users')}  :</span> {statsInactive.activeSuspendedUserCount}</p>
      <p><span style={{ color: '#FF6384' }}>{translate('dashboard.banned_users')}  :</span> {statsInactive.bannedUserCount}</p>
      <p><span style={{ color: '#FF9933' }}>{translate('dashboard.new_users')}   :</span> {statsInactive.inactiveUserCount}</p>

    </div>
  )}

</Grid>

<Grid item xs={12} lg={4}>
  <Card>
    <CardContent>
      <Typography variant="h6" className='text-center' component="h2">{translate('dashboard.events_per_user')} </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={userEventStats}>
          <XAxis dataKey="firstName" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="eventCount" name={translate('dashboard.events_per_user_')}  fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</Grid>
<Grid item xs={12} lg={4}>
  <Card>
    <CardContent>
      <Typography variant="h6" className='text-center' component="h2">{translate('dashboard.comments_per_user')}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={userCommentStats}>
          <XAxis dataKey="firstName" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="commentCount" name={translate('dashboard.comments_per_user_')}  fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</Grid>
<Grid item xs={12} lg={4}>
  {topUserStats && (
    <Card>
      <CardContent className='p-4'>
        <Typography variant="h6" component="h2">{translate('dashboard.top_user_')}<b> {translate('dashboard._activity')}</b></Typography>
        <Typography variant="body1" className='mt-3'><PersonIcon  style={{color:'#7447FF'}} />
        <Link style={{textDecoration:'none'}} to={`/users/${topUserStats._id}/show`}>  {topUserStats.firstName} {topUserStats.lastName}</Link></Typography>
        <Typography variant="body1" className='mt-3'><EmailIcon style={{color:'#7447FF'}} /> {topUserStats.email}</Typography>
        <Typography variant="body1" className='mt-3'><EventIcon style={{color:'#7447FF'}} /> {translate('dashboard.created_events')}: {topUserStats.eventCount}</Typography>
        <Typography variant="body1" className='mt-3'><CommentIcon style={{color:'#7447FF'}} /> {translate('dashboard.comments')}: {topUserStats.commentCount}</Typography>
      </CardContent>
    </Card>
  )}
</Grid>
</Grid>


  );
};

export default Dashboard;
