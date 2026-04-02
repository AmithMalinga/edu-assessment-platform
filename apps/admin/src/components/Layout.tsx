import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import './Layout.css';

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

  return (
    <div className="admin-layout">
      <aside className="sidebar glass">
        <div className="sidebar-logo">
          <div className="logo-icon">EA</div>
          <span>Edu Admin</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            <ChevronRight size={14} className="arrow" />
          </NavLink>
          
          <NavLink to="/students" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={20} />
            <span>Students</span>
            <ChevronRight size={14} className="arrow" />
          </NavLink>

          <NavLink to="/grades" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <GraduationCap size={20} />
            <span>Grades</span>
            <ChevronRight size={14} className="arrow" />
          </NavLink>

          <NavLink to="/subjects" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BookOpen size={20} />
            <span>Subjects</span>
            <ChevronRight size={14} className="arrow" />
          </NavLink>

          <NavLink to="/questions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <HelpCircle size={20} />
            <span>Questions</span>
            <ChevronRight size={14} className="arrow" />
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{admin.name?.[0] || 'A'}</div>
            <div className="user-details">
              <p className="user-name">{admin.name || 'Admin'}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>{title}</h1>
          <div className="header-actions">
            {/* Global actions could go here */}
          </div>
        </header>
        <section className="scroll-area">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
