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

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isPasswordSet, setIsPasswordSet] = useState(false);
    const [showMasterPassword, setShowMasterPassword] = useState(false);

    // Состояния для диалога смены пароля
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changeError, setChangeError] = useState('');    

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
        handleUpdateParagraph, // ------ new
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
            // Если есть → просто открываем приложение
        });
    }, []);

    // Функция смены пароля
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setChangeError('');
        
        if (newPassword.length < 4) {
            setChangeError('Минимум 4 символа');
            return;
        }
        if (newPassword !== confirmPassword) {
            setChangeError('Пароли не совпадают');
            return;
        }
        
        try {
            const result = await window.electronAPI.changePassword(oldPassword, newPassword);
            alert(`✅ Пароль изменен! Перешифровано ${result.reencrypted} параграфов`);
            setShowChangePassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setChangeError(err.message);
        }
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
                    <ColumnHeader title="Категории" onAdd={openCategoryModal} />
                    <CategoryList
                        categories={categories}
                        onEdit={openEditCategoryModal}
                        onDelete={handleDeleteCategory}
                        onSelectCategory={handleSelectCategory}
                        selectedCategoryId={selectedCategoryId}
                    />                   
                </div>  

                <div className={styles['notes-column']}>
                    <ColumnHeader title="Заметки" onAdd={openNoteModal} />
                    <NoteList
                        notes={notes}
                        onEdit={openEditNoteModal}
                        onDelete={handleDeleteNote}
                        onSelectNote={handleSelectNote}
                        selectedNoteId={selectedNoteId}
                        searchQuery={searchQuery}  // ← Передаём
                    /> 
                </div>

                <div className={styles['detail-column']}>
                    <ColumnHeader title="Записи заметок" onAdd={openParagraphModal} />
                    <ParagraphList
                        paragraphs={paragraphs}
                        onEdit={openEditParagraphModal}
                        onDelete={handleDeleteParagraph}
                        searchQuery={searchQuery}  // ← Передаём
                    />                 
                </div>            
            </div>  


            {/* Диалог смены пароля */}
            {showChangePassword && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white', padding: 30, borderRadius: 10, width: 340
                    }}>
                        <h2 style={{ textAlign: 'center' }}>🔑 Сменить пароль</h2>
                        
                        <form onSubmit={handleChangePassword}>
                            <input
                                // type="password"
                                placeholder="Текущий пароль"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 5 }}
                                required
                            />
                            <input
                                // type="password"
                                placeholder="Новый пароль (мин. 4 символа)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 5 }}
                                required
                            />
                            <input
                                // type="password"
                                placeholder="Повторите новый пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 5 }}
                                required
                            />
                            
                            {changeError && <p style={{ color: 'red', fontSize: 14 }}>{changeError}</p>}
                            
                            <button type="submit" style={{
                                width: '100%', padding: 10,
                                background: '#007bff', color: 'white',
                                border: 'none', borderRadius: 5, cursor: 'pointer'
                            }}>
                                Сменить пароль
                            </button>
                            <button type="button" onClick={() => {
                                setShowChangePassword(false);
                                setChangeError('');
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                            }} style={{
                                width: '100%', padding: 10, marginTop: 10,
                                background: '#6c757d', color: 'white',
                                border: 'none', borderRadius: 5, cursor: 'pointer'
                            }}>
                                Отмена
                            </button>
                        </form>
                    </div>
                </div>
            )}                         
        </>
    );
}