import type { Question } from "../questions";

interface ElementSelectorProps {
  question: Question;
  currentSelectedElement: string;
  selectedAnswers: { [key: string]: string[] };
  showResult: boolean;
  onElementSelect: (elementSelector: string) => void;
}

export default function ElementSelector({
  question,
  currentSelectedElement,
  selectedAnswers,
  showResult,
  onElementSelect,
}: ElementSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        ステップ1: クラスを適用する要素を選択してください
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {question.correctAnswers.map((target) => (
          <button
            key={target.selector}
            onClick={() => onElementSelect(target.selector)}
            disabled={showResult}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              currentSelectedElement === target.selector
                ? "bg-blue-100 border-blue-500 text-blue-800"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
            } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="font-medium">{target.name}</div>
            <div className="text-sm text-gray-500 font-mono">
              {target.selector}
            </div>
            {selectedAnswers[target.selector] &&
              selectedAnswers[target.selector].length > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  選択済み: {selectedAnswers[target.selector].join(", ")}
                </div>
              )}
          </button>
        ))}
      </div>
    </div>
  );
}
