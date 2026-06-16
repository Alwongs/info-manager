import { useState } from 'react';

export default function Sidebar({ categories, selectedCategory, onSelectCategory, onAddCategory }) {
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        if (!newCategory.trim()) return;
        onAddCategory(newCategory.trim());
        setNewCategory('');
    };

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Категории</h2>

            <div className="sidebar-add-section">
                <input
                    className="sidebar-input"
                    type="text"
                    placeholder="Новая категория..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button className="sidebar-add-btn" onClick={handleAdd}>+</button>
            </div>

            <ul className="sidebar-list">
                {categories.map(cat => (
                    <li
                        key={cat.id}
                        className={`sidebar-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat)}
                    >
                        {cat.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
}