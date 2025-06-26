interface ResultDisplayProps {
  showResult: boolean;
  isCorrect: boolean;
}

export default function ResultDisplay({
  showResult,
  isCorrect,
}: ResultDisplayProps) {
  if (!showResult) return null;

  return (
    <div className="mb-6">
      <div
        className={`p-4 rounded-lg ${
          isCorrect
            ? "bg-green-100 border border-green-300"
            : "bg-red-100 border border-red-300"
        }`}
      >
        <p
          className={`font-semibold ${
            isCorrect ? "text-green-800" : "text-red-800"
          }`}
        >
          {isCorrect ? "🎉 正解です！" : "❌ 不正解です"}
        </p>
        <p
          className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}
        >
          {isCorrect
            ? "素晴らしい！正しいクラスが選択されています。"
            : "もう一度確認してみてください。左側の目標レイアウトと正解プレビューを比較してください。"}
        </p>
      </div>
    </div>
  );
}
