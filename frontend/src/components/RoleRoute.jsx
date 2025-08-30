import React, {useContext} from "react"
import { AuthContext } from "../context/AuthContext.jsx"
import { Navigate } from "react-router-dom"


const RoleRoute = ({children, allowed})=>{
 const {user, loading} = useContext(AuthContext)
 if(loading) return <p>Loading...</p>
 if(!user) return <Navigate to="/login" replace/>
 if (!allowed.includes(user.role)) return <p>Access denied</p>;
 return children; 
}

export default RoleRoute