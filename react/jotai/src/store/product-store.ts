import { atom } from "jotai";
import { createEntityStore, createEntityHook, type WithId } from "./entity-store";

/**
 * 商品エンティティの型定義
 * WithIdインターフェースを実装し、IDを持つ
 */
export interface Product extends WithId {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description?: string;
}

/**
 * 商品固有のアクション型定義
 * 共通のEntityActionに加えて、商品特有の操作を定義
 */
export type ProductSpecificAction = 
  | { type: 'updatePrice'; payload: { id: string; price: number } }
  | { type: 'toggleStock'; payload: string }
  | { type: 'applyDiscount'; payload: { categoryId: string; discount: number } }
  | { type: 'updateCategory'; payload: { id: string; category: string } };

/**
 * 商品エンティティストアの作成
 * 共通のCRUD操作と派生Atomを提供
 */
export const productStore = createEntityStore<Product>();

/**
 * 商品固有のアクションを処理するAtom
 * 共通操作では対応できない商品特有の操作を実装
 */
export const productSpecificActionsAtom = atom(
  null,
  (get, set, action: ProductSpecificAction) => {
    const currentProducts = get(productStore.entitiesAtom);
    
    switch (action.type) {
      case 'updatePrice':
        // 共通のupdateアクションを使用して価格更新
        set(productStore.actionsAtom, {
          type: 'update',
          payload: { id: action.payload.id, data: { price: action.payload.price } }
        });
        break;
        
      case 'toggleStock':
        // 商品の在庫状態を切り替え
        const product = currentProducts.find(p => p.id === action.payload);
        if (product) {
          set(productStore.actionsAtom, {
            type: 'update',
            payload: { id: action.payload, data: { inStock: !product.inStock } }
          });
        }
        break;
        
      case 'applyDiscount':
        // カテゴリ別に割引を適用
        const productsToUpdate = currentProducts.filter(p => p.category === action.payload.categoryId);
        productsToUpdate.forEach(product => {
          const discountedPrice = Math.round(product.price * (1 - action.payload.discount));
          set(productStore.actionsAtom, {
            type: 'update',
            payload: { id: product.id, data: { price: discountedPrice } }
          });
        });
        break;
        
      case 'updateCategory':
        // カテゴリを更新
        set(productStore.actionsAtom, {
          type: 'update',
          payload: { 
            id: action.payload.id, 
            data: { category: action.payload.category } 
          }
        });
        break;
    }
  }
);

/**
 * 商品固有の派生Atom
 * 在庫のある商品のみを取得
 */
export const inStockProductsAtom = atom(get => 
  get(productStore.entitiesAtom).filter(product => product.inStock)
);

/**
 * 商品固有の派生Atom
 * カテゴリ別に商品をグループ化
 */
export const productsByCategoryAtom = atom(get => {
  const products = get(productStore.entitiesAtom);
  return products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
});

/**
 * 商品固有の派生Atom
 * 価格帯別に商品をグループ化
 */
export const productsByPriceRangeAtom = atom(get => {
  const products = get(productStore.entitiesAtom);
  return products.reduce((acc, product) => {
    let range: string;
    if (product.price < 1000) range = '1000円未満';
    else if (product.price < 5000) range = '1000-5000円';
    else if (product.price < 10000) range = '5000-10000円';
    else range = '10000円以上';
    
    if (!acc[range]) acc[range] = [];
    acc[range].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
});

/**
 * 商品固有の派生Atom
 * 平均価格を計算
 */
export const averagePriceAtom = atom(get => {
  const products = get(productStore.entitiesAtom);
  if (products.length === 0) return 0;
  const total = products.reduce((sum, product) => sum + product.price, 0);
  return Math.round(total / products.length);
});

/**
 * 商品操作用の統一されたHook
 * 共通操作と商品固有操作の両方を提供
 */
export const useProducts = createEntityHook(productStore, productSpecificActionsAtom);

/**
 * 商品作成用のヘルパー関数
 * @param name - 商品名
 * @param price - 価格
 * @param category - カテゴリ
 * @param inStock - 在庫状態（デフォルト: true）
 * @param description - 説明（オプション）
 * @returns 新しいProductオブジェクト
 */
export function createProduct(
  name: string, 
  price: number, 
  category: string, 
  inStock: boolean = true,
  description?: string
): Product {
  return {
    id: crypto.randomUUID(),
    name,
    price,
    category,
    inStock,
    description
  };
}

/**
 * サンプル商品データを生成するヘルパー関数
 * @returns サンプル商品の配列
 */
export function createSampleProducts(): Product[] {
  return [
    createProduct("ノートパソコン", 89800, "電子機器", true, "高性能なビジネス向けノートパソコン"),
    createProduct("ワイヤレスマウス", 2980, "電子機器", true, "Bluetooth対応ワイヤレスマウス"),
    createProduct("コーヒーメーカー", 12800, "家電", false, "全自動コーヒーメーカー"),
    createProduct("デスクチェア", 25000, "家具", true, "エルゴノミクスデザインのオフィスチェア"),
    createProduct("プログラミング入門書", 3200, "書籍", true, "初心者向けプログラミング学習書"),
  ];
}