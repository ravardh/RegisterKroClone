import React from "react";

const isAdminRole = (role) => ["admin", "superAdmin"].includes(role);

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!user);
  const [isAdmin, setIsAdmin] = React.useState(isAdminRole(user?.role));
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(user?.role === "superAdmin");
  const [isRM, setIsRM] = React.useState(user?.role === "rm");
  const [isBlogger, setIsBlogger] = React.useState(user?.role === "bloger");

  React.useEffect(() => {
    setIsLoggedIn(!!user);
    setIsAdmin(isAdminRole(user?.role));
    setIsSuperAdmin(user?.role === "superAdmin");
    setIsRM(user?.role === "rm");
    setIsBlogger(user?.role === "bloger");
  }, [user]);

  const authState = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    isAdmin,
    setIsAdmin,
    isSuperAdmin,
    setIsSuperAdmin,
    isRM,
    setIsRM,
    isBlogger,
    setIsBlogger,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
