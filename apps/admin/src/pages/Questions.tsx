import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import './Questions.css';

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const [newQuestion, setNewQuestion] = useState({
    content: '',
    type: 'MCQ',
    lesson: 'General',
    choices: ['', '', '', ''],
    correctAnswer: '',
    subjectId: '',
    gradeId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [questionsRes, subjectsRes, gradesRes] = await Promise.all([
        api.get('/questions'),
        api.get('/subjects'),
        api.get('/subjects/grades')
      ]);
      setQuestions(questionsRes.data);
      setSubjects(subjectsRes.data);
      setGrades(gradesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate choices if MCQ
      if (newQuestion.type === 'MCQ') {
        const validChoices = newQuestion.choices.filter(c => c.trim() !== '');
        if (validChoices.length < 2) throw new Error('At least 2 choices required');
        if (!newQuestion.correctAnswer) throw new Error('Correct answer is required');
      }

      await api.post('/questions/admin', {
        ...newQuestion,
        gradeId: parseInt(newQuestion.gradeId),
        choices: newQuestion.type === 'MCQ' ? newQuestion.choices.filter(c => c.trim() !== '') : []
      });
      
      setIsModalOpen(false);
      setNewQuestion({
        content: '',
        type: 'MCQ',
        lesson: 'General',
        choices: ['', '', '', ''],
        correctAnswer: '',
        subjectId: '',
        gradeId: ''
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  return (
    <Layout title="Questions Bank">
      <div className="page-header-actions">
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Question
        </button>
      </div>

      <div className="questions-list">
        {loading ? (
          <div className="text-center p-20">Loading Questions...</div>
        ) : questions.length > 0 ? (
          questions.map((q, idx) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="question-item glass"
            >
              <div className="question-content">
                <div className="question-meta">
                  <span className="badge type">{q.type}</span>
                  <span className="badge lesson">{q.lesson}</span>
                  <span className="badge subject">{q.subject?.name || 'No Subject'}</span>
                </div>
                <p className="question-text">{q.content}</p>
                {q.type === 'MCQ' && (
                  <div className="question-choices">
                    {q.choices.map((choice: string, i: number) => (
                      <div key={i} className={`choice ${choice === q.correctAnswer ? 'correct' : ''}`}>
                        {choice === q.correctAnswer && <CheckCircle2 size={12} />}
                        {choice}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="question-actions">
                <button className="icon-btn edit"><Edit2 size={16} /></button>
                <button className="icon-btn delete" onClick={() => handleDelete(q.id)}><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-state">No questions found in the bank.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="modal-content glass wide-modal"
          >
            <h3>Add New Question</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Question Content</label>
                  <textarea 
                    value={newQuestion.content} 
                    onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                    placeholder="Enter the question here..." 
                    required
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={newQuestion.type} 
                    onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="STRUCTURED">STRUCTURED</option>
                    <option value="ESSAY">ESSAY</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lesson / Category</label>
                  <input 
                    type="text" 
                    value={newQuestion.lesson} 
                    onChange={(e) => setNewQuestion({...newQuestion, lesson: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Grade</label>
                  <select 
                    value={newQuestion.gradeId} 
                    onChange={(e) => setNewQuestion({...newQuestion, gradeId: e.target.value})}
                    required
                  >
                    <option value="">Select Grade</option>
                    {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    value={newQuestion.subjectId} 
                    onChange={(e) => setNewQuestion({...newQuestion, subjectId: e.target.value})}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.filter(s => s.gradeId === parseInt(newQuestion.gradeId)).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newQuestion.type === 'MCQ' && (
                <div className="mcq-section">
                  <label>Choices & Correct Answer</label>
                  <div className="choices-grid">
                    {newQuestion.choices.map((choice, i) => (
                      <div key={i} className="choice-input">
                        <input 
                          type="text" 
                          value={choice} 
                          onChange={(e) => {
                            const newChoices = [...newQuestion.choices];
                            newChoices[i] = e.target.value;
                            setNewQuestion({...newQuestion, choices: newChoices});
                          }}
                          placeholder={`Option ${i+1}`}
                        />
                        <button 
                          type="button"
                          className={`correct-toggle ${newQuestion.correctAnswer === choice && choice !== '' ? 'active' : ''}`}
                          onClick={() => setNewQuestion({...newQuestion, correctAnswer: choice})}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="form-error"><AlertCircle size={14} /> {error}</p>}
              
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn">Save Question</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Questions;
