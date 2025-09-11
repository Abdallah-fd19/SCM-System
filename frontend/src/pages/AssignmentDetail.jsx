import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/Toast";
import BackButton from "../components/BackButton";

const AssignmentDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      setError("");
      try {
        const { data } = await api.get(`courses/assignments/${id}/`);
        setAssignment(data);
      } catch (error) {
        setError(error?.response?.data?.error || "Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading assignment...</div>
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

  if (!assignment) return null;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
          {user?.role === "teacher" && (
            <Link
              to={`/assignments/${assignment.id}/update`}
              className="px-3 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
            >
              Edit
            </Link>
          )}
        </div>
        <p className="text-gray-600 mb-6">{assignment.description}</p>
        <div className="text-gray-700">Due: {new Date(assignment.due_date).toLocaleString()}</div>
        <div className="text-gray-500 mt-2">Course : {assignment.course_name}</div>
      </div>
    </div>
  );
};

export default AssignmentDetail;


