import styles from './ColumnHeader.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ColumnHeader({ title, onAdd }) {
    return (
        <header className={styles['column-header']}>
            <h1 className={styles['column-header-title']}>{title}</h1>
            <button className={styles['column-header-add-btn']} onClick={onAdd}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
        </header>
    );
}