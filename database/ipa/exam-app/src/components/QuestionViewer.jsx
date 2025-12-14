import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, CheckCircle, HelpCircle } from 'lucide-react';
import exam2024r06a from '../data/2024r06a_db_pm2.json';

// TODO: In a real app, we would dynamic import or fetch based on ID
const examDataMap = {
  "2024r06a_db_pm2": exam2024r06a
};

const QuestionViewer = () => {
  const { examId, questionId } = useParams();
  const exam = examDataMap[examId];
  
  const [activeQuestionId, setActiveQuestionId] = useState(questionId || (exam?.questions[0]?.id));
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (questionId) {
      setActiveQuestionId(questionId);
    }
  }, [questionId]);

  if (!exam) {
    return <div className="p-8 text-center">Exam not found</div>;
  }

  const activeQuestion = exam.questions.find(q => q.id === activeQuestionId) || exam.questions[0];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Sidebar - Question Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-700">問題一覧</h3>
          </div>
          <nav className="p-2">
            {exam.questions.map(q => (
              <button
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  activeQuestionId === q.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {q.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeQuestion.title}</h2>
        <p className="text-slate-500 mb-8">{activeQuestion.description}</p>

        <div className="space-y-8">
          {activeQuestion.sections.length === 0 && (
            <div className="p-12 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
              <p>この問題の詳細データはまだありません。</p>
            </div>
          )}

          {activeQuestion.sections.map(section => (
            <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="font-bold text-slate-700">{section.title}</span>
                {expandedSections[section.id] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
              </button>
              
              {expandedSections[section.id] && (
                <div className="p-6 border-t border-slate-200">
                  <p className="mb-6 text-slate-600 leading-relaxed">{section.content}</p>
                  
                  {/* Image Placeholder */}
                  <div className="mb-8 aspect-video w-full bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-slate-200">
                    <span className="text-4xl mb-2">🖼️</span>
                    <span className="text-sm font-medium">問題画像エリア (PDF参照)</span>
                  </div>

                  {/* Sub Questions */}
                  <div className="space-y-6">
                    {section.subQuestions.map(subQ => (
                      <div key={subQ.id} className="bg-slate-50 rounded-lg p-5 border border-slate-200/60">
                         <div className="flex gap-3 items-start mb-3">
                           <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded mt-0.5">{subQ.label}</span>
                           <h4 className="font-medium text-slate-800">{subQ.text}</h4>
                         </div>
                         
                         <div className="mt-4 pt-4 border-t border-slate-200">
                            <details className="group">
                              <summary className="flex items-center gap-2 cursor-pointer list-none text-sm font-medium text-blue-600 hover:text-blue-700">
                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                解答と解説を表示
                              </summary>
                              <div className="mt-3 pl-4 border-l-2 border-blue-100">
                                <p className="font-bold text-slate-800 mb-2">正解: <span className="text-green-600">{subQ.answer}</span></p>
                                <p className="text-slate-600 text-sm leading-relaxed">{subQ.explanation}</p>
                              </div>
                            </details>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionViewer;
