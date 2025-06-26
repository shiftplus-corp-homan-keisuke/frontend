import type { Question } from "../questions";

interface ActionButtonsProps {
  question: Question;
  selectedAnswers: { [key: string]: string[] };
  showResult: boolean;
  isCorrect: boolean;
  isLastQuestion: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onReset: () => void;
  onRetry: () => void;
}

export default function ActionButtons({
  question,
  selectedAnswers,
  showResult,
  isCorrect,
  isLastQuestion,
  onSubmit,
  onNext,
  onReset,
  onRetry,
}: ActionButtonsProps) {
  // 全ての要素にクラスが選択されているかチェック
  const allElementsHaveSelections = question.correctAnswers.every(
    (target) =>
      selectedAnswers[target.selector] &&
      selectedAnswers[target.selector].length > 0
  );

  return (
    <div className="flex gap-3 flex-wrap">
      {!showResult ? (
        <button
          onClick={onSubmit}
          disabled={!allElementsHaveSelections}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            allElementsHaveSelections
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          回答する
        </button>
      ) : (
        <>
          {/* 間違った場合のやり直しボタン */}
          {!isCorrect && (
            <button
              onClick={onRetry}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-all"
            >
              この問題をやり直す
            </button>
          )}

          {/* 次の問題へボタン（正解時または間違い時のどちらでも表示） */}
          {!isLastQuestion && (
            <button
              onClick={onNext}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              次の問題へ
            </button>
          )}

          {/* 最初からやり直すボタン */}
          <button
            onClick={onReset}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all"
          >
            最初からやり直す
          </button>
        </>
      )}
    </div>
  );
}
