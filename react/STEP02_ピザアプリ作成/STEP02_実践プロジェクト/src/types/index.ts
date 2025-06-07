// ピザアプリ用の型定義

/**
 * ピザの基本情報を表すインターフェース
 */
export interface Pizza {
  /** ピザの一意識別子 */
  id: number;
  /** ピザの名前 */
  name: string;
  /** ピザの材料説明 */
  ingredients: string;
  /** ピザの価格（ドル） */
  price: number;
  /** ピザ画像のファイルパス */
  photoName: string;
  /** 売り切れ状態 */
  soldOut: boolean;
}

/**
 * ヘッダーコンポーネントのProps型定義
 */
export interface HeaderProps {
  /** メインタイトル */
  title: string;
  /** サブタイトル（オプション） */
  subtitle?: string;
}

/**
 * ピザコンポーネントのProps型定義
 */
export interface PizzaProps {
  /** 表示するピザオブジェクト */
  pizzaObj: Pizza;
}

/**
 * メニューコンポーネントのProps型定義
 */
export interface MenuProps {
  /** ピザリスト（オプション、デフォルトでpizzaDataを使用） */
  pizzas?: Pizza[];
}

/**
 * フッターコンポーネントのProps型定義
 */
export interface FooterProps {
  /** 開店時間（オプション、デフォルト12時） */
  openHour?: number;
  /** 閉店時間（オプション、デフォルト22時） */
  closeHour?: number;
}

/**
 * 営業時間関連の型定義
 */
export interface BusinessHours {
  /** 開店時間 */
  openHour: number;
  /** 閉店時間 */
  closeHour: number;
  /** 現在開店中かどうか */
  isOpen: boolean;
  /** 現在の時間 */
  currentHour: number;
}

/**
 * アプリケーション全体のProps型定義
 */
export interface AppProps {
  /** アプリケーションタイトル */
  title?: string;
}