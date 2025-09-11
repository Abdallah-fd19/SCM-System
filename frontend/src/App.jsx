import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx';
import Nav from './components/Nav.jsx'
import Courses from './pages/Courses.jsx';
import UpdateCourse from './pages/UpdateCourse.jsx';
import CreateCourse from './pages/CreateCourse.jsx';
import Enrollments from './pages/Enrollments.jsx';
import Assignments from './pages/Assignments.jsx';
import CreateAssignment from './pages/CreateAssignment.jsx';
import AssignmentDetail from './pages/AssignmentDetail.jsx';
import UpdateAssignment from './pages/UpdateAssignment.jsx';
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
          <Route path='/courses/:id/update' element={<UpdateCourse />} />
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/courses/create' element={<CreateCourse />} />
          <Route path='/enrollments' element={<Enrollments />} />
          <Route path='/assignments' element={<Assignments />} />
          <Route path='/assignments/create' element={<CreateAssignment />} />
          <Route path='/assignments/:id' element={<AssignmentDetail />} />
          <Route path='/assignments/:id/update' element={<UpdateAssignment />} />
        </Routes>      
      </div>
    </>
  )
}

export default App
