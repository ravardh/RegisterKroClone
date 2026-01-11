import React, { useEffect, useState } from "react";
import axios from "../../config/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/rm/leads`);
        const data = res?.data?.data;
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching leads:', err);
        toast.error("Failed to load assigned leads");
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const stages = [
    "new",
    "contacted",
    "proposal sent",
    "negotiation",
    "document collected",
    "Application done",
    "In Progress",
    "Completed",
  ];

  const getCurrentStage = (lead) => {
    if (lead.leadStages && lead.leadStages.length > 0) {
      return lead.leadStages[lead.leadStages.length - 1].stageName;
    }
    return null;
  };

  const stageCounts = {};
  stages.forEach((stage) => {
    stageCounts[stage] = leads.filter((l) => getCurrentStage(l) === stage).length;
  });

  const totalLeads = leads.length;
  const completedLeads = stageCounts["Completed"] || 0;
  const completionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0;

  if (loading) return <div className="p-6 text-center text-gray-600">Loading your assigned leads...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your assigned leads and performance</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition">
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Total Leads</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalLeads}</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition">
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">In Progress</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{(stageCounts["In Progress"] || 0)}</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition">
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedLeads}</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition">
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Completion Rate</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{completionRate}%</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition">
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-2">Active Leads</p>
          <p className="text-3xl font-bold text-gray-900">
            {leads.filter(l => {
              const stage = getCurrentStage(l);
              return stage && stage !== "Completed";
            }).length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Leads in progress</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition">
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-2">No Stage Assigned</p>
          <p className="text-3xl font-bold text-gray-900">
            {leads.filter(l => !getCurrentStage(l)).length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Awaiting stage assignment</p>
        </div>
      </div>

      {/* Stage Distribution */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stage Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map((stage) => (
            <div key={stage} className="text-center p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition">
              <p className="text-2xl font-bold text-gray-900">{stageCounts[stage] || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{stage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
