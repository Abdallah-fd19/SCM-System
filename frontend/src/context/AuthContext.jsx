import { createContext, useState, useEffect } from "react";
import api from '../api.js';

const AuthContext = createContext(null)

const AuthProvider = ({children})=>{
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchMe = async ()=>{
  try {
   const { data } = await api.get("users/me/");
   setUser(data);
  } catch {
   setUser(null);
  }
  finally{
   setLoading(false);
  }
 }

 useEffect(()=>{
  fetchMe()
 },[]);

const login = async (form) => {
    const res = await api.post("/users/login/", form);
    const { access, refresh, user } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setUser(user);

    return res.data;
  
};

 const register = async (payload)=>{
  const res = await api.post("users/register/", payload)
  const { access, refresh, user } = res.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setUser(user);
    return res.data
 }

 const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

 return(
  <AuthContext.Provider value={{user, loading, login, register, logout}}>
   {children}
  </AuthContext.Provider>
 )

}

export default AuthProvider
export {AuthContext}