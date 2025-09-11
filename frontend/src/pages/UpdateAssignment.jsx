import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Toast from "../components/Toast";
import BackButton from "../components/BackButton";

const UpdateAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ course: "", title: "", description: "", due_date: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await api.get(`courses/assignments/${id}/`);
        setForm({
          course: data.course,
          title: data.title,
          description: data.description,
          due_date: data.due_date?.slice(0, 16) || "",
        });
      } catch (error) {
        console.error(error)
        setToast({ isVisible: true, message: "Failed to load assignment", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`courses/assignments/${id}/`, form);
      setToast({ isVisible: true, message: "Assignment updated", type: "success" });
      navigate(`/assignments/${id}`);
    } catch (error) {
      setToast({ isVisible: true, message: error?.response?.data?.error || "Failed to update assignment", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToastClose = () => setToast((p) => ({ ...p, isVisible: false }));

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-800">Update Assignment</h1>
          <div className="w-7" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={saving}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={handleToastClose} />
    </div>
  );
};

export default UpdateAssignment;


