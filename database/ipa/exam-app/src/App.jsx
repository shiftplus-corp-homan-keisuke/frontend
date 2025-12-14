import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ExamList from './components/ExamList';
import QuestionViewer from './components/QuestionViewer';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ExamList />} />
        <Route path="/exam/:examId" element={<QuestionViewer />} />
        <Route path="/exam/:examId/q/:questionId" element={<QuestionViewer />} />
      </Routes>
    </Layout>
  )
}

export default App
