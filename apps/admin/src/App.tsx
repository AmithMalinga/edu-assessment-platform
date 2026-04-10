import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Grades from './pages/Grades';
import Subjects from './pages/Subjects';
import Questions from './pages/Questions';
import Exams from './pages/Exams';
import ExamList from './pages/ExamList';
import ProtectedRoute from './components/common/ProtectedRoute';
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
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/list" element={<ExamList />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
