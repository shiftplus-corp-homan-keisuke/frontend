import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const PlaceholderInputHandler = Extension.create({
  name: 'placeholderInputHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('placeholderInputHandler'),
        
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (node.isText && node.text) {
                const text = node.text;
                
                // Match text placeholders: #{name}
                const textRegex = /#{([^}]+)}/g;
                let match;
                while ((match = textRegex.exec(text)) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: 'placeholder-badge-text',
                      'data-placeholder-type': 'text',
                      'data-placeholder-name': match[1],
                    })
                  );
                }

                // Match select placeholders: #select{option1|option2}
                const selectRegex = /#select\{([^}]+)\}/g;
                while ((match = selectRegex.exec(text)) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: 'placeholder-badge-select',
                      'data-placeholder-type': 'select',
                      'data-placeholder-options': match[1],
                    })
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
