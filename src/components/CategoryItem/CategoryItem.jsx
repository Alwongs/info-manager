import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import styles from './CategoryItem.module.css';

export default function CategoryItem({ category, onEdit, onDelete, onSelect, selectedCategoryId }) {

    const handleClick = () => {
        if (onSelect) {
            onSelect(category.id);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(category);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(category.id, category.name);
        }
    };

    const isSelected = category.id === selectedCategoryId;

    return (
        <li 
            className={`${styles['item']} ${isSelected ? styles['selected'] : ''}`} 
            onClick={handleClick}
        >
            <div 
                className={styles['item-title']}
                title={category.name} // ✅ Подсказка при наведении
            >
                <span className="icon">📂 </span>
                <span className="text">{category.name}</span>
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
                    title="Удалить категорию"
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>                
            </div>                           
        </li>
    );
}