export const isSuperAdmin = (user) => {
  return user && user.role === 'super_admin';
};

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

export const hasRole = (user, allowedRoles = []) => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};
