import React, { useState, useEffect, useRef } from 'react';
import styles from './NoteModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function NoteModal({ visible, onClose, onAdd, categories = [], selectedCategoryId = '', onUpdate = null, editingItem = null }) {
    const inputRef = useRef(null);
    const [title, setTitle] = useState('');
    const [_selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryId || '');

    useEffect(() => {
        if (visible && editingItem) {
            setTitle(editingItem.title || '');
            setSelectedCategoryId(String(editingItem.category_id || ''));
        } else {
            setTitle('');
            setSelectedCategoryId(selectedCategoryId || '');
        }
    }, [visible, editingItem]);    

    useEffect(() => {
        setSelectedCategoryId(selectedCategoryId);
    }, [selectedCategoryId]);    

    useEffect(() => {
        if (visible) {
            setTimeout(() => inputRef.current?.focus(), 400);
        }
    }, [visible]);  



    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            alert('Введите название');
            return;
        }
        if (!_selectedCategoryId) {
            alert('Выберите категорию');
            return;
        }        
        if (editingItem && onUpdate) {
            onUpdate(editingItem.id, trimmedTitle, Number(_selectedCategoryId));
        } else {
            onAdd(trimmedTitle, Number(_selectedCategoryId));
        }
        setSelectedCategoryId('');
        onClose();
    };    


    
    const handleCloseModal = (e) => {
        e.preventDefault();
        setTitle('');
        setSelectedCategoryId('');
        onClose();
    }

    if (!visible) return null;

    const isEditing = !!editingItem;
    const formTitle = isEditing ? 'Редактирование' : '📂 Новая заметка';
    const buttonText = isEditing ? 'Сохранить' : 'Добавить';
    const placeholder = isEditing ? 'Введите новое название' : 'Введите название';    
    
    return (
        <div className={styles['wrapper']}>
            <div className={styles['modal']}>
                <div className={styles['modal-top-panel']}>
                    <button onClick={handleCloseModal}>❌</button>
                </div>

                <header className={styles['header']}>
                    <span className={styles['title']}>{title}</span>
                </header>

                <form
                    className={styles['modal-form']}
                    onSubmit={handleSubmit}
                >
                    <div className={styles['input-container']}>
                        <input
                            ref={inputRef}
                            id="noteModalInput"
                            className={styles['input-field']} 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>

                    <div className={styles['input-container']}>
                        <select
                            id="noteModalSelect"
                            className={styles['select-field']}
                            value={_selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            <option className={styles['select-label-option']} value="">Выберите категорию</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    📂 {category.name}
                                </option>
                            ))}
                        </select>
                    </div>                    

                    <div className={styles['btn-container']}>
                        <button
                            className={styles['submit-btn']} 
                            type="submit"
                        >
                            {buttonText}
                        </button>                        
                    </div>
                </form>
            </div>
        </div>
    );
}