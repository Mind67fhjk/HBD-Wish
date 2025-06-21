import React, { useState, useEffect } from 'react';
import { Brain, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase, QuizQuestion } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface QuizManagerProps {
  celebrationId: string;
}

export default function QuizManager({ celebrationId }: QuizManagerProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0
  });

  useEffect(() => {
    fetchQuestions();
  }, [celebrationId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('celebration_id', celebrationId)
        .order('order_index');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0
    });
    setEditingQuestion(null);
    setShowAddForm(false);
  };

  const handleEdit = (question: QuizQuestion) => {
    setFormData({
      question: question.question,
      options: question.options,
      correct_answer: question.correct_answer
    });
    setEditingQuestion(question);
    setShowAddForm(false);
  };

  const handleSave = async () => {
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('quiz_questions')
          .update({
            question: formData.question,
            options: formData.options,
            correct_answer: formData.correct_answer
          })
          .eq('id', editingQuestion.id);

        if (error) throw error;
        toast.success('Question updated successfully');
      } else {
        // Add new question
        const { error } = await supabase
          .from('quiz_questions')
          .insert({
            celebration_id: celebrationId,
            question: formData.question,
            options: formData.options,
            correct_answer: formData.correct_answer,
            order_index: questions.length
          });

        if (error) throw error;
        toast.success('Question added successfully');
      }

      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading quiz questions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Quiz Manager</h2>
            <p className="text-white/60">Manage your birthday quiz questions</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Question
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingQuestion) && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Question
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter your question"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Answer Options
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={formData.correct_answer === index}
                      onChange={() => setFormData({ ...formData, correct_answer: index })}
                      className="w-5 h-5 text-yellow-400 bg-white/10 border-white/20 focus:ring-yellow-400/20"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm mt-2">
                Select the radio button next to the correct answer
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSave} className="btn-primary">
                <Save size={20} />
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
              <button onClick={resetForm} className="btn-secondary">
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Current Questions ({questions.length})</h3>
        
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <Brain size={64} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No quiz questions yet</p>
            <p className="text-white/40 text-sm mt-2">Add your first question to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-lg mb-2">
                      {index + 1}. {question.question}
                    </h4>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            optIndex === question.correct_answer
                              ? 'bg-green-500/20 border border-green-400/30 text-green-300'
                              : 'bg-white/5 text-white/70'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{option}</span>
                          {optIndex === question.correct_answer && (
                            <span className="ml-auto text-green-400 text-sm font-medium">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}