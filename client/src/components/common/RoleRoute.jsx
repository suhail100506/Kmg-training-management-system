import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { hasRole } from '../../utils/roleHelpers';

const RoleRoute = ({ children, roles }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user, roles)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default RoleRoute;
