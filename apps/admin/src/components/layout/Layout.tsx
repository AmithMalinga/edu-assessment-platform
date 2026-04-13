import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  ClipboardList,
  LogOut,
  ChevronRight,
  Award
} from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');

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
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-white/5 flex flex-col h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            EA
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Edu Admin
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/50' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <link.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="flex-1 font-medium">{link.label}</span>
              <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {admin.name?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{admin.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-600/10 blur-[100px] -z-10 rounded-full" />

        <header className="px-8 py-6 flex items-center justify-between border-b border-white/5">
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          <div className="flex items-center gap-4">
            {/* Header extras */}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
