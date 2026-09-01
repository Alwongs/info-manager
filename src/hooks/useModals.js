import { useState } from 'react';

export const useModals = () => {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isParagraphModalOpen, setIsParagraphModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [editingParagraph, setEditingParagraph] = useState(null);
    const [editingNoteCategoryId, setEditingNoteCategoryId] = useState('');

    const openCategoryModal = () => {
        setEditingCategory(null);
        setIsCategoryModalOpen(true);
        setTimeout(() => {
            document.getElementById('categoryModalInput')?.focus();
        }, 400);
    };
    const openNoteModal = () => {
        setEditingNote(null);
        setIsNoteModalOpen(true);
        setTimeout(() => {
            document.getElementById('noteModalInput')?.focus();
        }, 400);
    };
    const openParagraphModal = () => {
        setEditingParagraph(null);
        setIsParagraphModalOpen(true);
        setTimeout(() => {
            document.getElementById('paragraphModalInput')?.focus();
        }, 400);
    };

    const openEditCategoryModal = (category) => {
        setEditingCategory(category);
        setIsCategoryModalOpen(true);
        setTimeout(() => {
            document.getElementById('categoryModalInput')?.focus();
        }, 400);
    };
    const openEditNoteModal = (note) => {
        setEditingNote(note); 
        setEditingNoteCategoryId(note.category_id || '');
        setIsNoteModalOpen(true);
        setTimeout(() => {
            document.getElementById('noteModalInput')?.focus();
        }, 400);
    };
    const openEditParagraphModal = (paragraph) => {
        setEditingParagraph(paragraph);
        setIsParagraphModalOpen(true);
        setTimeout(() => {
            document.getElementById('paragraphModalInput')?.focus();
        }, 400);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
    };
    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
        setEditingNote(null);
        setEditingNoteCategoryId('');
    };
    const closeParagraphModal = () => {
        setIsParagraphModalOpen(false);
        setEditingParagraph(null);
    };


    return {
        isCategoryModalOpen,
        isNoteModalOpen,
        isParagraphModalOpen,

        editingCategory,
        editingNote,
        editingParagraph,
        editingNoteCategoryId,

        openCategoryModal,
        openNoteModal,
        openParagraphModal,

        openEditCategoryModal,
        openEditNoteModal,
        openEditParagraphModal,

        closeCategoryModal,
        closeNoteModal,
        closeParagraphModal,
    };
};