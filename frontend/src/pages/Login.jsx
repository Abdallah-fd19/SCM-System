import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"


const Login = ()=>{
 const [form, setForm] = useState({username:'', password:''})
 const {login} = useContext(AuthContext)
 const navigate = useNavigate()
 const [err, setErr] = useState('')

 const handleSubmit = async (e)=>{
  e.preventDefault()
  setErr('')
  try {
   await login(form)
   navigate("/")
  } catch (error) {
   setErr(error.response?.data?.error || "Login failed")
  }
 }
 return(
  <div className="h-screen flex justify-center items-center bg-amber-50">
   <div className="w-[425px] h-[525px] bg-orange-100 rounded-lg mr-40 flex flex-col justify-around items-center border border-orange-400">
    <h2 className="text-orange-400 text-2xl">Login Account</h2>
    <form className="flex flex-col gap-y-2 mb-30" onSubmit={handleSubmit}>
     <label htmlFor="username" className="text-orange-400">Username:</label>
     <input id="username" placeholder="example@gmail.com" className="border-b-orange-400 border-b mb-15 w-[300px] focus:outline-none focus:border-b-2 transition-all duration-75  placeholder:text-shadow-lime-50 placeholder:text-[14px]" type="text" name="username" value={form.username} onChange={(e)=>{setForm({...form, username:e.target.value})}}/>
     <label htmlFor="password" className="text-orange-400">Password:</label>
     <input id="password" placeholder="enter your password" className="border-b-orange-400 border-b mb-15 w-[300px] focus:outline-none focus:border-b-2 transition-all duration-75  placeholder:text-shadow-lime-50 placeholder:text-[14px]" type="password" name="password" value={form.password} onChange={(e)=>{setForm({...form, password:e.target.value})}}/>
     {err && <p>{err}</p>}
     <button type="submit" className="bg-orange-100 border border-orange-400 text-orange-400 py-0.5 rounded-xs hover:border-transparent hover:text-orange-100 hover:bg-orange-400 transition-all duration-300 cursor-pointer">Login</button>
    </form>
   </div>
  </div>
 )

}

export default Login