import React from 'react';
import { Link } from 'react-router-dom';
import examsData from '../data/exams.json';

const ExamList = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">過去問解説データベース</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          データベーススペシャリスト試験の午後II問題を中心に、詳細な解説と図解で学習をサポートします。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examsData.map((exam) => (
          <Link 
            key={exam.id} 
            to={`/exam/${exam.id}`}
            className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {exam.year} {exam.term}
                </span>
                <span className="text-xs text-slate-400 font-medium">{exam.type}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {exam.title}
              </h3>
              <p className="text-sm text-slate-500">
                クリックして問題を選択してください。
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors">
              <span className="text-xs font-medium text-slate-500">詳細を見る</span>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExamList;
