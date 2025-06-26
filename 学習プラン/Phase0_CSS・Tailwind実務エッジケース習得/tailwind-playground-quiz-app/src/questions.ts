export interface TargetElement {
  name: string;
  selector: string;
  classes: string[];
  // 複数の正解パターン（どれか1つが正解であればOK）
  alternativeClasses?: string[][];
}

export interface Question {
  id: number;
  question: string;
  description: string;
  correctAnswers: TargetElement[];
  allOptions: string[];
  htmlStructure: string;
  complexity: "basic" | "intermediate" | "advanced";
}

export const flexQuestions: Question[] = [
  // 基本問題
  {
    id: 1,
    question: "flex-itemをセンター寄せで配置してください",
    description: "横方向、縦方向ともに中央に配置する",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "justify-center", "items-center"],
        alternativeClasses: [["place-items-center"]],
      },
    ],
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
      "flex-col",
      "flex-row",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    complexity: "basic",
  },
  {
    id: 2,
    question: "flex-itemを横方向に均等分散で配置してください",
    description: "両端に配置し、間に等しい間隔を空ける",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "justify-between"],
      },
    ],
    allOptions: [
      "flex",
      "justify-between",
      "justify-around",
      "justify-evenly",
      "justify-center",
      "justify-start",
      "justify-end",
      "items-center",
      "items-start",
      "flex-col",
      "flex-row",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    complexity: "basic",
  },
  // 複雑なネストされたflex問題
  {
    id: 3,
    question: "ナビゲーションバーを作成してください",
    description:
      "ロゴを左端に、メニューリンクを右端に配置する（メニュー間の間隔は自動調整）",
    correctAnswers: [
      {
        name: "navbar（外側のコンテナ）",
        selector: ".navbar",
        classes: ["flex", "justify-between", "items-center"],
      },
      {
        name: "nav-links（メニューリンクコンテナ）",
        selector: ".nav-links",
        classes: ["flex"],
      },
    ],
    allOptions: [
      "flex",
      "justify-between",
      "justify-center",
      "justify-end",
      "justify-start",
      "justify-around",
      "justify-evenly",
      "items-center",
      "items-start",
      "items-end",
      "flex-col",
      "flex-row",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
      "grow",
      "shrink",
      "basis-0",
      "basis-auto",
      "basis-full",
      "basis-1/2",
      "basis-1/3",
      "basis-2/3",
      "basis-1/4",
      "basis-3/4",
    ],
    htmlStructure:
      '<div class="navbar">\n  <div class="logo">Logo</div>\n  <div class="nav-links">\n    <a href="#">Home</a>\n    <a href="#">About</a>\n    <a href="#">Contact</a>\n  </div>\n</div>',
    complexity: "intermediate",
  },
  // 追加の基本問題
  {
    id: 4,
    question: "flex-itemを縦方向に並べて配置してください",
    description: "アイテムを列（縦）方向に配置し、左寄せにする",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "flex-col", "items-start"],
      },
    ],
    allOptions: [
      "flex",
      "flex-col",
      "flex-row",
      "justify-center",
      "items-center",
      "justify-start",
      "items-start",
      "items-end",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    complexity: "basic",
  },
  {
    id: 5,
    question: "flex-itemを右端に寄せて配置してください",
    description: "アイテムを横方向の終端（右側）に配置する",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "justify-end"],
      },
    ],
    allOptions: [
      "flex",
      "justify-end",
      "justify-start",
      "justify-center",
      "justify-between",
      "items-end",
      "items-start",
      "items-center",
      "text-right",
      "flex-col",
      "flex-row",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    complexity: "basic",
  },
  // flex-grow、flex-shrink、flex-basisの学習問題
  {
    id: 6,
    question: "中央のアイテムだけを残りスペースいっぱいに伸ばしてください",
    description:
      "1番目と3番目のアイテムは元のサイズのまま、2番目のアイテムのみ利用可能なスペースを埋める",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex"],
      },
      {
        name: "2番目のアイテム（緑のボックス）",
        selector: ".item-2",
        classes: ["flex-grow"],
        alternativeClasses: [["flex-1"], ["flex-auto"]],
      },
    ],
    allOptions: [
      "flex",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
      "grow",
      "shrink",
      "justify-center",
      "items-center",
      "basis-0",
      "basis-auto",
      "basis-full",
      "basis-1/2",
      "basis-1/3",
      "basis-2/3",
    ],
    htmlStructure:
      '<div class="container">\n  <div class="item-1">1</div>\n  <div class="item-2">2</div>\n  <div class="item-3">3</div>\n</div>',
    complexity: "intermediate",
  },
  {
    id: 7,
    question:
      "全てのアイテムを等しく伸ばして利用可能なスペースを均等に分割してください",
    description:
      "3つのアイテムが同じ幅になるように、利用可能なスペースを均等に分配する",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex"],
      },
      {
        name: "1番目のアイテム（赤のボックス）",
        selector: ".item-1",
        classes: ["flex-1"],
      },
      {
        name: "2番目のアイテム（緑のボックス）",
        selector: ".item-2",
        classes: ["flex-1"],
      },
      {
        name: "3番目のアイテム（黄のボックス）",
        selector: ".item-3",
        classes: ["flex-1"],
      },
    ],
    allOptions: [
      "flex",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
      "grow",
      "shrink",
      "justify-center",
      "items-center",
      "basis-0",
      "basis-auto",
      "basis-full",
      "basis-1/2",
      "basis-1/3",
      "basis-2/3",
    ],
    htmlStructure:
      '<div class="container">\n  <div class="item-1">1</div>\n  <div class="item-2">2</div>\n  <div class="item-3">3</div>\n</div>',
    complexity: "intermediate",
  },
  {
    id: 8,
    question:
      "2番目のアイテムだけを最大幅に設定し、他のアイテムは最小サイズにしてください",
    description:
      "2番目のアイテムが利用可能なスペースをすべて使い、1番目と3番目は最小サイズを保つ",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex"],
      },
      {
        name: "1番目のアイテム（赤のボックス）",
        selector: ".item-1",
        classes: ["flex-none"],
      },
      {
        name: "2番目のアイテム（緑のボックス）",
        selector: ".item-2",
        classes: ["flex-1", "flex-grow"],
      },
      {
        name: "3番目のアイテム（黄のボックス）",
        selector: ".item-3",
        classes: ["flex-none"],
      },
    ],
    allOptions: [
      "flex",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
      "grow",
      "shrink",
      "justify-center",
      "items-center",
      "basis-0",
      "basis-auto",
      "basis-full",
      "basis-1/2",
      "basis-1/3",
      "basis-2/3",
    ],
    htmlStructure:
      '<div class="container">\n  <div class="item-1">1</div>\n  <div class="item-2">2</div>\n  <div class="item-3">3</div>\n</div>',
    complexity: "intermediate",
  },
  {
    id: 9,
    question: "アイテムが縮まないように設定してください",
    description:
      "コンテナの幅が狭くなってもアイテムは元のサイズを維持する（shrinkを無効化）",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex"],
      },
      {
        name: "1番目のアイテム（赤のボックス）",
        selector: ".item-1",
        classes: ["flex-none"],
      },
      {
        name: "2番目のアイテム（緑のボックス）",
        selector: ".item-2",
        classes: ["flex-none"],
      },
      {
        name: "3番目のアイテム（黄のボックス）",
        selector: ".item-3",
        classes: ["flex-none"],
      },
    ],
    allOptions: [
      "flex",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
      "grow",
      "shrink",
      "justify-center",
      "items-center",
      "basis-0",
      "basis-auto",
      "basis-full",
      "basis-1/2",
      "basis-1/3",
      "basis-2/3",
    ],
    htmlStructure:
      '<div class="container">\n  <div class="item-1">アイテム1</div>\n  <div class="item-2">アイテム2</div>\n  <div class="item-3">アイテム3</div>\n</div>',
    complexity: "intermediate",
  },
  // 新しい問題: flex-wrap（折り返し）
  {
    id: 10,
    question: "アイテムが多い場合に次の行に折り返すように設定してください",
    description: "コンテナの幅を超えるアイテムを次の行に折り返して配置する",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "flex-wrap"],
      },
    ],
    allOptions: [
      "flex",
      "flex-wrap",
      "flex-nowrap",
      "flex-wrap-reverse",
      "justify-center",
      "justify-start",
      "justify-end",
      "justify-between",
      "justify-around",
      "justify-evenly",
      "items-center",
      "items-start",
      "items-end",
      "items-stretch",
      "flex-col",
      "flex-row",
      "flex-grow",
      "flex-shrink",
      "flex-1",
      "flex-auto",
      "flex-initial",
      "flex-none",
    ],
    htmlStructure:
      '<div class="container">\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n  <div>Item 4</div>\n  <div>Item 5</div>\n  <div>Item 6</div>\n</div>',
    complexity: "intermediate",
  },
  // 新しい問題: gap（間隔制御）
  {
    id: 11,
    question: "アイテム間に一定の間隔を設けてください",
    description:
      "アイテム間に16px（1rem）の間隔を設けてください。目標レイアウトの間隔を参考にしてください。",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "gap-4"],
        alternativeClasses: [["flex", "space-x-4"]],
      },
    ],
    allOptions: [
      "flex",
      "gap-1",
      "gap-2",
      "gap-4",
      "gap-6",
      "gap-8",
      "space-x-1",
      "space-x-2",
      "space-x-4",
      "space-x-6",
      "space-x-8",
      "space-y-1",
      "space-y-2",
      "space-y-4",
      "space-y-6",
      "space-y-8",
      "justify-center",
      "justify-between",
      "items-center",
      "flex-wrap",
      "flex-col",
      "flex-row",
    ],
    htmlStructure:
      '<div class="container">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>',
    complexity: "basic",
  },
  // 新しい問題: 複合レイアウト（カード配置）
  {
    id: 12,
    question: "カードを3列に配置し、折り返しと間隔を設定してください",
    description:
      "カードレイアウトで3列配置、折り返し有効、カード間に16px（1rem）の間隔を設定してください。目標レイアウトの間隔を参考にしてください。",
    correctAnswers: [
      {
        name: "container（親要素）",
        selector: ".container",
        classes: ["flex", "flex-wrap", "gap-4", "justify-start"],
      },
      {
        name: "カード（各アイテム）",
        selector: ".card",
        classes: ["flex-1", "min-w-0"],
        alternativeClasses: [["basis-1/3", "flex-grow-0"]],
      },
    ],
    allOptions: [
      "flex",
      "flex-wrap",
      "flex-nowrap",
      "gap-1",
      "gap-2",
      "gap-4",
      "gap-6",
      "gap-8",
      "justify-start",
      "justify-center",
      "justify-between",
      "justify-around",
      "justify-evenly",
      "items-start",
      "items-center",
      "items-stretch",
      "flex-1",
      "flex-auto",
      "flex-none",
      "basis-1/3",
      "basis-1/4",
      "basis-1/2",
      "min-w-0",
      "min-w-full",
      "flex-grow",
      "flex-grow-0",
      "flex-shrink",
      "flex-shrink-0",
    ],
    htmlStructure:
      '<div class="container">\n  <div class="card">Card 1</div>\n  <div class="card">Card 2</div>\n  <div class="card">Card 3</div>\n  <div class="card">Card 4</div>\n  <div class="card">Card 5</div>\n  <div class="card">Card 6</div>\n</div>',
    complexity: "advanced",
  },
];
