import React from 'react';
import styles from './ParagraphList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ParagraphItem from '../../components/ParagraphItem/ParagraphItem';

export default function ParagraphList({ paragraphs, onDelete, onEdit, searchQuery }) {


    const handleDeleteClick = (paragraphId, paragraphTitle) => {
        const isConfirmed = window.confirm(`Вы уверены, что хотите удалить параграф "${paragraphTitle}"?`);
        if (isConfirmed) {
            onDelete(paragraphId);
        }
    };

    return (
        <ul className={styles['paragraph-list']}>
            {paragraphs.map((paragraph) => (
                <ParagraphItem
                    key={paragraph.id}
                    paragraph={paragraph}
                    onDelete={handleDeleteClick}
                    onEdit={onEdit}
                    searchQuery={searchQuery}  // ← Передаём
                />
            ))}
        </ul>               
    );
};
