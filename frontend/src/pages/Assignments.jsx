import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import Toast from "../components/Toast";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignments = async () => {
      setError("");
      try {
        setLoading(true);
        const { data } = await api.get("courses/assignments/");
        console.log(data)
        setAssignments(data);
      } catch (error) {
        setError(`Failed to load assignments: ${error.response?.data?.detail || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user]);

  const handleDelete = async (assignmentId) => {
    try {
      await api.delete(`courses/assignments/${assignmentId}/`);
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setToast({ isVisible: true, message: "Assignment deleted successfully", type: "success" });
    } catch (error) {
      setToast({ isVisible: true, message: error?.response?.data?.error || "Failed to delete assignment", type: "error" });
    }
  };

  const handleToastClose = () => setToast((p) => ({ ...p, isVisible: false }));

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading assignments...</div>
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
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <h1 className="text-4xl font-bold text-gray-800">Assignments</h1>
          <div className="w-7" />
        </div>
        <p className="text-gray-600 text-lg text-center mb-6">
          {user?.role === "student" ? "Assignments for your enrolled courses" : "Assignments in your courses"}
        </p>

        {assignments.length === 0 ? (
          <div className="text-center py-16">
            <IoBookOutline className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No assignments found</h3>
            <p className="text-gray-500">There are no assignments to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{assignment.title}</h2>
                  <div className="text-amber-100 text-sm">Course: {assignment.course_name}</div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-4 line-clamp-3">{assignment.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <IoCalendarOutline className="mr-2" />
                    <span>Due: {new Date(assignment.due_date).toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/assignments/${assignment.id}`}                      
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors duration-200"
                    >
                      <MdOutlineRemoveRedEye /> View Details
                    </Link>
                    {user?.role === "teacher" && (
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                      >
                        <MdDeleteOutline /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={handleToastClose} />
    </div>
  );
};

export default Assignments;


