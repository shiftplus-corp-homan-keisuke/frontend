import { atom, type WritableAtom } from "jotai";

/**
 * エンティティの基本インターフェース
 * すべてのエンティティはIDを持つ必要がある
 */
export interface WithId {
  id: string;
}

/**
 * エンティティに対する共通アクションの型定義
 * @template T - WithIdを実装するエンティティ型
 */
export type EntityAction<T> = 
  | { type: 'add'; payload: T }
  | { type: 'remove'; payload: string }
  | { type: 'update'; payload: { id: string; data: Partial<T> } }
  | { type: 'clear' };

/**
 * エンティティの共通操作を処理するリデューサー関数を作成
 * @template T - WithIdを実装するエンティティ型
 * @returns エンティティ配列とアクションを受け取り、新しい配列を返すリデューサー関数
 */
function createEntityReducer<T extends WithId>() {
  return (entities: T[], action: EntityAction<T>): T[] => {
    switch (action.type) {
      case 'add':
        return [...entities, action.payload];
      case 'remove':
        return entities.filter(entity => entity.id !== action.payload);
      case 'update':
        return entities.map(entity => 
          entity.id === action.payload.id 
            ? { ...entity, ...action.payload.data }
            : entity
        );
      case 'clear':
        return [];
      default:
        return entities;
    }
  };
}

/**
 * エンティティストアを作成するファクトリー関数
 * 共通のCRUD操作と派生Atomを提供する
 * @template T - WithIdを実装するエンティティ型
 * @param initialData - 初期データ（デフォルトは空配列）
 * @returns エンティティストアオブジェクト
 */
export function createEntityStore<T extends WithId>(initialData: T[] = []) {
  // エンティティ配列を管理するメインAtom
  const entitiesAtom = atom<T[]>(initialData);
  
  // エンティティ操作を処理するアクションAtom
  const actionsAtom = atom(
    null,
    (get, set, action: EntityAction<T>) => {
      const currentEntities = get(entitiesAtom);
      const reducer = createEntityReducer<T>();
      set(entitiesAtom, reducer(currentEntities, action));
    }
  );

  // 派生Atom: エンティティ数
  const countAtom = atom(get => get(entitiesAtom).length);
  
  // 派生Atom: IDによるエンティティマップ
  const byIdAtom = atom(get => {
    const entities = get(entitiesAtom);
    return entities.reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {} as Record<string, T>);
  });

  return {
    entitiesAtom,
    actionsAtom,
    countAtom,
    byIdAtom
  };
}

/**
 * エンティティ用の統一されたHookを作成するファクトリー関数
 * @template T - WithIdを実装するエンティティ型
 * @template SpecificAction - エンティティ固有のアクション型
 * @param store - createEntityStoreで作成されたストア
 * @param specificActionsAtom - エンティティ固有のアクションAtom（オプション）
 * @returns エンティティ操作用のHook関数
 */
export function createEntityHook<T extends WithId, SpecificAction = never>(
  store: ReturnType<typeof createEntityStore<T>>,
  specificActionsAtom?: WritableAtom<null, [SpecificAction], void>
) {
  return () => {
    const [entities] = useAtom(store.entitiesAtom);
    const [, dispatch] = useAtom(store.actionsAtom);
    const [, dispatchSpecific] = useAtom(specificActionsAtom || atom(null, () => {}));
    const [count] = useAtom(store.countAtom);
    const [byId] = useAtom(store.byIdAtom);

    // 共通のアクション関数
    const actions = {
      add: (entity: T) => dispatch({ type: 'add', payload: entity }),
      remove: (id: string) => dispatch({ type: 'remove', payload: id }),
      update: (id: string, data: Partial<T>) => dispatch({ type: 'update', payload: { id, data } }),
      clear: () => dispatch({ type: 'clear' }),
    };

    return {
      entities,
      count,
      byId,
      actions,
      dispatchSpecific: specificActionsAtom ? dispatchSpecific : undefined
    };
  };
}

// useAtomのインポートを追加
import { useAtom } from "jotai";