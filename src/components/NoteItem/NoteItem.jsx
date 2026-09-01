import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Импортируем компонент иконки
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';    // Импортируем конкретную иконку
import styles from './NoteItem.module.css';
import { highlightText } from '../../utils/highlightText'; // ← Добавляем

export default function NoteItem({ note, onEdit, onDelete, onSelect, selectedNoteId, searchQuery = '' }) {

    const handleClick = () => {
        if (onSelect) {
            onSelect(note.id);
        }
    };    

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(note);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(note.id, note.title);
        }
    };    

    // ✅ Подсвечиваем заголовок заметки
    const highlightedTitle = highlightText(note.title, searchQuery);    

    return (
        <li 
            className={`${styles['item']} ${note.id === selectedNoteId ? styles['selected'] : ''}`} 
            onClick={handleClick}
        >          
            <div 
                className={styles['item-title']}
                title={note.title} // ✅ Подсказка при наведении
            >
                <span className="icon">📝 </span>
                {/* <span className="text">{note.title}</span> */}
                {/* ✅ Подсвеченный заголовок */}
                <span 
                    className="text"
                    dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                />                
            </div>

            <div className={styles['item-actions']}>
                <button
                    onClick={handleEditClick}
                    className={`${styles['item-btn']} ${styles['item-btn-edit']}`}
                    title="Редактировать категорию"
                >
                    <FontAwesomeIcon icon={faPen} />
                </button>                
                <button
                    onClick={handleDeleteClick}
                    className={`${styles['item-btn']} ${styles['item-btn-del']}`}
                    title="Удалить заметку"
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </div>                           
        </li>
    );
}