import { useContext } from "react";
import { AuthContext } from "../store/Auth";

 
 
 const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export {useAuth}