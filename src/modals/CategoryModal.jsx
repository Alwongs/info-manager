import React, { useState, useEffect, useRef } from 'react';
import styles from './CategoryModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';

export default function CategoryModal({ visible, onClose, onAdd, onEdit = null, editingItem = null }) {
    const [name, setName] = useState('');
    const inputRef = useRef(null);

    // ✅ Заполняем форму при редактировании
    useEffect(() => {
        if (visible && editingItem) {
            setName(editingItem.name);
        } else {
            setName('');
        }
    }, [visible, editingItem]);

    // ✅ Фокус при открытии
    useEffect(() => {
        if (visible) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [visible]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            alert('Введите название');
            return;
        }

        if (editingItem && onEdit) {
            // ✅ Режим редактирования
            onEdit(editingItem.id, trimmedName);
        } else {
            // ✅ Режим добавления
            onAdd(trimmedName);
        }
        onClose();
    };

    const handleCloseModal = (e) => {
        e.preventDefault();
        setName('');
        onClose();
    };

    if (!visible) return null;

    const isEditing = !!editingItem;
    const title = isEditing ? 'Редактирование' : 'Новая категория';
    const titleIcon = isEditing ? '✏️' : '📂';
    const buttonText = isEditing ? 'Сохранить' : 'Добавить';
    const buttonIcon = isEditing ? faPen : faPlus;
    const placeholder = isEditing ? 'Введите новое название' : 'Введите название';

    return (
        <div className={styles['wrapper']} onClick={handleCloseModal}>
            <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
                <div className={styles['modal-top-panel']}>
                    <button onClick={handleCloseModal}>❌</button>
                </div>

                <header className={styles['header']}>
                    <span className={styles['title']}>{title}</span>
                </header>

                <form className={styles['modal-form']} onSubmit={handleSubmit}>
                    <div className={styles['input-container']}>
                        <input
                            ref={inputRef}
                            id="categoryModalInput"
                            className={styles['input-field']} 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>

                    <div className={styles['btn-container']}>
                        <button className={styles['submit-btn']} type="submit">
                            {buttonText}
                        </button>                        
                    </div>
                </form>
            </div>
        </div>
    );
}