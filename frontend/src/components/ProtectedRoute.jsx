import React, {useContext} from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children})=>{
 const {user, loading} = useContext(AuthContext);
 if(loading) return <p>Loading...</p>;
 if(!user) return <Navigate to="/login" replace/>;
 return children; 
}

export default ProtectedRoute