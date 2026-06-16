import { useState, useEffect, useRef } from 'react';

export default function NoteForm({ onAdd }) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleAdd = () => {
        if (!inputValue.trim()) return;
        onAdd(inputValue.trim());
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="add-record-section">
            <input
                ref={inputRef}
                className="input-field"
                type="text"
                placeholder="Введите запись..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className="add-btn" onClick={handleAdd}>
                + Добавить запись
            </button>
        </div>
    );
}