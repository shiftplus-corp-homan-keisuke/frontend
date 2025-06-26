import type { Question } from "../questions";
import { useState } from "react";
import GapMeasurementGuide from "./GapMeasurementGuide";

interface TargetLayoutProps {
  question: Question;
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

export default function TargetLayout({ question }: TargetLayoutProps) {
  const [showGapGuide, setShowGapGuide] = useState(false);
  // gap関連の問題かどうかを判定
  const isGapQuestion = question.id === 11 || question.id === 12;

  // 正解のgap値とピクセル値を取得
  const correctGapPixelValue = isGapQuestion
    ? getGapPixelValue(question.correctAnswers[0]?.classes || [])
    : null;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-700">
          🎯 目標レイアウト:
        </h3>
        {isGapQuestion && (
          <button
            onClick={() => setShowGapGuide(true)}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            📏 Gap値ガイド
          </button>
        )}
      </div>

      {/* Gap値の情報表示 */}
      {isGapQuestion && correctGapPixelValue && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">目標の間隔:</span>{" "}
            {correctGapPixelValue} (1rem)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            💡 アイテム間の間隔に注目してください
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50">
        {/* 問題によって異なるレイアウトを表示 */}
        {question.id === 3 ? (
          // ナビゲーションバーの目標レイアウト
          <div
            className={`h-20 bg-blue-100 rounded ${
              question.correctAnswers[0]?.classes.join(" ") || ""
            }`}
          >
            <div className="bg-red-400 rounded px-4 py-2 text-white font-bold">
              Logo
            </div>
            <div
              className={`${
                question.correctAnswers[1]?.classes.join(" ") || ""
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
          // flex-grow/shrink/basis問題の目標レイアウト
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
          // flex-wrap問題の目標レイアウト
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${
              question.correctAnswers[0]?.classes.join(" ") || ""
            }`}
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
          // gap問題の目標レイアウト（視覚的ガイド付き）
          <div className="relative">
            <div
              className={`min-h-32 bg-blue-100 rounded p-4 ${
                question.correctAnswers[0]?.classes.join(" ") || ""
              }`}
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
            {/* 間隔の視覚的ガイド */}
            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 text-xs text-gray-600 bg-white px-1 rounded border">
              16px
            </div>
            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 text-xs text-gray-600 bg-white px-1 rounded border">
              16px
            </div>
          </div>
        ) : question.id === 12 ? (
          // カード配置問題の目標レイアウト
          <div
            className={`min-h-48 bg-blue-100 rounded p-4 ${
              question.correctAnswers[0]?.classes.join(" ") || ""
            }`}
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
          // 基本問題の目標レイアウト
          <div
            className={`min-h-32 bg-blue-100 rounded p-4 ${
              question.correctAnswers[0]?.classes.join(" ") || ""
            }`}
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
      <p className="text-sm text-amber-700 mt-2">
        💡 この配置を実現するためのTailwind CSSクラスを選択してください
      </p>

      {/* Gap測定ガイドモーダル */}
      <GapMeasurementGuide
        isVisible={showGapGuide}
        onClose={() => setShowGapGuide(false)}
      />
    </div>
  );
}
