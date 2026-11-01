import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './ParagraphItem.module.css';
import { highlightText } from '../../utils/highlightText';

export default function ParagraphItem({ paragraph, onDelete, onEdit, searchQuery = '' }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const highlightedTitle = highlightText(paragraph.title, searchQuery);
    const highlightedContent = highlightText(paragraph.content, searchQuery);

    const handleEditClick = async () => {
        onEdit({
            ...paragraph
        });
    };    

    return (
        <li className={styles['item']}>
            <header className={styles['item-header']}>
                <h3 className={styles['item-title']}>
                    ➡️<span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
                </h3>
            </header>

            <div
                className={styles['item-content']}
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />

            <div className={styles['item-actions']}>
                <button
                    onClick={handleEditClick}
                    className={`${styles['item-btn']} ${styles['item-btn-edit']}`}
                    title="Редактировать параграф"
                >
                    Изменить
                </button>
                <button
                    onClick={() => onDelete(paragraph.id, paragraph.title)}
                    className={`${styles['item-btn']} ${styles['item-btn-del']}`}
                    title="Удалить параграф"
                >
                    Удалить
                </button>
            </div>
        </li>
    );
}