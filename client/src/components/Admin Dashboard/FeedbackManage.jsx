import React, { useEffect, useState } from "react";
import axios from "../../config/api";
import { toast } from "react-hot-toast";

const FeedbackManage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/admin/feedbacks");
      setFeedbacks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const approveFeedback = async (id) => {
    try {
      const res = await axios.patch(`/admin/feedbacks/${id}/approve`);
      const updated = res.data.data;
      setFeedbacks((prev) => prev.map((fb) => (fb._id === id ? updated : fb)));
      toast.success("Feedback approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve feedback");
    }
  };

  const rejectFeedback = async (id) => {
    try {
      await axios.delete(`/admin/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
      toast.success("Feedback rejected and removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject feedback");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-(--text)">Feedbacks</h2>
      </div>

      {loading && <p className="text-sm text-gray-600">Loading feedbacks...</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {!loading && feedbacks.length === 0 && (
        <p className="text-sm text-gray-600">No feedbacks found.</p>
      )}

      {!loading && feedbacks.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.map((fb) => (
                <tr key={fb._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-(--text)">{fb.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{fb.email}</td>
                  <td className="px-4 py-3 text-gray-600">{fb.serviceAvailed?.serviceName || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{fb.starRating}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs whitespace-pre-wrap">{fb.message}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        fb.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {fb.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => approveFeedback(fb._id)}
                      className="px-2 py-1.5 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                      disabled={fb.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectFeedback(fb._id)}
                      className="px-2.5 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackManage;
