import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/Toast";

const CreateAssignment = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course: "", title: "", description: "", due_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("courses/");
        setCourses(data);
      } catch (error) {
        console.error(error)
        setToast({ isVisible: true, message: "Failed to load courses", type: "error" });
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("courses/assignments/", form);
      setToast({ isVisible: true, message: "Assignment created successfully", type: "success" });
      setForm({ course: "", title: "", description: "", due_date: "" });
    } catch (error) {
      setToast({ isVisible: true, message: error?.response?.data?.error || "Failed to create assignment", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToastClose = () => setToast((p) => ({ ...p, isVisible: false }));

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Assignment</h1>

        {user?.role !== "teacher" ? (
          <p className="text-red-600">Only teachers can create assignments.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Course</label>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Due Date</label>
              <input
                type="datetime-local"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </form>
        )}
      </div>
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={handleToastClose} />
    </div>
  );
};

export default CreateAssignment;


