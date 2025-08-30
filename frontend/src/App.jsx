import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx';
import Nav from './components/Nav.jsx'
import Courses from './pages/Courses.jsx';
import { Routes, Route } from "react-router-dom";
function App() {

  return (
    <>
      <div className='grid grid-cols-[1fr_4fr] min-h-screen'>
        <Nav/>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Dashboard />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/register' element={<Register/>}></Route>
        </Routes>      
      </div>
    </>
  )
}

export default App
