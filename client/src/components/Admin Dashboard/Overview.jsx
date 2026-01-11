import React, { useState, useEffect } from 'react';
import axios from '../../config/api';
import toast from 'react-hot-toast';
import { FaLeaf, FaUsers, FaBox, FaClipboardCheck } from 'react-icons/fa';

const Overview = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    closedLeads: 0,
    totalRMs: 0,
    totalServices: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      // Calculate stats
      const newCount = leads.filter(l => l.leadStatus === 'new').length;
      const contactedCount = leads.filter(l => l.leadStatus === 'contacted').length;
      const convertedCount = leads.filter(l => l.leadStatus === 'converted').length;
      const closedCount = leads.filter(l => l.leadStatus === 'closed').length;

      setStats({
        totalLeads: leads.length,
        newLeads: newCount,
        contactedLeads: contactedCount,
        convertedLeads: convertedCount,
        closedLeads: closedCount,
        totalRMs: rms.length,
        totalServices: services.length,
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
    <div className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition duration-150">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your business summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FaLeaf}
          label="Total Leads"
          value={stats.totalLeads}
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={FaClipboardCheck}
          label="New Leads"
          value={stats.newLeads}
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

      {/* Lead Status Overview */}
      <div className="border border-gray-100 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-3xl font-bold text-blue-600">{stats.newLeads}</p>
            <p className="text-xs text-gray-600 mt-1">New</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-3xl font-bold text-yellow-600">{stats.contactedLeads}</p>
            <p className="text-xs text-gray-600 mt-1">Contacted</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-3xl font-bold text-green-600">{stats.convertedLeads}</p>
            <p className="text-xs text-gray-600 mt-1">Converted</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-3xl font-bold text-gray-600">{stats.closedLeads}</p>
            <p className="text-xs text-gray-600 mt-1">Closed</p>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="border border-gray-100 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h2>
        <div className="space-y-2">
          {recentLeads.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No leads yet</p>
          ) : (
            recentLeads.map((lead) => (
              <div
                key={lead._id}
                className="border border-gray-100 rounded-lg p-3 hover:border-gray-300 transition duration-150"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {lead.clientName}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        #{lead.leadID}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {lead.clientEmail}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {lead.interestedService}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          lead.leadStatus === 'new'
                            ? 'bg-blue-100 text-blue-700'
                            : lead.leadStatus === 'contacted'
                            ? 'bg-yellow-100 text-yellow-700'
                            : lead.leadStatus === 'converted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {lead.leadStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {lead.assignedTo?.fullName || '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalLeads > 0
                ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)
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
            <p className="text-xs text-gray-500 uppercase font-medium">Active Leads</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.newLeads + stats.contactedLeads}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;