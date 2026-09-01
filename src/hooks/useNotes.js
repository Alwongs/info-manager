import { useState, useEffect } from 'react';

export const useNotes = (selectedCategoryId) => {
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState('');
    const [selectedNoteTitle, setSelectedNoteTitle] = useState('');

    const loadNotes = async () => {
        try {
            const data = await window.electronAPI.getNotes();
            setNotes(data);
        } catch (error) {
            console.error('Ошибка загрузки заметок:', error);
        }
    };

    const loadNotesByCategory = async (categoryId) => {
        try {
            const data = await window.electronAPI.getNotesByCategory(categoryId);
            setNotes(data);
        } catch (error) {
            console.error('Ошибка загрузки заметок:', error);
        }
    };

    const handleAddNote = async (title, categoryId) => {
        try {
            const newNote = await window.electronAPI.addNote(title, categoryId);
            setNotes(prev => [newNote, ...prev]);
            return newNote;
        } catch (error) {
            console.error("Ошибка при добавлении заметки:", error);
            alert("Не удалось добавить заметку.");
            throw error;
        }
    };

    const handleUpdateNote = async (id, title, categoryId) => {
        try {
            const success = await window.electronAPI.updateNote(id, title, categoryId);
            
            if (success) {
                setNotes(prev => prev.map(note => 
                    note.id === id ? { ...note, title, category_id: categoryId } : note
                ));
            } else {
                console.warn('⚠️ Заметка не была обновлена в БД');
                alert('Не удалось обновить заметку.');
            }
        } catch (error) {
            console.error("❌ Ошибка при обновлении:", error);
            alert("Не удалось обновить заметку.");
            throw error;
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await window.electronAPI.deleteNote(id);
            setNotes(prev => prev.filter(note => note.id !== id));
            if (selectedNoteId === id) {
                setSelectedNoteId('');
                setSelectedNoteTitle('');
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Не удалось удалить заметку.");
        }
    };

    const handleSelectNote = (id) => {
        setSelectedNoteId(id);
        const note = notes.find(n => n.id === id);
        setSelectedNoteTitle(note?.title || '');
    };

    const handleSearchNotes = async (phrase) => {
        try {
            const data = await window.electronAPI.getNotesByPhrase(phrase);
            setNotes(data);
            return data;
        } catch (error) {
            console.error('Ошибка поиска заметок:', error);
            return [];
        }
    };

    useEffect(() => {
        if (selectedCategoryId) {
            loadNotesByCategory(selectedCategoryId);
        } else {
            // loadNotes();
            console.log('Category has not been selected')
        }
    }, [selectedCategoryId]);

    return {
        notes,
        setNotes,
        selectedNoteId,
        setSelectedNoteId,
        selectedNoteTitle,
        setSelectedNoteTitle,
        handleAddNote,
        handleUpdateNote,
        handleDeleteNote,
        handleSelectNote,
        handleSearchNotes,
        loadNotes
    };
};