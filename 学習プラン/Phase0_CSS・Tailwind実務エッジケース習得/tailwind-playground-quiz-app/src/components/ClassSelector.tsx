import type { Question } from "../questions";

interface ClassSelectorProps {
  question: Question;
  currentSelectedElement: string;
  selectedAnswers: { [key: string]: string[] };
  showResult: boolean;
  onClassSelect: (option: string) => void;
}

export default function ClassSelector({
  question,
  currentSelectedElement,
  selectedAnswers,
  showResult,
  onClassSelect,
}: ClassSelectorProps) {
  if (!currentSelectedElement) return null;

  const selectedElementName = question.correctAnswers.find(
    (t) => t.selector === currentSelectedElement
  )?.name;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        ステップ2:
        <span className="text-blue-600">{selectedElementName}</span>
        にクラスを追加してください
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {question.allOptions.map((option) => (
          <button
            key={option}
            onClick={() => onClassSelect(option)}
            disabled={showResult}
            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
              selectedAnswers[currentSelectedElement]?.includes(option)
                ? "bg-green-100 border-green-500 text-green-800"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
            } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
