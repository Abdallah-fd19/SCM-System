import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { Link } from "react-router-dom";  
import { AuthContext } from "../context/AuthContext.jsx";
import { useContext } from "react";
import TeacherBarChart from "../components/TeacherBarChart.jsx";
import StudentPieChart from "../components/StudentPieChart.jsx";
const Dashboard = ()=>{
 const { user } = useContext(AuthContext)
 return(
 <>
  <div className="min-h-screen bg-amber-50 grid grid-rows-2 overflow-auto pb-20">
   <div className="grid grid-cols-3 m-auto gap-x-15 justify-center items-center">
    <div className="flex flex-col gap-y-8 bg-white w-2xs h-80 rounded-md justify-center items-center relative border-2 border-transparent rounded-tr-none rounded-bl-none hover:border-gray-800 transition-all duration-300">
     <h2 className="text-gray-800 font-medium text-2xl absolute top-10 border-b-1 w-full text-center pb-4">Courses</h2>
     <Link to={"/courses"} className="mt-16 flex justify-center items-center gap-x-6 hover:text-gray-500 transition-all duration-300">
      View courses <MdOutlineRemoveRedEye/>
     </Link>
     {user?.role==='teacher' && <Link to={"/courses/create"} className="flex justify-center items-center gap-x-6 hover:text-yellow-500 transition-all duration-300">
      Create course <IoCreateOutline/>
     </Link>}
    </div>
    <div className="flex flex-col gap-y-8 bg-white w-2xs h-80 rounded-md justify-center items-center relative border-2 border-transparent rounded-tr-none rounded-bl-none hover:border-gray-800 transition-all duration-300">
     <h2 className="text-gray-800 font-medium text-2xl absolute top-10 border-b-1 w-full text-center pb-4">Assignments</h2>
     <Link to={"/assignments"} className="mt-16 flex justify-center items-center gap-x-6 hover:text-gray-500 transition-all duration-300">
      View assignments <MdOutlineRemoveRedEye/>
     </Link>
     {user?.role==='teacher' && <Link to={"/assignments/create"} className="flex justify-center items-center gap-x-6 hover:text-yellow-500 transition-all duration-300">
      Create assignments <IoCreateOutline/>
     </Link>}
    </div>
    <div className="flex flex-col gap-y-8 bg-white w-2xs h-80 rounded-md justify-center items-center relative border-2 border-transparent rounded-tr-none rounded-bl-none hover:border-gray-800 transition-all duration-300">
     <h2 className="text-gray-800 font-medium text-2xl absolute top-10 border-b-1 w-full text-center pb-4">Enrollments</h2>
     <Link to={"/enrollments"} className="mt-16 flex justify-center items-center gap-x-6 hover:text-gray-500 transition-all duration-300">
      View enrollments <MdOutlineRemoveRedEye/>
     </Link>     
    </div>
   </div>
   <div className="grid grid-cols-1 m-auto">
    <div className="w-3xl h-80 ">{user?.role==='teacher' ? <TeacherBarChart/> : user?.role==='student' ? <StudentPieChart/> : ""}</div>
   </div>
  </div>
 </>
 )
}

export default Dashboard;