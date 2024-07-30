// ProtectedRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      element={props => (
        isAuthenticated ? <Element {...props} /> : <Navigate to="/login" replace />
      )}
    />
  );
};

export default ProtectedRoute;
