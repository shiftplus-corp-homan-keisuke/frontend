import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">DBスペシャリスト図鑑</h1>
          </Link>
          <nav>
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              試験一覧
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} DB Specialist Exam App
        </div>
      </footer>
    </div>
  );
};

export default Layout;
