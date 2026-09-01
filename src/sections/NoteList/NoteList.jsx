import React from 'react';
import styles from './NoteList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import NoteItem from '../../components/NoteItem/NoteItem';

export default function NoteList({ notes, onEdit, onDelete, onSelectNote, selectedNoteId, searchQuery = '' }) {

    const handleDeleteClick = (noteId, noteTitle) => {
        const isConfirmed = window.confirm(`Вы уверены, что хотите удалить заметку "${noteTitle}"?`);
        if (isConfirmed) {
            onDelete(noteId);
        }
    };

    return (
        <ul className={styles['note-list']}>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={handleDeleteClick}
                    onSelect={onSelectNote}
                    selectedNoteId={selectedNoteId}
                    searchQuery={searchQuery}  // ← Передаём
                />
            ))}
        </ul>
    );
};
