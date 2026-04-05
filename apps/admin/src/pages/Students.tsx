import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useStudents } from '../hooks/useStudents';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Search, GraduationCap } from 'lucide-react';

const Students: React.FC = () => {
  const { students, loading, error } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Students Management">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <p className="text-slate-400 text-sm">View and manage all registered students on the platform.</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
          />
        </div>
      </div>

      {error ? (
        <div className="glass-card border-red-500/20 p-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-48 animate-pulse bg-white/5 border-white/5" />
            ))
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => (
              <motion.div 
                key={student.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                    <User size={28} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{student.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <GraduationCap size={14} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-400">{student.educationalLevel || 'Not set'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors px-1">
                    <Mail size={14} className="text-indigo-400" />
                    <span className="text-sm truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors px-1">
                    <Phone size={14} className="text-emerald-400" />
                    <span className="text-sm">{student.phone || 'No phone'}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-slate-500">
                    <Calendar size={12} />
                    <span>Member since {new Date(student.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
              <p className="text-slate-500 font-medium italic">No students found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Students;
