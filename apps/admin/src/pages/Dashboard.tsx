import React from 'react';
import Layout from '../components/layout/Layout';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, Users, BookOpen, AlertCircle, TrendingUp, 
  ArrowUpRight, Clock, Shield, Database, Activity, 
  CheckCircle2, UserPlus, FileEdit, Trash2 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboardStats();

  const statCards = [
    { 
      label: 'Total Students', 
      value: stats.students, 
      icon: Users, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-500/10',
      trend: '+12.5%'
    },
    { 
      label: 'Grade Levels', 
      value: stats.grades, 
      icon: LayoutGrid, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      trend: 'All active'
    },
    { 
      label: 'Subjects', 
      value: stats.subjects, 
      icon: BookOpen, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      trend: '4 new'
    },
    { 
      label: 'Question Bank', 
      value: stats.questions, 
      icon: AlertCircle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10',
      trend: '+85 today'
    }
  ];

  const systemStatus = [
    { label: 'API Server', status: 'Healthy', icon: Activity, color: 'text-emerald-400' },
    { label: 'Database', status: 'Connected', icon: Database, color: 'text-indigo-400' },
    { label: 'Security', status: 'Active', icon: Shield, color: 'text-amber-400' }
  ];

  const recentActivity = [
    { type: 'CREATE', user: 'Admin', action: 'Added new Grade 10', time: '2 mins ago', icon: UserPlus },
    { type: 'UPDATE', user: 'Admin', action: 'Modified Question #402', time: '15 mins ago', icon: FileEdit },
    { type: 'DELETE', user: 'Admin', action: 'Removed obsolete subject', time: '1 hour ago', icon: Trash2 },
    { type: 'CREATE', user: 'System', action: 'Daily backup completed', time: '3 hours ago', icon: CheckCircle2 }
  ];

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-96 glass-card border-red-500/20">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card group cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {loading ? (
                  <div className="h-9 w-20 bg-white/5 animate-pulse rounded-lg" />
                ) : stat.value}
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Updated just now</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytical Section: Recent Joins */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">Recent Student Joins</h3>
                <p className="text-slate-500 text-xs font-medium">Real-time registration tracking</p>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-bold">View Directory</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5 font-bold">
                  <th className="pb-4 px-2">Student</th>
                  <th className="pb-4 px-2">Educational Level</th>
                  <th className="pb-4 px-2 text-right">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            <td colSpan={3} className="py-6 px-2"><div className="h-4 bg-white/5 rounded-lg w-full" /></td>
                        </tr>
                    ))
                ) : stats.recentStudents.length > 0 ? (
                  stats.recentStudents.map((student, idx) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{student.name}</div>
                                <div className="text-[10px] text-slate-500 italic">{student.email}</div>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold">
                            {student.educationalLevel || 'General'}
                        </span>
                    </td>
                    <td className="py-4 px-2 text-right text-xs text-slate-500 font-mono">
                        {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))) : (
                    <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500 italic text-sm">No new registrations recently.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Status & Activity Feed */}
        <div className="space-y-8">
            {/* System Status */}
            <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-indigo-400" />
                    System Status
                </h3>
                <div className="space-y-4">
                    {systemStatus.map((item) => (
                        <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">{item.label}</div>
                                    <div className="text-[10px] text-slate-500 tracking-wider uppercase font-bold">{item.status}</div>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-amber-400" />
                    Activity Feed
                </h3>
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                    {recentActivity.map((activity, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 pl-8 group">
                            <div className="absolute left-0 top-1 p-1 rounded-full bg-slate-900 border border-white/10 text-slate-400 group-hover:text-white transition-colors z-10 bg-slate-900 shadow-xl">
                                <activity.icon size={14} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{activity.action}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="text-[10px] text-slate-500 font-medium">By {activity.user}</div>
                                    <div className="text-[10px] text-slate-600 italic font-mono">{activity.time}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
