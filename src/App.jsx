import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import TopPanel from "./components/TopPanel/TopPanel.jsx";
import ColumnHeader from './components/ColumnHeader/ColumnHeader';
import CategoryList from './sections/CategoryList/CategoryList';
import NoteList from './sections/NoteList/NoteList';
import ParagraphList from './sections/ParagraphList/ParagraphList';
import CategoryModal from './modals/CategoryModal';
import NoteModal from './modals/NoteModal';
import ParagraphModal from './modals/ParagraphModal';
import { useCategories } from './hooks/useCategories';
import { useNotes } from './hooks/useNotes';
import { useParagraphs } from './hooks/useParagraphs';
import { useModals } from './hooks/useModals';
import MasterPasswordDialog from './components/MasterPasswordDialog';
import ChangePasswordDialog from './components/ChangePasswordDialog';

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMasterPassword, setShowMasterPassword] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const { 
        categories, 
        selectedCategoryId, 
        handleAddCategory, 
        handleEditCategory, 
        handleDeleteCategory, 
        handleSelectCategory,
    } = useCategories();

    const { 
        notes, 
        selectedNoteId, 
        selectedNoteTitle, 
        handleAddNote, 
        handleUpdateNote,
        handleDeleteNote, 
        handleSelectNote, 
        handleSearchNotes,
    } = useNotes(selectedCategoryId);

    const { 
        paragraphs, 
        setParagraphs, 
        loadParagraphsByNote, 
        handleAddParagraph, 
        handleUpdateParagraph,
        handleDeleteParagraph, 
        handleSearchParagraphs 
    } = useParagraphs();

    const {
        isCategoryModalOpen,
        isNoteModalOpen,
        isParagraphModalOpen,
        editingCategory,
        editingNote,
        editingNoteCategoryId,
        editingParagraph,
        openCategoryModal,
        openNoteModal,
        openParagraphModal,
        openEditCategoryModal,
        openEditNoteModal,
        openEditParagraphModal,
        closeCategoryModal,
        closeNoteModal,
        closeParagraphModal
    } = useModals();

    useEffect(() => {
        if (selectedNoteId) {
            loadParagraphsByNote(selectedNoteId);
        } else {
            setParagraphs([]);
        }
    }, [selectedNoteId]);

    // При первом запуске проверяем, есть ли сохраненный пароль
    useEffect(() => {
        window.electronAPI.hasMasterPassword().then(has => {
            if (!has) {
                // Нет сохраненного пароля → просим придумать
                setShowMasterPassword(true);
            }
        });
    }, []);

    const handleChangePassword = async (oldPassword, newPassword) => {
        const result = await window.electronAPI.changePassword(oldPassword, newPassword);
        alert(`✅ Пароль изменен! Перешифровано ${result.reencrypted} параграфов`);
    };   

    if (showMasterPassword) {
        return <MasterPasswordDialog onSuccess={() => setShowMasterPassword(false)} />;
    }  

    const handleSearchPhrase = async (phrase) => {
        setSearchQuery(phrase);
        await Promise.all([
            handleSearchNotes(phrase),
            handleSearchParagraphs(phrase)
        ]);
    };

    return (
        <>
            <TopPanel
                onSearch={handleSearchPhrase} 
                onChangePassword={() => setShowChangePassword(true)}
            />
            
            <div className={styles.app}>
                <CategoryModal
                    visible={isCategoryModalOpen}
                    onClose={closeCategoryModal}
                    onAdd={handleAddCategory}
                    onEdit={handleEditCategory}
                    editingItem={editingCategory}
                />
                <NoteModal
                    visible={isNoteModalOpen}
                    onClose={closeNoteModal}
                    onAdd={handleAddNote}
                    onUpdate={handleUpdateNote}
                    editingItem={editingNote}
                    categories={categories} 
                    selectedCategoryId={editingNote ? editingNoteCategoryId : selectedCategoryId}
                />
                <ParagraphModal
                    visible={isParagraphModalOpen}
                    onClose={closeParagraphModal}
                    onAdd={handleAddParagraph}
                    onUpdate={handleUpdateParagraph}
                    editingItem={editingParagraph}
                    noteId={selectedNoteId}
                    noteTitle={selectedNoteTitle}
                />

                <div className={styles['categories-column']}>
                    <ColumnHeader
                        title="Categories"
                        onAdd={openCategoryModal}
                    />
                    <CategoryList
                        categories={categories}
                        onEdit={openEditCategoryModal}
                        onDelete={handleDeleteCategory}
                        onSelectCategory={handleSelectCategory}
                        selectedCategoryId={selectedCategoryId}
                    />                   
                </div>  

                <div className={styles['notes-column']}>
                    <ColumnHeader
                        title="Notes"
                        onAdd={openNoteModal}
                    />
                    <NoteList
                        notes={notes}
                        onEdit={openEditNoteModal}
                        onDelete={handleDeleteNote}
                        onSelectNote={handleSelectNote}
                        selectedNoteId={selectedNoteId}
                        searchQuery={searchQuery}
                    /> 
                </div>

                <div className={styles['detail-column']}>
                    <ColumnHeader
                        title="Pages"
                        onAdd={openParagraphModal}
                    />
                    <ParagraphList
                        paragraphs={paragraphs}
                        onEdit={openEditParagraphModal}
                        onDelete={handleDeleteParagraph}
                        searchQuery={searchQuery}                    
                    />                 
                </div>            
            </div>  

            {showChangePassword && (
                <ChangePasswordDialog
                    onSuccess={handleChangePassword}
                    onCancel={() => setShowChangePassword(false)}
                />
            )}
        </>
    );
}