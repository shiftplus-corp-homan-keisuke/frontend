import type { Question } from "../questions";

interface PreviewAreaProps {
  question: Question;
  selectedAnswers: { [key: string]: string[] };
  showResult: boolean;
}

// gap値とピクセル値の対応表
const gapPixelMap: { [key: string]: string } = {
  "gap-1": "4px",
  "gap-2": "8px",
  "gap-4": "16px",
  "gap-6": "24px",
  "gap-8": "32px",
};

// gap値を含むクラス配列からピクセル値を取得する関数
const getGapPixelValue = (classes: string[]): string | null => {
  const gapClass = classes.find((cls) => cls.startsWith("gap-"));
  return gapClass ? gapPixelMap[gapClass] || null : null;
};

export default function PreviewArea({
  question,
  selectedAnswers,
  showResult,
}: PreviewAreaProps) {
  if (!showResult) return null;

  // gap関連の問題かどうかを判定
  const isGapQuestion = question.id === 11 || question.id === 12;

  // 選択されたgap値とピクセル値を取得
  const selectedGapPixelValue = isGapQuestion
    ? getGapPixelValue(Object.values(selectedAnswers).flat())
    : null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-700 mb-3">プレビュー:</h3>

      {/* Gap値の情報表示 */}
      {isGapQuestion && (
        <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">選択中の間隔:</span>{" "}
            {selectedGapPixelValue ? `${selectedGapPixelValue}` : "未選択"}
            {selectedGapPixelValue && (
              <span className="text-xs text-gray-500 ml-2">
                (
                {selectedGapPixelValue === "16px"
                  ? "1rem"
                  : selectedGapPixelValue === "8px"
                  ? "0.5rem"
                  : selectedGapPixelValue === "4px"
                  ? "0.25rem"
                  : selectedGapPixelValue === "24px"
                  ? "1.5rem"
                  : selectedGapPixelValue === "32px"
                  ? "2rem"
                  : ""}
                )
              </span>
            )}
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        {/* 問題によって異なるプレビューを表示 */}
        {question.id === 3 ? (
          // ナビゲーションバーのプレビュー（あなたの選択）
          <div
            className={`h-20 bg-blue-100 rounded ${
              selectedAnswers[question.correctAnswers[0]?.selector]?.join(
                " "
              ) || ""
            }`}
          >
            <div className="bg-red-400 rounded px-4 py-2 text-white font-bold">
              Logo
            </div>
            <div
              className={`${
                selectedAnswers[question.correctAnswers[1]?.selector]?.join(
                  " "
                ) || ""
              }`}
            >
              <div className="bg-green-400 rounded px-3 py-1 text-white text-sm">
                Home
              </div>
              <div className="bg-yellow-400 rounded px-3 py-1 text-white text-sm">
                About
              </div>
              <div className="bg-purple-400 rounded px-3 py-1 text-white text-sm">
                Contact
              </div>
            </div>
          </div>
        ) : question.id >= 6 && question.id <= 9 ? (
          // flex-grow/shrink/basis問題のプレビュー（個別要素対応）
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${
              selectedAnswers[".container"]?.join(" ") || ""
            }`}
          >
            <div
              className={`h-auto min-h-16 bg-red-400 rounded m-2 p-4 flex items-center justify-center text-white font-bold ${
                selectedAnswers[".item-1"]?.join(" ") || ""
              }`}
            >
              {question.id === 9 ? "アイテム1" : "1"}
            </div>
            <div
              className={`h-auto min-h-16 bg-green-400 rounded m-2 p-4 flex items-center justify-center text-white font-bold ${
                selectedAnswers[".item-2"]?.join(" ") || ""
              }`}
            >
              {question.id === 9 ? "アイテム2" : "2"}
            </div>
            <div
              className={`h-auto min-h-16 bg-yellow-400 rounded m-2 p-4 flex items-center justify-center text-white font-bold ${
                selectedAnswers[".item-3"]?.join(" ") || ""
              }`}
            >
              {question.id === 9 ? "アイテム3" : "3"}
            </div>
          </div>
        ) : question.id === 10 ? (
          // flex-wrap問題のプレビュー
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${Object.values(
              selectedAnswers
            )
              .flat()
              .join(" ")}`}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="bg-blue-400 rounded p-3 flex items-center justify-center text-white font-bold min-w-[100px] m-1"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        ) : question.id === 11 ? (
          // gap問題のプレビュー
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${Object.values(
              selectedAnswers
            )
              .flat()
              .join(" ")}`}
          >
            <div className="bg-red-400 rounded p-4 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="bg-green-400 rounded p-4 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="bg-yellow-400 rounded p-4 flex items-center justify-center text-white font-bold">
              3
            </div>
          </div>
        ) : question.id === 12 ? (
          // カード配置問題のプレビュー
          <div
            className={`min-h-48 bg-blue-100 rounded p-4 ${Object.values(
              selectedAnswers
            )
              .flat()
              .join(" ")}`}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="bg-purple-400 rounded p-4 flex items-center justify-center text-white font-bold min-w-[120px] min-h-[80px]"
              >
                Card {i + 1}
              </div>
            ))}
          </div>
        ) : (
          // 基本問題のプレビュー
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${Object.values(
              selectedAnswers
            )
              .flat()
              .join(" ")}`}
          >
            <div className="bg-red-400 rounded p-4 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="bg-green-400 rounded p-4 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="bg-yellow-400 rounded p-4 flex items-center justify-center text-white font-bold">
              3
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        あなたの選択:{" "}
        {Object.values(selectedAnswers).flat().length > 0
          ? Object.values(selectedAnswers).flat().join(" ")
          : "なし"}
      </p>
      <div className="mt-4 border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
        <p className="text-sm text-green-700 mb-2">正解のプレビュー:</p>
        {/* 問題によって異なる正解プレビューを表示 */}
        {question.id === 3 ? (
          // ナビゲーションバーの正解プレビュー
          <div
            className={`h-20 bg-blue-100 rounded ${question.correctAnswers[0].classes.join(
              " "
            )}`}
          >
            <div className="bg-red-400 rounded px-4 py-2 text-white font-bold">
              Logo
            </div>
            <div className={`${question.correctAnswers[1].classes.join(" ")}`}>
              <div className="bg-green-400 rounded px-3 py-1 text-white text-sm">
                Home
              </div>
              <div className="bg-yellow-400 rounded px-3 py-1 text-white text-sm">
                About
              </div>
              <div className="bg-purple-400 rounded px-3 py-1 text-white text-sm">
                Contact
              </div>
            </div>
          </div>
        ) : question.id >= 6 && question.id <= 9 ? (
          // flex-grow/shrink/basis問題の正解プレビュー（個別要素対応）
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${
              question.correctAnswers
                .find((target) => target.selector === ".container")
                ?.classes.join(" ") || ""
            }`}
          >
            <div
              className={`h-auto min-h-16 bg-red-400 rounded m-2 p-4 flex items-center justify-center text-white font-bold ${
                question.correctAnswers
                  .find((target) => target.selector === ".item-1")
                  ?.classes.join(" ") || ""
              }`}
            >
              {question.id === 9 ? "アイテム1" : "1"}
            </div>
            <div
              className={`h-auto min-h-16 bg-green-400 rounded m-2 p-4 flex items-center justify-center text-white font-bold ${
                question.correctAnswers
                  .find((target) => target.selector === ".item-2")
                  ?.classes.join(" ") || ""
              }`}
            >
              {question.id === 9 ? "アイテム2" : "2"}
            </div>
            <div
              className={`h-auto min-h-16 bg-yellow-400 rounded m-2 p-4 flex items-center justify-center text-white font-bold ${
                question.correctAnswers
                  .find((target) => target.selector === ".item-3")
                  ?.classes.join(" ") || ""
              }`}
            >
              {question.id === 9 ? "アイテム3" : "3"}
            </div>
          </div>
        ) : question.id === 10 ? (
          // flex-wrap問題の正解プレビュー
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${question.correctAnswers[0].classes.join(
              " "
            )}`}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="bg-blue-400 rounded p-3 flex items-center justify-center text-white font-bold min-w-[100px] m-1"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        ) : question.id === 11 ? (
          // gap問題の正解プレビュー
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${question.correctAnswers[0].classes.join(
              " "
            )}`}
          >
            <div className="bg-red-400 rounded p-4 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="bg-green-400 rounded p-4 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="bg-yellow-400 rounded p-4 flex items-center justify-center text-white font-bold">
              3
            </div>
          </div>
        ) : question.id === 12 ? (
          // カード配置問題の正解プレビュー
          <div
            className={`min-h-48 bg-blue-100 rounded p-4 ${question.correctAnswers[0].classes.join(
              " "
            )}`}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={`bg-purple-400 rounded p-4 flex items-center justify-center text-white font-bold min-w-[120px] min-h-[80px] ${
                  question.correctAnswers
                    .find((target) => target.selector === ".card")
                    ?.classes.join(" ") || ""
                }`}
              >
                Card {i + 1}
              </div>
            ))}
          </div>
        ) : (
          // 基本問題の正解プレビュー
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${question.correctAnswers[0].classes.join(
              " "
            )}`}
          >
            <div className="bg-red-400 rounded p-4 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="bg-green-400 rounded p-4 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="bg-yellow-400 rounded p-4 flex items-center justify-center text-white font-bold">
              3
            </div>
          </div>
        )}
        <p className="text-sm text-green-600 mt-2">
          正解クラス:{" "}
          {question.correctAnswers.map((target, index) => {
            const gapPixelValue = getGapPixelValue(target.classes);
            return (
              <span
                key={index}
                className="font-mono bg-gray-100 px-2 py-1 rounded mr-2"
              >
                {target.name}: {target.classes.join(" ")}
                {gapPixelValue && (
                  <span className="text-xs text-blue-600 ml-1">
                    ({gapPixelValue})
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
