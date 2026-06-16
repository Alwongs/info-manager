export default function NoteList({ items, onDelete }) {
    return (
        <ul className="record-list">
            {items.length === 0 ? (
                <p className="empty-message">Нет записей в этой категории</p>
            ) : (
                items.map(item => (
                    <li key={item.id} className="record-item">
                        <span>{item.text}</span>
                        <button
                            className="delete-btn"
                            onClick={() => onDelete(item.id)}
                        >
                            ×
                        </button>
                    </li>
                ))
            )}
        </ul>
    );
}