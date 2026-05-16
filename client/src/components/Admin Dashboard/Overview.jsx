import React, { useState, useEffect } from 'react';
import axios from '../../config/api';
import toast from 'react-hot-toast';
import { FaLeaf, FaUsers, FaBox, FaClipboardCheck, FaTrash, FaDatabase } from 'react-icons/fa';
import clsx from 'clsx';

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
  new: "bg-gray-50 text-gray-600 border-gray-100",
  contacted: "bg-blue-50 text-blue-600 border-blue-100",
  "proposal sent": "bg-purple-50 text-purple-600 border-purple-100",
  negotiation: "bg-orange-50 text-orange-600 border-orange-100",
  "document collected": "bg-yellow-50 text-yellow-600 border-yellow-100",
  "Application done": "bg-indigo-50 text-indigo-600 border-indigo-100",
  "In Progress": "bg-cyan-50 text-cyan-600 border-cyan-100",
  Completed: "bg-green-50 text-green-600 border-green-100",
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
  const [backingUp, setBackingUp] = useState(false);

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

      setRecentLeads(leads.slice(0, 6));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setBackingUp(true);
      toast.loading('Generating backup...', { id: 'backup-toast' });
      
      const response = await axios.get('/admin/backup-db', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `registerkro_backup_${date}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Backup downloaded successfully!', { id: 'backup-toast' });
    } catch (error) {
      console.error('Backup failed:', error);
      toast.error('Failed to generate backup. Make sure server is configured.', { id: 'backup-toast' });
    } finally {
      setBackingUp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium italic">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, colorClass, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className={clsx("p-3 rounded-xl text-white shadow-sm group-hover:scale-110 transition-transform", colorClass)}>
          <Icon size={20} />
        </div>
        {trend && <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+{trend}%</span>}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Refined Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back! Here's your business performance today.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleBackup}
            disabled={backingUp}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl hover:bg-purple-100 transition-all font-semibold active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FaDatabase className={clsx(backingUp && "animate-pulse")} />
            {backingUp ? "Generating..." : "Backup DB"}
          </button>
          <button
            onClick={fetchDashboardData}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold active:scale-95 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaLeaf}
          label="Total Leads"
          value={stats.totalLeads}
          colorClass="bg-blue-600"
          trend="12"
        />
        <StatCard
          icon={FaClipboardCheck}
          label="Completed"
          value={stats.completedLeads}
          colorClass="bg-green-600"
          trend="8"
        />
        <StatCard
          icon={FaUsers}
          label="Team Members"
          value={stats.totalRMs}
          colorClass="bg-purple-600"
        />
        <StatCard
          icon={FaBox}
          label="Active Services"
          value={stats.totalServices}
          colorClass="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Stages */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Lead Stage Distribution</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stages.map(stage => (
              <div 
                key={stage} 
                className={clsx(
                  "flex flex-col items-center justify-center p-5 rounded-2xl border transition-all hover:border-gray-300",
                  stageColors[stage] || 'bg-gray-50 border-gray-100'
                )}
              >
                <span className="text-2xl font-bold mb-1">{stats.stageCounts[stage] || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center opacity-70">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Quick Peek */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Quick Analytics</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Completion Rate</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-800">
                  {stats.totalLeads > 0 ? ((stats.completedLeads / stats.totalLeads) * 100).toFixed(1) : 0}%
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${stats.totalLeads > 0 ? (stats.completedLeads / stats.totalLeads) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">System Action</p>
              <button
                onClick={async () => {
                  if (!window.confirm('Run maintenance?')) return;
                  try {
                    setPurging(true);
                    await axios.delete('/services/maintenance/purge-orphaned-documents');
                    toast.success('System cleaned!');
                  } catch {
                    toast.error('Failed');
                  } finally {
                    setPurging(false);
                  }
                }}
                disabled={purging}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all font-semibold active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
              >
                <FaTrash size={12} />
                {purging ? 'Running...' : 'Run Maintenance'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentLeads.length === 0 ? (
            <p className="col-span-full text-center py-8 text-gray-400 italic">No recent activity</p>
          ) : (
            recentLeads.map((lead) => {
              const currentStage = getCurrentStage(lead);
              return (
                <div
                  key={lead._id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all cursor-default"
                >
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-sm">
                    {lead.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate text-sm">{lead.clientName}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className={clsx(
                        "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border",
                        stageColors[currentStage] || 'bg-gray-50 border-gray-200 text-gray-500'
                      )}>
                        {currentStage || 'NEW'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
