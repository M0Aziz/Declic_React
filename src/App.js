import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Profile from './components/Profile';
import FirstTime from './components/FirstTime';
import Navbar from './components/Navbar';
import EditProfile from './components/EditProfile';
import UploadForm from './components/UploadForm';
import EditImages from './components/EditImages';
import EditInterests from './components/EditInterests';
import Test from './components/test';
import Footer from './components/Footer';
import Messages from './components/Messages';
import UpNavbar from './components/UpNavbar';
import AboutUsPage from './components/AboutUsPage ';
import MyEvents from './components/Myevents';
import CreateEvent from './components/CreateEvent';
import MyeventsJoined from './components/MyeventsJoined';
import MyeventsUpComing from './components/MyeventsUpComing';
import EventDescription from './components/EventDescription';
import SearchResultComponent from './components/SearchResultComponent';
import TestImage from './TestImage';
import MyeventsUpComingGuest from './components/MyeventsUpComingGuest';
import AdminDashboard from './admin/AdminDashboard';
import { ActivityEdit, ActivityList } from './admin/activities';
import ProfileAdmin from './admin/ProfileAdmin';
import ContactUsForm from './components/ContactUsForm';
import ResetPassword from './components/Login/ResetPassword';
import AuthModal from './components/AuthModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  
 
 
    const isAuthenticated = localStorage.getItem('token');
    const firstTime = localStorage.getItem('firstTime') === 'true';
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const showModal = localStorage.getItem('showSessionExpiredModal');

  console.log('smdljfkmlsdjfmsfmjs',showModal);

    
  return (

    <Router  scrollRestoration="manual">

      <div className="App">

      {showModal && <AuthModal />}



        {(role === 'user' || role !=='admin') && <UpNavbar isAuthenticated={isAuthenticated} />}
        {(role === 'user' || role !=='admin') && <Navbar />}

        <ToastContainer />

        <Routes>

          {role === 'admin' ? (
            <>
            <Route path="/*" element={<AdminDashboard />} />

            <Route path="/profile/admin" element={<ProfileAdmin />} />

            </>
          ) : (
            <>

              <Route
                exact
                path="/"
                element={!firstTime ? <Home /> : <Navigate to="/first-time" replace />}
              />
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to={`/profile/${username}`} replace />}
              />
              <Route
                path="/register"
                element={!isAuthenticated ? <Register /> : <Navigate to={`/profile/${username}`} replace />}
              />
              <Route
                path="/:username/edit"
                element={
                  isAuthenticated && !firstTime ? <EditProfile /> : isAuthenticated ? <Navigate to="/first-time" replace /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/profile/:username"
                element={
                  isAuthenticated && !firstTime ? <Profile /> : isAuthenticated ? <Navigate to="/first-time" replace /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/edit-images"
                element={
                  isAuthenticated && !firstTime ? <EditImages /> : isAuthenticated ? <Navigate to="/first-time" replace /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/edit-interests"
                element={
                  isAuthenticated && !firstTime ? <EditInterests /> : isAuthenticated ? <Navigate to="/first-time" replace /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/first-time"
                element={
                  isAuthenticated && firstTime ? <FirstTime /> : isAuthenticated ? <Navigate to={`/profile/${username}`} replace /> : <Navigate to="/login" replace />
                }
              />
              <Route path="/test" element={<Test />} />
              <Route path="/messages/:username" element={<Messages />} />
              <Route path="/event/:id" element={<EventDescription />} />
              <Route path="/messages" element={isAuthenticated ? <Messages /> : <Login />} />
              <Route path="/about_us" element={<AboutUsPage />} />
              <Route path="/Myevents" element={isAuthenticated ? <MyEvents /> : <Home />} />
              <Route path="/CreateEvent" element={<CreateEvent />} />
              <Route path="/joined" element={<MyeventsJoined />} />
              <Route path="/upComing" element={<MyeventsUpComing />} />
              <Route path="/search/:keyword" element={<SearchResultComponent />} />
              <Route path="/testimage" element={<TestImage />} />
              <Route path="/contact" element={<ContactUsForm />} />

              <Route path="/upComingGuest" element={<MyeventsUpComingGuest />} />
              <Route path="/reset_password" element={<ResetPassword />} />

              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
        {(role === 'user' || role !=='admin') && <Footer />}
      </div>
    </Router>

  );
}

export default App;
