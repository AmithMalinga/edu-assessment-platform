import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Grades from './pages/Grades';
import Subjects from './pages/Subjects';
import Questions from './pages/Questions';
import AddQuestion from './pages/AddQuestion';
import EditQuestion from './pages/EditQuestion';
import Exams from './pages/Exams';
import ExamList from './pages/ExamList';
import ExamDetails from './pages/ExamDetails';
import Tutors from './pages/Tutors';
import Testimonials from './pages/Testimonials';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/add" element={<AddQuestion />} />
          <Route path="/questions/edit/:id" element={<EditQuestion />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/list" element={<ExamList />} />
          <Route path="/exams/:id" element={<ExamDetails />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/testimonials" element={<Testimonials />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          },
        }}
      />
    </Router>
  );
}

export default App;
