import React from "react";

interface GapMeasurementGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

// gap値とピクセル値の対応表
const gapValues = [
  { class: "gap-1", pixels: "4px", rem: "0.25rem" },
  { class: "gap-2", pixels: "8px", rem: "0.5rem" },
  { class: "gap-4", pixels: "16px", rem: "1rem" },
  { class: "gap-6", pixels: "24px", rem: "1.5rem" },
  { class: "gap-8", pixels: "32px", rem: "2rem" },
];

export default function GapMeasurementGuide({
  isVisible,
  onClose,
}: GapMeasurementGuideProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Gap値比較ガイド</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* 対応表 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Gap値とピクセル値の対応表
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Tailwindクラス
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      ピクセル値
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      rem値
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      使用例
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gapValues.map((gap) => (
                    <tr key={gap.class}>
                      <td className="border border-gray-300 px-4 py-2 font-mono bg-gray-50">
                        {gap.class}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        {gap.pixels}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        {gap.rem}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {gap.class === "gap-1" && "細かい間隔"}
                        {gap.class === "gap-2" && "小さい間隔"}
                        {gap.class === "gap-4" && "標準的な間隔"}
                        {gap.class === "gap-6" && "大きめの間隔"}
                        {gap.class === "gap-8" && "広い間隔"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 視覚的比較 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">視覚的比較</h3>
            <div className="space-y-4">
              {gapValues.map((gap) => (
                <div
                  key={gap.class}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">
                      {gap.class}
                    </span>
                    <span className="text-sm text-gray-600">
                      {gap.pixels} ({gap.rem})
                    </span>
                  </div>
                  <div className={`flex ${gap.class} bg-gray-100 p-2 rounded`}>
                    <div className="bg-red-400 rounded p-2 text-white text-sm font-bold flex items-center justify-center min-w-[60px]">
                      1
                    </div>
                    <div className="bg-green-400 rounded p-2 text-white text-sm font-bold flex items-center justify-center min-w-[60px]">
                      2
                    </div>
                    <div className="bg-yellow-400 rounded p-2 text-white text-sm font-bold flex items-center justify-center min-w-[60px]">
                      3
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 実際の使用例 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">実際の使用例</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">カードレイアウト (gap-4)</h4>
                <div className="flex flex-wrap gap-4 bg-gray-100 p-2 rounded">
                  <div className="bg-blue-400 rounded p-3 text-white text-sm min-w-[80px] text-center">
                    Card 1
                  </div>
                  <div className="bg-blue-400 rounded p-3 text-white text-sm min-w-[80px] text-center">
                    Card 2
                  </div>
                  <div className="bg-blue-400 rounded p-3 text-white text-sm min-w-[80px] text-center">
                    Card 3
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">ボタングループ (gap-2)</h4>
                <div className="flex gap-2 bg-gray-100 p-2 rounded">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    保存
                  </button>
                  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                    キャンセル
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                    削除
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 測定のヒント */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              測定のヒント
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • ブラウザの開発者ツールを使用して実際のピクセル値を確認できます
              </li>
              <li>• 16px = 1rem が基本単位です（ブラウザのデフォルト設定）</li>
              <li>• gap-4 (16px) は最も一般的に使用される間隔です</li>
              <li>
                • 小さな要素には gap-1 や gap-2、大きな要素には gap-6 や gap-8
                を使用します
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
