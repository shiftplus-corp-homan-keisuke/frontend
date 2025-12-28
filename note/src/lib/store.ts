import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Note = {
    id: string;
    title: string;
    content: string; // JSON string block content
    updatedAt: string; // ISO string
    isTrash: boolean;
};

type NoteStore = {
    notes: Note[];
    activeNoteId: string | null;
    searchQuery: string;

    // Actions
    addNote: () => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void; // Move to trash
    restoreNote: (id: string) => void;
    permanentlyDeleteNote: (id: string) => void;
    setActiveNoteId: (id: string | null) => void;
    setSearchQuery: (query: string) => void;

    // Computed (helper, though robust computed values usually done in component or selector)
};

export const useNoteStore = create<NoteStore>()(
    persist(
        (set, get) => ({
            notes: [],
            activeNoteId: null,
            searchQuery: '',

            addNote: () => {
                const newNote: Note = {
                    id: uuidv4(),
                    title: '無題のノート',
                    content: '[]', // Empty blocks
                    updatedAt: new Date().toISOString(),
                    isTrash: false,
                };
                set((state) => ({
                    notes: [newNote, ...state.notes],
                    activeNoteId: newNote.id,
                }));
            },

            updateNote: (id, updates) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id
                            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                            : note
                    ),
                }));
            },

            deleteNote: (id) => {
                set((state) => {
                    // If active note is deleted, deselect it
                    const nextActiveId = state.activeNoteId === id ? null : state.activeNoteId;
                    return {
                        notes: state.notes.map((note) =>
                            note.id === id ? { ...note, isTrash: true } : note
                        ),
                        activeNoteId: nextActiveId,
                    };
                });
            },

            restoreNote: (id) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, isTrash: false } : note
                    ),
                }));
            },

            permanentlyDeleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                    activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
                }));
            },

            setActiveNoteId: (id) => set({ activeNoteId: id }),
            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'lumina-note-storage',
        }
    )
);
