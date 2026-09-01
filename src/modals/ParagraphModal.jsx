import React, { useState, useEffect, useRef } from 'react';
import styles from './ParagraphModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ParagraphModal({ visible, onClose, onSave, onAdd, onUpdate, editingItem, noteId, noteTitle = '' }) {
    const inputRef = useRef(null);
    const [title, setTitle] = useState('');  
    const [content, setContent] = useState(''); 

    // console.log(onUpdate, editingItem)

    useEffect(() => {
        if (visible && editingItem) {
            setTitle(editingItem.title || '');
            setContent(editingItem.content || '');
        } else {
            setTitle('');
            setContent('');
        }
    }, [visible, editingItem]); 

    useEffect(() => {
        if (visible) {
            setTimeout(() => inputRef.current?.focus(), 400);
        }
    }, [visible]);  



    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();
        if (!trimmedTitle) {
            alert('Введите заголовок параграфа');
            return;
        }       
        if (editingItem && onUpdate) {
            onUpdate(editingItem.id, trimmedTitle, trimmedContent);
        } else {
            onAdd(noteId, trimmedTitle, trimmedContent);
        }

        setTitle('');
        setContent('');
        onClose();
    };    



    const handleCloseModal = (e) => {
        e.preventDefault();
        setTitle('');
        setContent('');
        onClose();
    }

    if (!visible) return;

    const isEditing = !!editingItem;
    const formTitle = isEditing ? 'Редактирование' : 'Новый параграф';
    const buttonText = isEditing ? 'Сохранить' : 'Добавить';
    const placeholder = isEditing ? 'Введите новое название' : 'Введите название';       
    
    return (
        <div className={styles['wrapper']}>
            <div className={styles['modal']}>
                <div className={styles['modal-top-panel']}>
                    <button onClick={handleCloseModal}>❌</button>
                </div>

                <h2 className={styles['modal-title']}>
                    "{noteTitle}"
                </h2>

                <h6 className={styles['modal-subtitle']}>
                    {formTitle}
                </h6>                

                <form
                    className={styles['modal-form']}
                    onSubmit={handleSubmit}
                >
                    <div className={styles['input-container']}>
                        <input
                            ref={inputRef}
                            id="paragraphModalInput"
                            className={styles['input-field']} 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите заголовок"
                        />
                    </div>

                    <div className={styles['textarea-container']}>
                        <textarea
                            id="paragraphModalTextarea"
                            className={styles['textarea-field']}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Введите содержимое параграфа..."
                            rows={6}
                        />
                    </div>                    
                 

                    <div className={styles['btn-container']}>
                        <button
                            className={styles['submit-btn']} 
                            type="submit"
                        >
                            Сохранить
                        </button>                        
                    </div>
                </form>
            </div>
        </div>
    );
}