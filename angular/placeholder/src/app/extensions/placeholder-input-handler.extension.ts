import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

/**
 * プレースホルダー情報の型定義
 */
export interface PlaceholderInfo {
  type: 'text' | 'select';
  name?: string;
  options?: string;
}

/**
 * プレースホルダー変更イベントの型定義
 */
export interface PlaceholderChangeEvent {
  added: PlaceholderInfo[];
  removed: PlaceholderInfo[];
  current: PlaceholderInfo[];
}

/**
 * Extension のオプション型定義
 */
export interface PlaceholderInputHandlerOptions {
  onPlaceholderChange?: (event: PlaceholderChangeEvent) => void;
}

/**
 * プレースホルダー入力ハンドラー Extension
 *
 * このExtensionは、エディタ内のテキストからプレースホルダーを検出し、
 * 視覚的にバッジとして表示する機能を提供します。
 *
 * 対応するプレースホルダー:
 * - テキスト型: #{text:名前} または省略形 #{名前}
 * - 選択型: #{select:天気:晴れ|曇り|雨}
 * - チェックボックス型: #{checkbox:同意:はい|いいえ}
 */
export const PlaceholderInputHandler = Extension.create<PlaceholderInputHandlerOptions>({
  name: 'placeholderInputHandler',

  addOptions() {
    return {
      onPlaceholderChange: undefined,
    };
  },

  /**
   * ProseMirrorの低レベルプラグインを追加
   */
  addProseMirrorPlugins() {
    // 前回検出したプレースホルダーを保持
    let previousPlaceholders: PlaceholderInfo[] = [];

    return [
      new Plugin({
        // プラグインを識別するための一意のキー
        key: new PluginKey('placeholderInputHandler'),

        props: {
          /**
           * decorations関数
           * エディタの状態が変わるたびに自動的に呼ばれ、
           * 見た目を変更するためのDecorationを返します
           *
           * @param state - エディタの現在の状態
           * @returns DecorationSet - 適用するスタイルのセット
           */
          decorations: (state) => {
            // 適用するスタイル情報を格納する配列
            const decorations: Decoration[] = [];
            // 現在のプレースホルダー情報を格納
            const currentPlaceholders: PlaceholderInfo[] = [];
            // エディタのドキュメント（文書全体）
            const doc = state.doc;

            /**
             * ドキュメント内の全ノードを走査
             * node: 現在のノード（段落、テキストなど）
             * pos: ドキュメント内での位置（0から始まる）
             */
            doc.descendants((node, pos) => {
              // テキストノードのみを処理対象とする
              if (node.isText && node.text) {
                const text = node.text;

                // ========================================
                // プレースホルダーの検出: #{type:name:options} または #{name}
                // ========================================
                const placeholderRegex = /#{([^}]+)}/g;
                let match;

                // 正規表現にマッチする全ての箇所を検索
                while ((match = placeholderRegex.exec(text)) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  const content = match[1]; // カッコ内の文字列

                  // コロンで分割してタイプ指定を確認
                  const parts = content.split(':');

                  let type: 'text' | 'select' | 'checkbox' = 'text';
                  let name = '';
                  let options = '';

                  if (parts.length === 1) {
                    // ========================================
                    // 省略形: #{name} → テキスト型
                    // ========================================
                    type = 'text';
                    name = parts[0].trim();
                  } else if (parts.length >= 2) {
                    // ========================================
                    // 完全形: #{type:name} または #{type:name:options}
                    // ========================================
                    const specifiedType = parts[0].trim();
                    name = parts[1].trim();

                    if (specifiedType === 'text') {
                      type = 'text';
                    } else if (specifiedType === 'select') {
                      type = 'select';
                      options = parts.slice(2).join(':'); // 残りをオプションとして結合
                    } else if (specifiedType === 'checkbox') {
                      type = 'checkbox';
                      options = parts.slice(2).join(':'); // 残りをオプションとして結合
                    } else {
                      // 未知のタイプはテキストとして扱う
                      type = 'text';
                      name = content;
                    }
                  }

                  // プレースホルダー情報を記録
                  currentPlaceholders.push({
                    type: type as 'text' | 'select',
                    name: name,
                    options: options || undefined,
                  });

                  // CSSクラスを決定
                  const cssClass =
                    type === 'select' || type === 'checkbox'
                      ? 'placeholder-badge-select'
                      : 'placeholder-badge-text';

                  // スタイル情報を追加
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: cssClass,
                      'data-placeholder-type': type,
                      'data-placeholder-name': name,
                      'data-placeholder-options': options || undefined,
                    })
                  );
                }
              }
            });

            // ========================================
            // プレースホルダーの変更を検出して通知
            // ========================================
            if (this.options.onPlaceholderChange) {
              // プレースホルダーを識別するためのキーを生成
              const getKey = (p: PlaceholderInfo) => `${p.type}:${p.name}:${p.options || ''}`;

              // 前回と現在のプレースホルダーのキーセットを作成
              const prevKeys = new Set(previousPlaceholders.map(getKey));
              const currentKeys = new Set(currentPlaceholders.map(getKey));

              // 追加されたプレースホルダーを検出（重複を除く）
              const addedKeys = new Set<string>();
              const added = currentPlaceholders.filter((p) => {
                const key = getKey(p);
                if (!prevKeys.has(key) && !addedKeys.has(key)) {
                  addedKeys.add(key);
                  return true;
                }
                return false;
              });

              // 削除されたプレースホルダーを検出（重複を除く）
              const removedKeys = new Set<string>();
              const removed = previousPlaceholders.filter((p) => {
                const key = getKey(p);
                if (!currentKeys.has(key) && !removedKeys.has(key)) {
                  removedKeys.add(key);
                  return true;
                }
                return false;
              });

              // 変更があった場合のみ通知
              if (added.length > 0 || removed.length > 0) {
                this.options.onPlaceholderChange({
                  added,
                  removed,
                  current: currentPlaceholders,
                });
              }
            }

            // 次回の比較用に保存
            previousPlaceholders = currentPlaceholders;

            // 全てのスタイル情報をセットにしてエディタに返す
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
