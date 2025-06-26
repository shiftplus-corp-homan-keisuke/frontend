interface FinalResultProps {
  isLastQuestion: boolean;
  showResult: boolean;
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function FinalResult({
  isLastQuestion,
  showResult,
  score,
  totalQuestions,
  onReset,
}: FinalResultProps) {
  if (!isLastQuestion || !showResult) return null;

  const getScoreMessage = () => {
    if (score === totalQuestions) {
      return "完璧です！Tailwind CSS Flexboxをマスターしました！";
    } else if (score >= totalQuestions * 0.8) {
      return "すばらしい！ほぼ完璧な理解度です！";
    } else if (score >= totalQuestions * 0.6) {
      return "良いスコアです！さらに練習して完璧を目指しましょう！";
    } else {
      return "もう一度チャレンジして、Flexboxの理解を深めましょう！";
    }
  };

  const getScoreColor = () => {
    if (score === totalQuestions) return "text-green-600";
    if (score >= totalQuestions * 0.8) return "text-blue-600";
    if (score >= totalQuestions * 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        🎊 トレーニング完了！
      </h2>
      <p className="text-xl text-gray-600 mb-4">
        最終スコア: {score} / {totalQuestions}
      </p>
      <div className="mb-6">
        <p className={`font-semibold ${getScoreColor()}`}>
          {getScoreMessage()}
        </p>
      </div>
      <button
        onClick={onReset}
        className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-all"
      >
        もう一度挑戦する
      </button>
    </div>
  );
}
