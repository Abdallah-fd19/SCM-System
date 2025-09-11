import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Toast from '../components/Toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [err, setErr] = useState('')
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: null,
    courseName: '',
    isLoading: false
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });
  const { user } = useContext(AuthContext);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('courses/');
      setCourses(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEnrollments = async ()=>{
    try {
      const { data } = await api.get('courses/enrollments')
      const enrolledIds = data.map((enrollment)=>{
        return enrollment.course.id
      })
      setEnrolledCourses(enrolledIds)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const handleDeleteClick = (courseId, courseName) => {
    setDeleteModal({
      isOpen: true,
      courseId,
      courseName,
      isLoading: false
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      await api.delete(`courses/${deleteModal.courseId}/`);
      
      // Remove the course from the local state
      setCourses(prev => prev.filter(course => course.id !== deleteModal.courseId));
      
      // Close the modal
      setDeleteModal({
        isOpen: false,
        courseId: null,
        courseName: '',
        isLoading: false
      });

      // Show success toast
      setToast({
        isVisible: true,
        message: 'Course deleted successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      
      // Close the modal
      setDeleteModal({
        isOpen: false,
        courseId: null,
        courseName: '',
        isLoading: false
      });

      // Show error toast
      setToast({
        isVisible: true,
        message: 'Failed to delete course. Please try again.',
        type: 'error'
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      courseId: null,
      courseName: '',
      isLoading: false
    });
  };

  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };


  const handleEnroll = async (courseId)=>{
    try {
      const { data } = await api.post('courses/enrollments/', {course:courseId})
      setEnrolledCourses(prev => [...prev, data.course.id])
      setErr('')
    } catch (error) {
      console.error(error)
      setErr(error.response?.data?.error || 'An error occured while enrolling')
    }
  }
  return (
    <div className='min-h-screen bg-amber-50 flex flex-col gap-y-20 py-15 items-center'>
      <div className='grid grid-cols-3 gap-x-14 gap-y-14'>
        {courses.map((course) => {
          return (
            <div key={course.id} className='flex flex-col relative bg-white w-2xs h-80 rounded-md justify-center items-center border-2 border-transparent rounded-tr-none rounded-bl-none hover:border-gray-800 transition-all duration-300'>
              <div className='absolute w-full top-10'>
                <h2 className='text-gray-800 font-medium text-2xl border-b-1 text-center pb-4'>
                  {course.name || "course name"}
                </h2>
              </div>
              <div className='mt-20 flex flex-col gap-y-3'>
                <p className='font-medium'>instructor : {course.teacher_username || "No instructor assigned"}</p>
                {user?.role === "teacher" ? (
                  <>
                    <Link 
                      to={`/courses/${course.id}/update`} 
                      className="flex justify-center items-center gap-x-6 hover:text-blue-500 transition-all duration-300"
                    >
                      update course <IoCreateOutline/>
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(course.id, course.name)}
                      className="flex justify-center items-center gap-x-6 hover:text-red-500 transition-all duration-300 text-gray-700"
                    >
                      delete course <MdDeleteOutline/>
                    </button>
                  </>
                ) :
                <div>
                  { enrolledCourses.includes(course.id) ? <p>Already enrolled</p> 
                  :
                  <>
                    <button className='cursor-pointer' onClick={()=>{ handleEnroll(course.id) }}>Enroll</button>
                    <p>{err}</p>
                  </>
                  }
                </div>
                }
              </div>
              
            </div>
          );
        })}      
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will remove all associated data."
        itemName={deleteModal.courseName}
        isLoading={deleteModal.isLoading}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default Courses;
