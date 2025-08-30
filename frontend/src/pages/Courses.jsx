import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
const Courses = () => {
 const [courses, setCourses] = useState([])
 const {user} = useContext(AuthContext)
 useEffect(() => {
  const fetchCourses = async () => {
    try {
      const { data } = await api.get('courses/')
      setCourses(data)
    } catch (error) {
      console.log(error)
    }
  }
  fetchCourses()
}, [])

  return (
   <div className='min-h-screen bg-amber-50 flex flex-col gap-y-20 py-15 items-center'>
    <div className='grid grid-cols-3 gap-x-14 gap-y-14'>
      {courses.map((course)=>{
       return <div key={course.id} className='flex flex-col relative  bg-white w-2xs h-80 rounded-md justify-center items-center  border-2 border-transparent rounded-tr-none rounded-bl-none hover:border-gray-800 transition-all duration-300'>
       <div className='absolute w-full top-10'>
        <h2 className='text-gray-800 font-medium text-2xl border-b-1 text-center pb-4'>{course.name ||"course name"} </h2>
       </div>
       <div className='mt-20 flex flex-col gap-y-3'>
        <p className='font-medium'>instructor : {course.teacher || "abdoulajfldasjf jfs"}</p>
        {user?.role==="teacher" &&
        <>
        <Link className="flex justify-center items-center gap-x-6 hover:text-gray-500 transition-all duration-300">update course <IoCreateOutline/></Link>
        <Link className="flex justify-center items-center gap-x-6 hover:text-gray-500 transition-all duration-300">delete course <MdDeleteOutline/></Link>
        </>
        }
       </div>
      </div>
      })}      
    </div>
   </div>
  )
}

export default Courses
