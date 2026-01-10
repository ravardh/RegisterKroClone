import React from "react";

const isAdminRole = (role) => ["admin", "SuperAdmin"].includes(role);

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!user);
  const [isAdmin, setIsAdmin] = React.useState(isAdminRole(user?.role));
  const [isRM, setIsRM] = React.useState(user?.role === "rm");

  React.useEffect(() => {
    // Fetch user authentication status from the server or local storage
    setIsLoggedIn(!!user);
    setIsAdmin(isAdminRole(user?.role));
    setIsRM(user?.role === "rm");
  }, [user]);

  const authState = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    isAdmin,
    setIsAdmin,
    isRM,
    setIsRM,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
