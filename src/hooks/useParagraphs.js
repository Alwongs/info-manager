import { useState } from 'react';

export const useParagraphs = () => {
    const [paragraphs, setParagraphs] = useState([]);

    const loadParagraphsByNote = async (noteId) => {
        try {
            const data = await window.electronAPI.getParagraphsByNote(noteId);
            setParagraphs(data);
            return data;  // ✅ возвращаем данные
        } catch (error) {
            console.error('Ошибка загрузки параграфов:', error);
            return [];  // ✅ возвращаем пустой массив при ошибке
        }
    };

    const handleAddParagraph = async (noteId, title, content) => {
        try {
            const newParagraph = await window.electronAPI.addParagraph(noteId, title, content);
            alert('"""""""' + newParagraph.title + '"""""""\n' + newParagraph.content)
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
            const updatedParagraph = await window.electronAPI.updateParagraph(id, title, content);
            alert('"""""""' + updatedParagraph.title + '"""""""\n' + updatedParagraph.content)
            if (updatedParagraph?.note_id) {
                const updatedParagraphs = await loadParagraphsByNote(updatedParagraph.note_id);
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