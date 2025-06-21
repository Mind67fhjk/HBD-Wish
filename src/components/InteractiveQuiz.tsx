import React, { useState, useEffect } from 'react';
import { Brain, Trophy, RotateCcw } from 'lucide-react';
import { supabase, QuizQuestion, QuizResponse } from '../lib/supabase';
import toast from 'react-hot-toast';

interface InteractiveQuizProps {
  celebrationId: string;
}

export default function InteractiveQuiz({ celebrationId }: InteractiveQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

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
      console.error('Error fetching quiz questions:', error);
      toast.error('Failed to load quiz questions');
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      const newAnswers = [...userAnswers, answerIndex];
      setUserAnswers(newAnswers);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        completeQuiz(newAnswers);
      }
    }, 1000);
  };

  const completeQuiz = async (answers: number[]) => {
    let finalScore = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        finalScore++;
      }
    });

    setScore(finalScore);
    setQuizCompleted(true);
    setLoading(true);

    try {
      const { error } = await supabase
        .from('quiz_responses')
        .insert({
          celebration_id: celebrationId,
          responses: answers,
          score: finalScore,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving quiz response:', error);
      toast.error('Failed to save quiz results');
    } finally {
      setLoading(false);
    }
  };

  const getScoreMessage = () => {
    const percentage = Math.round((score / questions.length) * 100);
    
    if (percentage >= 80) {
      return `Excellent! You scored ${score}/${questions.length} (${percentage}%). You know them very well! 🌟`;
    } else if (percentage >= 60) {
      return `Good job! You scored ${score}/${questions.length} (${percentage}%). You're a great friend! 🎉`;
    } else {
      return `You scored ${score}/${questions.length} (${percentage}%). There's always more to learn about each other! 💫`;
    }
  };

  if (questions.length === 0) {
    return (
      <div className="glass-card p-8 mb-8">
        <h2 className="font-playfair text-3xl text-yellow-400 text-center mb-8">Birthday Quiz</h2>
        <div className="text-center text-white/60">
          <Brain size={64} className="mx-auto mb-4 opacity-40" />
          <p>No quiz questions available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="font-playfair text-3xl text-yellow-400 text-center mb-8">Birthday Quiz</h2>
      
      <div className="max-w-2xl mx-auto text-center">
        {!quizStarted ? (
          <div>
            <div className="mb-8">
              <Brain size={64} className="mx-auto mb-4 text-yellow-400" />
              <p className="text-white/80 text-lg mb-6">
                How well do you know the birthday person? Test your knowledge with this fun quiz!
              </p>
              <p className="text-white/60 text-sm">
                {questions.length} questions • Multiple choice
              </p>
            </div>
            
            <button onClick={startQuiz} className="btn-primary">
              <Brain size={20} />
              Start Quiz
            </button>
          </div>
        ) : quizCompleted ? (
          <div>
            <div className="mb-8">
              <Trophy size={64} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-semibold text-white mb-4">Quiz Complete!</h3>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
                <p className="text-white/90 text-lg">{getScoreMessage()}</p>
              </div>
            </div>
            
            <button onClick={startQuiz} className="btn-primary">
              <RotateCcw size={20} />
              Take Quiz Again
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <div className="mb-4">
                <div className="bg-white/10 rounded-full h-2 mb-4">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-8 leading-relaxed">
                {questions[currentQuestionIndex]?.question}
              </h3>
            </div>
            
            <div className="space-y-4">
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedAnswer === index
                      ? index === questions[currentQuestionIndex].correct_answer
                        ? 'bg-green-500/20 border-green-400 text-green-300'
                        : 'bg-red-500/20 border-red-400 text-red-300'
                      : selectedAnswer !== null && index === questions[currentQuestionIndex].correct_answer
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-yellow-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}