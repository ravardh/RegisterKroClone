
import React from "react";


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!user);
  const [isAdmin, setIsAdmin] = React.useState(user?.role === "admin");

  React.useEffect(() => {
    // Fetch user authentication status from the server or local storage
    setIsLoggedIn(!!user);
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const authState = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    isAdmin,
    setIsAdmin,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
