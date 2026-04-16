import { useEffect, useState, useMemo } from 'react'
import { adminTutorService } from '../services/admin-tutor.service'
import { 
  Loader2, Check, X, Eye, Mail, Phone, BookOpen, Users, 
  Search, Filter, Calendar, AlertCircle, CheckCircle2, 
  Clock, ArrowUpRight, GraduationCap, XCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/layout/Layout'

interface TutorRegistration {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  studentCount: string
  username: string
  status: string
  createdAt: string
  rejectionReason?: string
}

export default function Tutors() {
  const [registrations, setRegistrations] = useState<TutorRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [selectedTutor, setSelectedTutor] = useState<TutorRegistration | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionValidationError, setRejectionValidationError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedTodayCount: 0,
    recentRejectionsCount: 0,
  })

  useEffect(() => {
    loadRegistrations()
    loadStats()
    setSelectedTutor(null)
  }, [statusFilter])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const data = await adminTutorService.getTutorStats(token || undefined)
      setStats(data)
    } catch (err) {
      console.error('Failed to load tutor stats:', err)
    }
  }

  const loadRegistrations = async () => {
    setIsLoading(true)
    setError(null)
    setActionError(null)
    try {
      const token = localStorage.getItem('admin_token')
      const data = await adminTutorService.getTutorRegistrations(statusFilter, token || undefined)
      setRegistrations(data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveTutor = async (id: string) => {
    setIsProcessing(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const token = localStorage.getItem('admin_token')
      await adminTutorService.approveTutorRegistration(id, token || undefined)
      setRegistrations(registrations.filter(r => r.id !== id))
      setSelectedTutor(null)
      setActionSuccess('Tutor approved successfully. Credentials were sent via email.')
      loadStats()
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectTutor = async (id: string) => {
    if (!rejectionReason.trim()) {
      setRejectionValidationError('Please provide a rejection reason.')
      return
    }

    setIsProcessing(true)
    setActionError(null)
    setActionSuccess(null)
    setRejectionValidationError(null)
    try {
      const token = localStorage.getItem('admin_token')
      await adminTutorService.rejectTutorRegistration(id, rejectionReason, token || undefined)
      setRegistrations(registrations.filter(r => r.id !== id))
      setSelectedTutor(null)
      setRejectionReason('')
      setActionSuccess('Tutor registration rejected successfully.')
      loadStats()
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [registrations, searchQuery])

  const getStudentCountLabel = (count: string) => {
    const mapping: { [key: string]: string } = {
      ZERO_FIFTY: '0-50',
      FIFTY_FIVE_HUNDRED: '50-500',
      FIVE_HUNDRED_PLUS: '500+',
    }
    return mapping[count] || count
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]';
      case 'APPROVED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]';
      case 'REJECTED': return 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(251,113,133,0.1)]';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  }

  return (
    <Layout title="Tutor Registrations">
      <div className="space-y-8 pb-10">
        {/* Header Section with Stats - Visual enhancement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex items-center gap-4 py-4"
          >
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
              <p className="text-2xl font-bold text-white">{stats.pendingCount}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card flex items-center gap-4 py-4"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Approved Today</p>
              <p className="text-2xl font-bold text-white">{stats.approvedTodayCount}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card flex items-center gap-4 py-4"
          >
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Recent Rejections</p>
              <p className="text-2xl font-bold text-white">{stats.recentRejectionsCount}</p>
            </div>
          </motion.div>
        </div>

        {/* Action Bar: Filters & Search */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col lg:flex-row gap-4 justify-between items-center"
        >
          <div className="flex bg-slate-900/40 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/40 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all backdrop-blur-md"
            />
          </div>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence mode="wait">
          {actionSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 backdrop-blur-md"
            >
              <CheckCircle2 size={18} />
              {actionSuccess}
            </motion.div>
          )}

          {actionError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3 backdrop-blur-md"
            >
              <AlertCircle size={18} />
              <div>
                <p className="font-bold">Action Failed</p>
                <p className="mt-1 opacity-80">{actionError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 glass-card">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 animate-pulse font-medium">Fetching registrations...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center glass-card border-rose-500/20">
                <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Error Occurred</h3>
                <p className="text-slate-400 mb-6">{error}</p>
                <button
                  onClick={loadRegistrations}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 mx-auto"
                >
                  Try Again
                </button>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="py-20 text-center glass-card">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600 ring-1 ring-white/5 shadow-inner">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No applications found</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm italic">
                  {searchQuery ? `No results for "${searchQuery}" in ${statusFilter.toLowerCase()} list.` : `There are currently no ${statusFilter.toLowerCase()} tutor registrations.`}
                </p>
              </div>
            ) : (
              <motion.div 
                layout
                className="glass-card p-0 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5 font-bold">
                        <th className="py-6 px-6">Tutor Candidate</th>
                        <th className="py-6 px-6">Specialization</th>
                        <th className="py-6 px-6 text-right">Applied On</th>
                        <th className="py-6 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRegistrations.map((registration, idx) => (
                        <motion.tr
                          key={registration.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setSelectedTutor(registration)}
                          className={`group cursor-pointer transition-all ${
                            selectedTutor?.id === registration.id 
                              ? 'bg-indigo-500/5 border-l-2 border-l-indigo-500' 
                              : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                          }`}
                        >
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
                                {registration.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{registration.name}</div>
                                <div className="text-[11px] text-slate-500 font-medium">@{registration.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-[10px] text-slate-300 font-bold flex items-center gap-1.5 ring-1 ring-white/5">
                                <GraduationCap size={12} className="text-indigo-400" />
                                {registration.subject}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right text-xs font-medium text-slate-500 font-mono">
                            {new Date(registration.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-5 px-6 text-center">
                            <div className="flex justify-center">
                              <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all border border-transparent group-hover:border-indigo-500/20">
                                <Eye size={18} />
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>

          {/* Details Side Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedTutor ? (
                <motion.div
                  key={selectedTutor.id}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  className="glass-card border-indigo-500/20 sticky top-24 shadow-2xl shadow-indigo-500/10"
                >
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 text-slate-500">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ArrowUpRight size={20} className="text-indigo-400" />
                      Application Details
                    </h3>
                    <button 
                      onClick={() => setSelectedTutor(null)}
                      className="p-1 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedTutor.status)}`}>
                        {selectedTutor.status}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-5">
                      <div className="space-y-4">
                        <div className="group">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block group-hover:text-indigo-400 transition-colors">Tutor Name</label>
                          <p className="text-white font-bold text-lg">{selectedTutor.name}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Username</label>
                            <p className="text-indigo-400 font-mono text-xs">@{selectedTutor.username}</p>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Scale</label>
                            <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold">
                              <Users size={12} className="text-indigo-400" />
                              {getStudentCountLabel(selectedTutor.studentCount)} Std
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Mail size={16} />
                          </div>
                          <div className="flex-1 overflow-hidden truncate">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Email Address</p>
                            <p className="text-slate-200 text-xs truncate font-medium">{selectedTutor.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Phone size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Phone Number</p>
                            <p className="text-slate-200 text-xs font-medium">{selectedTutor.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/10">
                          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                            <BookOpen size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Subject Expertise</p>
                            <p className="text-white text-xs font-black">{selectedTutor.subject}</p>
                          </div>
                        </div>
                      </div>

                      {/* Applied Date */}
                      <div className="flex items-center justify-between text-xs py-4 border-t border-white/5 font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> Submission Date</span>
                        <span className="text-slate-300 font-mono">{new Date(selectedTutor.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Rejection Details if applicable */}
                      {selectedTutor.status === 'REJECTED' && selectedTutor.rejectionReason && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                          <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2 block">Reason for Rejection</label>
                          <p className="text-sm italic font-medium">"{selectedTutor.rejectionReason}"</p>
                        </div>
                      )}
                    </div>

                    {/* Review Actions */}
                    {selectedTutor.status === 'PENDING' && (
                      <div className="space-y-4 pt-6 mt-4 border-t border-white/5">
                        <button
                          onClick={() => handleApproveTutor(selectedTutor.id)}
                          disabled={isProcessing}
                          className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95 transition-all group"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                              Approve Candidate
                            </>
                          )}
                        </button>

                        <div className="relative group">
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => {
                              setRejectionReason(e.target.value)
                              if (rejectionValidationError && e.target.value.trim()) {
                                setRejectionValidationError(null)
                              }
                            }}
                            placeholder="Reason for rejection (mandatory)"
                            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all resize-none ${
                              rejectionValidationError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/5 focus:ring-indigo-500/20'
                            }`}
                            rows={3}
                          />
                          {rejectionValidationError && (
                            <p className="mt-1 text-xs text-rose-400 font-bold flex items-center gap-1">
                              <AlertCircle size={10} /> {rejectionValidationError}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleRejectTutor(selectedTutor.id)}
                          disabled={isProcessing || !rejectionReason.trim()}
                          className="w-full py-3 flex items-center justify-center gap-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-rose-400 active:scale-95"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle size={18} />
                              Reject Registration
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card flex flex-col items-center justify-center py-20 text-center border-dashed border-white/10"
                >
                  <div className="w-16 h-16 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 text-slate-600 ring-1 ring-white/5 shadow-inner">
                    <Users size={32} />
                  </div>
                  <h4 className="text-white font-bold mb-2">Select an application</h4>
                  <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
                    Click on a candidate row to review their details and credentials.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}
