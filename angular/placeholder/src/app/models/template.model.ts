export enum PlaceholderType {
  TEXT = 'text',
  SELECT = 'select',
}

export interface Placeholder {
  id: string;
  type: PlaceholderType;
  name: string;
  options?: string[];
  position: number;
  originalText: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  placeholders: Placeholder[];
  createdAt: Date;
  updatedAt: Date;
}
