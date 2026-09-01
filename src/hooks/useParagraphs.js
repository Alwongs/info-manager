import { useState } from 'react';

export const useParagraphs = () => {
    const [paragraphs, setParagraphs] = useState([]);

    const loadParagraphsByNote = async (noteId) => {
        try {
            const data = await window.electronAPI.getParagraphsByNote(noteId);
            setParagraphs(data);
        } catch (error) {
            console.error('Ошибка загрузки параграфов:', error);
        }
    };

    const handleAddParagraph = async (noteId, title, content) => {
        try {
            const newParagraph = await window.electronAPI.addParagraph(noteId, title, content);
            setParagraphs(prev => [newParagraph, ...prev]);
            return newParagraph;
        } catch (error) {
            console.error("Ошибка при добавлении параграфа:", error);
            alert("Не удалось добавить параграф.");
            throw error;
        }
    };

    const handleUpdateParagraph = async (id, title, content) => {
        try {
            const success = await window.electronAPI.updateParagraph(id, title, content);
            
            if (success) {
                setParagraphs(prev => prev.map(par => 
                    par.id === id ? { ...par, title, content } : par
                ));
            } else {
                console.warn('⚠️ Параграф не был сохранен в БД');
                alert('Не удалось обновить параграф.');
            }
        } catch (error) {
            console.error("❌ Ошибка при обновлении:", error);
            alert("Не удалось обновить заметку.");
            throw error;
        }
    };

    

    const handleDeleteParagraph = async (id) => {
        try {
            await window.electronAPI.deleteParagraph(id);
            setParagraphs(prev => prev.filter(par => par.id !== id));
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Не удалось удалить параграф.");
        }
    };

    const handleSearchParagraphs = async (phrase) => {
        try {
            const data = await window.electronAPI.getParagraphsByPhrase(phrase);
            setParagraphs(data);
            return data;
        } catch (error) {
            console.error('Ошибка поиска параграфов:', error);
            return [];
        }
    };


    return {
        paragraphs,
        setParagraphs,
        loadParagraphsByNote,
        handleAddParagraph,
        handleUpdateParagraph,
        handleDeleteParagraph,
        handleSearchParagraphs
    };
};