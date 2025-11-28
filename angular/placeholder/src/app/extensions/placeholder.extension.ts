import { Mark, mergeAttributes } from '@tiptap/core';

export interface PlaceholderOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    placeholder: {
      setTextPlaceholder: (name: string) => ReturnType;
      setSelectPlaceholder: (options: string) => ReturnType;
    };
  }
}

export const TextPlaceholderMark = Mark.create<PlaceholderOptions>({
  name: 'textPlaceholder',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          if (!attributes['name']) {
            return {};
          }
          return {
            'data-name': attributes['name'],
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="text-placeholder"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'text-placeholder',
        class: 'placeholder-badge-text',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setTextPlaceholder:
        (name: string) =>
        ({ commands }) => {
          return commands.setMark(this.name, { name });
        },
    };
  },
});

export const SelectPlaceholderMark = Mark.create<PlaceholderOptions>({
  name: 'selectPlaceholder',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      options: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-options'),
        renderHTML: (attributes) => {
          if (!attributes['options']) {
            return {};
          }
          return {
            'data-options': attributes['options'],
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="select-placeholder"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'select-placeholder',
        class: 'placeholder-badge-select',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setSelectPlaceholder:
        (options: string) =>
        ({ commands }) => {
          return commands.setMark(this.name, { options });
        },
    };
  },
});
