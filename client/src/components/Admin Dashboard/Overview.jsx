import React, { useState, useEffect } from 'react';
import axios from '../../config/api';
import toast from 'react-hot-toast';
import { FaLeaf, FaUsers, FaBox, FaClipboardCheck, FaTrash } from 'react-icons/fa';

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

const stageColors = {
  new: "bg-gray-100 text-gray-700",
  contacted: "bg-blue-100 text-blue-700",
  "proposal sent": "bg-purple-100 text-purple-700",
  negotiation: "bg-orange-100 text-orange-700",
  "document collected": "bg-yellow-100 text-yellow-700",
  "Application done": "bg-indigo-100 text-indigo-700",
  "In Progress": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
};

const Overview = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    completedLeads: 0,
    inProgressLeads: 0,
    noStageLeads: 0,
    totalRMs: 0,
    totalServices: 0,
    stageCounts: {},
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getCurrentStage = (lead) => {
    if (lead.leadStages && lead.leadStages.length > 0) {
      return lead.leadStages[lead.leadStages.length - 1].stageName;
    }
    return null;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsRes, rmsRes, servicesRes] = await Promise.all([
        axios.get('/admin/leads'),
        axios.get('/admin/rm'),
        axios.get('/public/services'),
      ]);

      const leads = leadsRes.data.data || [];
      const rms = rmsRes.data.data || [];
      const services = servicesRes.data.data || [];

      // Calculate stats based on stages
      const stageCounts = {};
      stages.forEach(stage => {
        stageCounts[stage] = leads.filter(l => getCurrentStage(l) === stage).length;
      });

      const completedLeads = stageCounts["Completed"] || 0;
      const inProgressLeads = stageCounts["In Progress"] || 0;
      const noStageLeads = leads.filter(l => !getCurrentStage(l)).length;

      setStats({
        totalLeads: leads.length,
        completedLeads,
        inProgressLeads,
        noStageLeads,
        totalRMs: rms.length,
        totalServices: services.length,
        stageCounts,
      });

      // Get recent 5 leads
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary) mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, bgColor }) => (
    <div className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition duration-150">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${bgColor}`}>
          <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Welcome back! Here's your business summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={FaLeaf}
          label="Total Leads"
          value={stats.totalLeads}
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={FaClipboardCheck}
          label="Completed"
          value={stats.completedLeads}
          bgColor="bg-green-500"
        />
        <StatCard
          icon={FaUsers}
          label="Relationship Managers"
          value={stats.totalRMs}
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={FaBox}
          label="Total Services"
          value={stats.totalServices}
          bgColor="bg-orange-500"
        />
      </div>

      {/* Lead Stage Distribution */}
      <div className="border border-gray-100 rounded-lg p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Lead Stage Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {stages.map(stage => (
            <div key={stage} className={`text-center p-2 sm:p-3 rounded-lg border ${stageColors[stage]}`}>
              <p className="text-xl sm:text-2xl font-bold">{stats.stageCounts[stage] || 0}</p>
              <p className="text-xs mt-1 line-clamp-2">{stage}</p>
            </div>
          ))}
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xl sm:text-2xl font-bold text-gray-600">{stats.noStageLeads}</p>
            <p className="text-xs text-gray-600 mt-1">No Stage</p>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="border border-gray-100 rounded-lg p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Leads</h2>
        <div className="space-y-2">
          {recentLeads.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No leads yet</p>
          ) : (
            recentLeads.map((lead) => {
              const currentStage = getCurrentStage(lead);
              return (
                <div
                  key={lead._id}
                  className="border border-gray-100 rounded-lg p-2 sm:p-3 hover:border-gray-300 transition duration-150"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                          {lead.clientName}
                        </h3>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            #{lead.serviceID || lead.leadID}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 break-all">
                        {lead.clientEmail}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded break-words">
                          {lead.interestedService}
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold break-words">
                          {lead.state || "N/A"}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${
                            stageColors[currentStage] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {currentStage || 'No Stage'}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                      <p className="text-xs text-gray-500">
                        {lead.assignedTo?.fullName || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalLeads > 0
                ? ((stats.completedLeads / stats.totalLeads) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Avg Leads per RM</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalRMs > 0 ? (stats.totalLeads / stats.totalRMs).toFixed(1) : 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">In Progress</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.inProgressLeads}
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="border border-red-100 rounded-lg p-4 bg-red-50">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Storage Maintenance</h2>
        <p className="text-xs text-gray-500 mb-4">
          Remove files in the uploads folder that are no longer linked to any service document.
        </p>
        <button
          onClick={async () => {
            if (!window.confirm('This will permanently delete all orphaned files from the server uploads folder. Continue?')) return;
            try {
              setPurging(true);
              const res = await axios.delete('/services/maintenance/purge-orphaned-documents');
              const { message, deleted } = res.data;
              toast.success(`${message}${deleted.length ? ' (' + deleted.join(', ') + ')' : ''}`);
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Purge failed');
            } finally {
              setPurging(false);
            }
          }}
          disabled={purging}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <FaTrash className="w-3.5 h-3.5" />
          {purging ? 'Purging...' : 'Purge Orphaned Files'}
        </button>
      </div>
    </div>
  );
};

export default Overview;