import { useState } from "react";
import "./App.css";

interface Question {
  id: number;
  question: string;
  description: string;
  correctAnswers: string[];
  allOptions: string[];
  htmlStructure: string;
  targetElement: string;
}

const flexQuestions: Question[] = [
  {
    id: 1,
    question: "flex-itemをセンター寄せで配置してください",
    description: "横方向、縦方向ともに中央に配置する",
    correctAnswers: ["flex", "justify-center", "items-center"],
    allOptions: [
      "flex",
      "justify-center",
      "items-center",
      "justify-start",
      "items-start",
      "justify-end",
      "items-end",
      "justify-between",
      "items-stretch",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    targetElement: "container（親要素）",
  },
  {
    id: 2,
    question: "flex-itemを横方向に均等分散で配置してください",
    description: "アイテム間に等しい間隔を空けて配置する",
    correctAnswers: ["flex", "justify-between"],
    allOptions: [
      "flex",
      "justify-between",
      "justify-around",
      "justify-evenly",
      "justify-center",
      "justify-start",
      "justify-end",
      "space-x-4",
      "gap-4",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    targetElement: "container（親要素）",
  },
  {
    id: 3,
    question: "flex-itemを縦に並べて配置してください",
    description: "縦方向（列）にアイテムを配置する",
    correctAnswers: ["flex", "flex-col"],
    allOptions: [
      "flex",
      "flex-col",
      "flex-row",
      "flex-wrap",
      "flex-nowrap",
      "items-center",
      "justify-center",
      "block",
      "inline-flex",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    targetElement: "container（親要素）",
  },
  {
    id: 4,
    question: "flex-itemを右端に寄せて配置してください",
    description: "横方向の終端（右側）にアイテムを配置する",
    correctAnswers: ["flex", "justify-end"],
    allOptions: [
      "flex",
      "justify-end",
      "justify-start",
      "justify-center",
      "items-end",
      "items-start",
      "ml-auto",
      "text-right",
      "float-right",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    targetElement: "container（親要素）",
  },
  {
    id: 5,
    question: "flex-itemを縦に伸ばして配置してください",
    description: "コンテナの高さに合わせてアイテムを伸ばす",
    correctAnswers: ["flex", "items-stretch"],
    allOptions: [
      "flex",
      "items-stretch",
      "items-center",
      "items-start",
      "items-end",
      "h-full",
      "min-h-full",
      "stretch",
      "grow",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    targetElement: "container（親要素）",
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = flexQuestions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (showResult) return;

    setSelectedAnswers((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = () => {
    const correct =
      currentQuestion.correctAnswers.length === selectedAnswers.length &&
      currentQuestion.correctAnswers.every((answer) =>
        selectedAnswers.includes(answer)
      );

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < flexQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  const isLastQuestion = currentQuestionIndex === flexQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Tailwind CSS Flex トレーニング
          </h1>
          <p className="text-gray-600">
            問題 {currentQuestionIndex + 1} / {flexQuestions.length} | スコア:{" "}
            {score} / {flexQuestions.length}
          </p>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {currentQuestion.question}
          </h2>
          <p className="text-gray-600 mb-4">{currentQuestion.description}</p>

          {/* 目標レイアウト表示エリア */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              🎯 目標レイアウト:
            </h3>
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50">
              <div
                className={`h-32 bg-blue-100 rounded ${currentQuestion.correctAnswers.join(
                  " "
                )}`}
              >
                <div className="w-16 h-16 bg-red-400 rounded m-2 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="w-16 h-16 bg-green-400 rounded m-2 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="w-16 h-16 bg-yellow-400 rounded m-2 flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
            </div>
            <p className="text-sm text-amber-700 mt-2">
              💡 この配置を実現するためのTailwind CSSクラスを選択してください
            </p>
          </div>

          {/* HTML構造と対象要素の説明 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              📋 HTML構造と対象要素:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* HTML構造 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-700 mb-2">HTML構造:</h4>
                <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                  <code>{currentQuestion.htmlStructure}</code>
                </pre>
              </div>

              {/* 対象要素 */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium text-blue-700 mb-2">
                  クラスを適用する要素:
                </h4>
                <div className="bg-white p-3 rounded border">
                  <span className="text-blue-800 font-mono text-sm">
                    .{currentQuestion.targetElement}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  ↑ この要素にTailwind CSSクラスを適用します
                </p>
              </div>
            </div>
          </div>

          {/* デモエリア（回答後のみ表示） */}
          {showResult && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                プレビュー:
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div
                  className={`h-32 bg-blue-100 rounded ${selectedAnswers.join(
                    " "
                  )}`}
                >
                  <div className="w-16 h-16 bg-red-400 rounded m-2">1</div>
                  <div className="w-16 h-16 bg-green-400 rounded m-2">2</div>
                  <div className="w-16 h-16 bg-yellow-400 rounded m-2">3</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                あなたの選択:{" "}
                {selectedAnswers.length > 0
                  ? selectedAnswers.join(" ")
                  : "なし"}
              </p>
              <div className="mt-4 border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                <p className="text-sm text-green-700 mb-2">正解のプレビュー:</p>
                <div
                  className={`h-32 bg-blue-100 rounded ${currentQuestion.correctAnswers.join(
                    " "
                  )}`}
                >
                  <div className="w-16 h-16 bg-red-400 rounded m-2">1</div>
                  <div className="w-16 h-16 bg-green-400 rounded m-2">2</div>
                  <div className="w-16 h-16 bg-yellow-400 rounded m-2">3</div>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  正解クラス: {currentQuestion.correctAnswers.join(" ")}
                </p>
              </div>
            </div>
          )}

          {/* 選択肢 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              <span className="text-blue-600">
                .{currentQuestion.targetElement}
              </span>{" "}
              に適用するTailwind CSSクラスを選択してください:
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {currentQuestion.allOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={showResult}
                  className={`p-3 rounded-lg border-2 transition-all font-mono text-sm ${
                    selectedAnswers.includes(option)
                      ? showResult
                        ? currentQuestion.correctAnswers.includes(option)
                          ? "bg-green-100 border-green-500 text-green-800"
                          : "bg-red-100 border-red-500 text-red-800"
                        : "bg-blue-100 border-blue-500 text-blue-800"
                      : showResult &&
                        currentQuestion.correctAnswers.includes(option)
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 結果表示 */}
          {showResult && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center mb-2">
                <span
                  className={`text-2xl mr-2 ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </span>
                <span
                  className={`font-semibold ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect ? "正解です！" : "不正解です"}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                正解:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {currentQuestion.correctAnswers.join(" ")}
                </span>
              </p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex justify-between">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswers.length === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedAnswers.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                回答する
              </button>
            ) : (
              <div className="flex gap-4">
                {!isLastQuestion ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
                  >
                    次の問題
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      🎉 お疲れ様でした！
                    </p>
                    <p className="text-gray-600 mb-4">
                      最終スコア: {score} / {flexQuestions.length}(
                      {Math.round((score / flexQuestions.length) * 100)}%)
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                    >
                      最初からやり直す
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
