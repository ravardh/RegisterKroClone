import React, { useEffect, useState } from "react";
import axios from "../../config/api";
import toast from "react-hot-toast";

const dummyLeads = [
  { leadID: "LD001", clientName: "John Smith", interestedService: "Company Registration", leadStatus: "new", createdAt: "2026-01-08T10:30:00Z" },
  { leadID: "LD002", clientName: "Sarah Johnson", interestedService: "GST Registration", leadStatus: "contacted", createdAt: "2026-01-07T14:20:00Z" },
  { leadID: "LD003", clientName: "Michael Brown", interestedService: "Income Tax Filing", leadStatus: "qualified", createdAt: "2026-01-06T09:15:00Z" },
  { leadID: "LD004", clientName: "Emily Davis", interestedService: "Trademark Registration", leadStatus: "converted", createdAt: "2026-01-05T16:45:00Z" },
  { leadID: "LD005", clientName: "Robert Wilson", interestedService: "Accounting Services", leadStatus: "new", createdAt: "2026-01-09T11:00:00Z" },
  { leadID: "LD006", clientName: "Jessica Martinez", interestedService: "Business Consulting", leadStatus: "contacted", createdAt: "2026-01-04T13:30:00Z" },
  { leadID: "LD007", clientName: "David Anderson", interestedService: "FSSAI Registration", leadStatus: "unqualified", createdAt: "2026-01-03T10:20:00Z" },
];

const Dashboard = () => {
  const [leads, setLeads] = useState(dummyLeads);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const rmId = localStorage.getItem("userId");
        if (!rmId) {
          setLeads(dummyLeads);
          setLoading(false);
          return;
        }
        const res = await axios.get(`/rm/leads`, { params: { rmId } });
        const data = res?.data?.data;
        setLeads(Array.isArray(data) && data.length ? data : dummyLeads);
      } catch (err) {
        console.error('Error fetching leads:', err);
        toast.error("Failed to load leads. Showing sample data.");
        setLeads(dummyLeads);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const leadCounts = {
    new: leads.filter((l) => l.leadStatus === "new").length,
    contacted: leads.filter((l) => l.leadStatus === "contacted").length,
    qualified: leads.filter((l) => l.leadStatus === "qualified").length,
    converted: leads.filter((l) => l.leadStatus === "converted").length,
    unqualified: leads.filter((l) => l.leadStatus === "unqualified").length,
  };

  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((leadCounts.converted / totalLeads) * 100) : 0;

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your leads and performance</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">New</div>
          <div className="text-2xl font-bold text-blue-600">{leadCounts.new}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Contacted</div>
          <div className="text-2xl font-bold text-yellow-600">{leadCounts.contacted}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Qualified</div>
          <div className="text-2xl font-bold text-purple-600">{leadCounts.qualified}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Converted</div>
          <div className="text-2xl font-bold text-green-600">{leadCounts.converted}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Unqualified</div>
          <div className="text-2xl font-bold text-red-600">{leadCounts.unqualified}</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-2">Total Leads</div>
          <div className="text-4xl font-bold text-gray-800 mb-4">{totalLeads}</div>
          <div className="text-xs text-gray-500">All assigned leads</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-2">Conversion Rate</div>
          <div className="text-4xl font-bold text-green-600 mb-4">{conversionRate}%</div>
          <div className="text-xs text-gray-500">{leadCounts.converted} out of {totalLeads} converted</div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Pending Follow-up</div>
              <div className="text-3xl font-bold text-yellow-600">{leadCounts.new + leadCounts.contacted}</div>
            </div>
            <div className="text-5xl opacity-10">📞</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Ready to Proceed</div>
              <div className="text-3xl font-bold text-purple-600">{leadCounts.qualified}</div>
            </div>
            <div className="text-5xl opacity-10">✓</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Success Rate</div>
              <div className="text-3xl font-bold text-green-600">{totalLeads > 0 ? Math.round(((leadCounts.qualified + leadCounts.converted) / totalLeads) * 100) : 0}%</div>
            </div>
            <div className="text-5xl opacity-10">🎯</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
