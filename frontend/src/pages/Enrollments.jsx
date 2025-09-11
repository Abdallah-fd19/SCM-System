import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import { IoPersonOutline, IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import Toast from "../components/Toast";
import BackButton from "../components/BackButton";
const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setError('');
      try {
        setLoading(true);        
        const response = await api.get("courses/enrollments/");        
        setEnrollments(response.data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setError(`Failed to load enrollments: ${error.response?.data?.detail || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user]);
    
  const handleUnenroll = async (enrollmentId)=>{
    try {
      setError('')
      await api.delete(`courses/enrollments/${enrollmentId}/`)
      setEnrollments(prev=> prev.filter((enrollment)=> enrollment.id != enrollmentId))
      setToast({ isVisible:true, message: 'Enrollment Deleted Successfully' , type:'success'})
    } catch (error) {
      console.log(error)
      setToast({isVisible:true, message:error?.response?.data?.error || "An error occured while deleting this enrollment", type:'error'})
    }
  } 

  const handleToastClose = ()=>{
    setToast(prev => ({...prev, isVisible:false}))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading enrollments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <h1 className="text-4xl font-bold text-gray-800">My Enrollments</h1>
          <div className="w-7" />
        </div>
        <p className="text-gray-600 text-lg text-center mb-6">
          {user?.role === 'student' 
            ? 'Courses you are enrolled in' 
            : 'Students enrolled in your courses'
          }
        </p>

        {/* Enrollments Grid */}
        {enrollments.length === 0 ? (
          <div className="text-center py-16">
            <IoBookOutline className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No enrollments found</h3>
            <p className="text-gray-500">
              {user?.role === 'student' 
                ? 'You are not enrolled in any courses yet.' 
                : 'No students have enrolled in your courses yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div 
                key={enrollment.id} 
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200 overflow-hidden"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {enrollment.course?.name || 'Course Name'}
                  </h2>
                  <div className="flex items-center text-amber-100 text-sm">
                    <IoPersonOutline className="mr-2" />
                    <span>
                      {user?.role === 'student' 
                        ? `Instructor: ${enrollment.course?.teacher_username || 'No instructor'}`
                        : `Student: ${enrollment.student?.username || 'Unknown student'}`
                      }
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {enrollment.course?.description || 'No description available'}
                  </p>

                  {/* Enrollment Date */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <IoCalendarOutline className="mr-2" />
                    <span>
                      {user?.role === 'student' 
                        ? `Enrolled: ${new Date(enrollment.enrolled_at).toLocaleDateString()}`
                        : `Enrolled: ${new Date(enrollment.enrolled_at).toLocaleDateString()}`
                      }
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors duration-200">
                      <MdOutlineRemoveRedEye />
                      View Details
                    </button>
                    
                    {user?.role === 'student' && (
                      <button 
                        onClick={() => handleUnenroll(enrollment.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                      
                      >
                        <MdDeleteOutline />
                        Unenroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast
      isVisible={toast.isVisible}
      message={toast.message}
      type={toast.type}
      onClose={handleToastClose}
      />
    </div>
  );
};

export default Enrollments;