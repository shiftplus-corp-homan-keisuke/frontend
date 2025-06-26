import type { Question } from "../questions";

interface HtmlStructureInfoProps {
  question: Question;
}

export default function HtmlStructureInfo({
  question,
}: HtmlStructureInfoProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        📋 HTML構造と対象要素:
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* HTML構造 */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-gray-700 mb-2">HTML構造:</h4>
          <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
            <code>{question.htmlStructure}</code>
          </pre>
        </div>

        {/* 対象要素 */}
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-blue-700 mb-2">
            クラスを適用する要素:
          </h4>
          <div className="space-y-2">
            {question.correctAnswers.map((target, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <span className="text-blue-800 font-mono text-sm">
                  {target.selector} - {target.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            ↑ これらの要素にTailwind CSSクラスを適用します
          </p>
        </div>
      </div>
    </div>
  );
}
