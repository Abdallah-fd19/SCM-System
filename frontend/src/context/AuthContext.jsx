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

 const login = async (payload)=>{
   const { data } = await api.post("users/login/", payload);
   localStorage.setItem("access_token", data.access);
   setUser(data.user);
   return data;
 }

 const register = async (payload)=>{
  const { data } = await api.post("users/register/", payload)
  localStorage.setItem("access_token", data.access);
  setUser(data.user)
  return data
 }

 const logout = async ()=>{
  localStorage.removeItem("access_token");
  setUser(null);
 }

 return(
  <AuthContext.Provider value={{user, loading, login, register, logout}}>
   {children}
  </AuthContext.Provider>
 )

}

export default AuthProvider
export {AuthContext}