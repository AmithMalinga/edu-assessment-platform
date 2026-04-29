import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  ClipboardList,
  LogOut,
  ChevronRight,
  Award,
  MessageSquare,
  User,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/grades', label: 'Grades', icon: GraduationCap },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/questions', label: 'Questions', icon: HelpCircle },
    { to: '/exams', label: 'Exams', icon: ClipboardList },
    { to: '/tutors', label: 'Tutor Requests', icon: Award },
    { to: '/testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-white/5 flex flex-col h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            EA
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Edu Admin
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Management</p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'text-indigo-400 bg-indigo-500/5' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                    />
                  )}
                  <link.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-indigo-400' : ''}`} />
                  <span className="flex-1 font-semibold text-sm">{link.label}</span>
                  <ChevronRight size={14} className={`opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? 'text-indigo-400' : ''}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/10">
            <p className="text-xs font-bold text-indigo-300 mb-1">Need help?</p>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Check our system documentation or contact support.</p>
            <NavLink 
              to="/documentation"
              className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center"
            >
              Documentation
            </NavLink>
          </div>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-600/10 blur-[100px] -z-10 rounded-full" />

        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-slate-950/50 z-10">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            {/* <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 group focus-within:border-indigo-500/50 transition-all">
              <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-48"
              />
            </div> */}
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950" />
            </button>
            
            <div className="h-8 w-[1px] bg-white/5" />

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/5 group-hover:ring-indigo-500/30 transition-all">
                  {admin.name?.[0] || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{admin.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wide">Administrator</p>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] py-2"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{admin.email || 'admin@edu.com'}</p>
                    </div>
                    
                    <button 
                      onClick={() => { navigate('/exams/list'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      <ClipboardList size={16} className="text-amber-400" />
                      View Existing Exams
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                      <User size={16} className="text-indigo-400" />
                      Account Settings
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                      <Settings size={16} className="text-slate-500" />
                      Platform Config
                    </button>
                    
                    <div className="h-[1px] bg-white/5 my-2" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
