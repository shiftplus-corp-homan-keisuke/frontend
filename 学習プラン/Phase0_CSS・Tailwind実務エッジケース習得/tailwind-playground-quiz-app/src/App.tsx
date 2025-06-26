import { useState } from "react";
import React from "react";
import "./App.css";
import { flexQuestions } from "./questions";
import {
  Header,
  TargetLayout,
  HtmlStructureInfo,
  ElementSelector,
  ClassSelector,
  PreviewArea,
  ResultDisplay,
  ActionButtons,
  FinalResult,
} from "./components";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string[];
  }>({});
  const [currentSelectedElement, setCurrentSelectedElement] =
    useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = flexQuestions[currentQuestionIndex];

  // 初期化：最初の要素を選択
  React.useEffect(() => {
    if (currentQuestion.correctAnswers.length > 0) {
      setCurrentSelectedElement(currentQuestion.correctAnswers[0].selector);
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleElementSelect = (elementSelector: string) => {
    if (showResult) return;
    setCurrentSelectedElement(elementSelector);
  };

  const handleClassSelect = (option: string) => {
    if (showResult || !currentSelectedElement) return;

    setSelectedAnswers((prev) => {
      const currentSelections = prev[currentSelectedElement] || [];
      if (currentSelections.includes(option)) {
        return {
          ...prev,
          [currentSelectedElement]: currentSelections.filter(
            (item) => item !== option
          ),
        };
      } else {
        return {
          ...prev,
          [currentSelectedElement]: [...currentSelections, option],
        };
      }
    });
  };

  const handleSubmit = () => {
    let correct = true;

    // 全ての要素にクラスが選択されているかチェック
    for (const targetElement of currentQuestion.correctAnswers) {
      const selectedClasses = selectedAnswers[targetElement.selector] || [];
      const expectedClasses = targetElement.classes;

      // メインの正解パターンをチェック
      const isMainPatternCorrect =
        expectedClasses.length === selectedClasses.length &&
        expectedClasses.every((cls) => selectedClasses.includes(cls));

      // 代替パターンがあればそれもチェック
      let isAlternativePatternCorrect = false;
      if (targetElement.alternativeClasses) {
        isAlternativePatternCorrect = targetElement.alternativeClasses.some(
          (altClasses) =>
            altClasses.length === selectedClasses.length &&
            altClasses.every((cls) => selectedClasses.includes(cls))
        );
      }

      // メインパターンまたは代替パターンのいずれかが正解であればOK
      if (!isMainPatternCorrect && !isAlternativePatternCorrect) {
        correct = false;
        break;
      }
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < flexQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers({});
      setCurrentSelectedElement("");
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setCurrentSelectedElement("");
    setShowResult(false);
    setScore(0);
  };

  const handleRetryCurrentQuestion = () => {
    setSelectedAnswers({});
    setCurrentSelectedElement("");
    setShowResult(false);
    // 最初の要素を再選択
    if (currentQuestion.correctAnswers.length > 0) {
      setCurrentSelectedElement(currentQuestion.correctAnswers[0].selector);
    }
  };

  const isLastQuestion = currentQuestionIndex === flexQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full mx-auto">
        {/* ヘッダー */}
        <Header
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={flexQuestions.length}
          score={score}
        />

        {/* 問題タイトルカード */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {currentQuestion.question}
          </h2>
          <p className="text-gray-600">{currentQuestion.description}</p>
        </div>

        {/* 2カラムレイアウト */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左カラム: 問題タイトル、目標レイアウト、プレビュー */}
          <div className="space-y-6">
            {/* 目標レイアウト表示エリア */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <TargetLayout question={currentQuestion} />
            </div>

            {/* HTML構造と対象要素の説明 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <HtmlStructureInfo question={currentQuestion} />
            </div>

            {/* プレビューエリア（回答後のみ表示） */}
            {showResult && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <PreviewArea
                  question={currentQuestion}
                  selectedAnswers={selectedAnswers}
                  showResult={showResult}
                />
              </div>
            )}
          </div>

          {/* 右カラム: HTML構造、要素選択、クラス選択 */}
          <div className="space-y-6">
            {/* 2段階選択エリア */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Step 1: 要素選択 */}
              <ElementSelector
                question={currentQuestion}
                currentSelectedElement={currentSelectedElement}
                selectedAnswers={selectedAnswers}
                showResult={showResult}
                onElementSelect={handleElementSelect}
              />

              {/* Step 2: クラス選択 */}
              <ClassSelector
                question={currentQuestion}
                currentSelectedElement={currentSelectedElement}
                selectedAnswers={selectedAnswers}
                showResult={showResult}
                onClassSelect={handleClassSelect}
              />

              {/* 結果表示エリア */}
              <ResultDisplay showResult={showResult} isCorrect={isCorrect} />

              {/* アクションボタン */}
              <ActionButtons
                question={currentQuestion}
                selectedAnswers={selectedAnswers}
                showResult={showResult}
                isCorrect={isCorrect}
                isLastQuestion={isLastQuestion}
                onSubmit={handleSubmit}
                onNext={handleNext}
                onReset={handleReset}
                onRetry={handleRetryCurrentQuestion}
              />
            </div>
          </div>
        </div>

        {/* 最終結果 */}
        <FinalResult
          isLastQuestion={isLastQuestion}
          showResult={showResult}
          score={score}
          totalQuestions={flexQuestions.length}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}

export default App;
