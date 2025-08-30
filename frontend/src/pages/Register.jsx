import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"

const Register = ()=>{
 const [form, setForm] = useState({username:'', email:'', password:'', confirm_password:'', role:''});
 const navigate = useNavigate();
 const {register} = useContext(AuthContext);
 const [err, setErr] = useState('');
 
 const handleSubmit = async (e)=>{
  e.preventDefault()
  setErr('')
  try {
   await register(form)
   navigate("/")
  } catch (error) {
   setErr(error.response?.data?.error || "Registration failed")
  }
 }

 return(
  <div className="h-screen flex justify-center items-center bg-amber-50">
   <div className="w-[475px] h-[575px] bg-orange-100 rounded-lg mr-40 flex flex-col justify-around items-center border border-orange-400">
    <h2 className="text-orange-400 text-2xl">Register Account</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 ">
     <label htmlFor="username" className="text-orange-400">Username:</label>
     <input id="username" type="text"  value={form.username} onChange={(e)=>{setForm({...form, username:e.target.value})}} className="border-b-orange-400 border-b w-[300px] focus:outline-none focus:border-b-2 transition-all duration-75  placeholder:text-shadow-lime-50 placeholder:text-[14px]"/>
     <label htmlFor="email" className="text-orange-400">Email:</label>
     <input id="email" type="email"  value={form.email} onChange={(e)=>{setForm({...form, email:e.target.value})}} className="border-b-orange-400 border-b w-[300px] focus:outline-none focus:border-b-2 transition-all duration-75  placeholder:text-shadow-lime-50 placeholder:text-[14px]"/>
     <label htmlFor="password" className="text-orange-400">Password:</label>
     <input id="password" type="password"  value={form.password} onChange={(e)=>{setForm({...form, password:e.target.value})}} className="border-b-orange-400 border-b w-[300px] focus:outline-none focus:border-b-2 transition-all duration-75  placeholder:text-shadow-lime-50 placeholder:text-[14px]"/>
     <label htmlFor="confirm_password" className="text-orange-400">Confirm_password:</label>
     <input id="confirm_password" type="password"  value={form.confirm_password} onChange={(e)=>{setForm({...form, confirm_password:e.target.value})}} className="border-b-orange-400 border-b w-[300px] focus:outline-none focus:border-b-2 transition-all duration-75  placeholder:text-shadow-lime-50 placeholder:text-[14px]"/>
     <label htmlFor="role" className="text-orange-400 my-2">Select your:</label>
     <select id="role" value={form.role} onChange={(e)=>{setForm({...form, role:e.target.value})}} className="text-orange-400 focus:outline-none">
      <option value="student" className="text-orange-400">Student</option>
      <option value="teacher" className="text-orange-400">Teacher</option>
     </select>
     {err && <p>{err}</p>}
     <button type="submit" className="bg-orange-100 border border-orange-400 text-orange-400 py-0.5 rounded-xs hover:border-transparent hover:text-orange-100 hover:bg-orange-400 transition-all duration-300 cursor-pointer mt-10">Create account</button>
    </form>
   </div>
  </div>
 )
}

export default Register;