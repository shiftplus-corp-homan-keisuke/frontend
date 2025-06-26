interface HeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
}

export default function Header({
  currentQuestionIndex,
  totalQuestions,
  score,
}: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Tailwind CSS Flex トレーニング
      </h1>
      <p className="text-gray-600">
        問題 {currentQuestionIndex + 1} / {totalQuestions} | スコア: {score} /{" "}
        {totalQuestions}
      </p>
    </div>
  );
}
