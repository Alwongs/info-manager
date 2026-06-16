import { useState } from 'react';

export default function Categories({ categories, onAddCategory }) {
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        if (!newCategory.trim()) return;
        onAddCategory(newCategory.trim());
        setNewCategory('');
    };

    return (
        <main className="categories-page">
            <h1 className="page-title">Категории</h1>

            <div className="add-category-section">
                <input
                    className="input-field"
                    type="text"
                    placeholder="Новая категория..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button className="add-btn" onClick={handleAdd}>
                    + Добавить
                </button>
            </div>

            <ul className="category-list">
                {categories.map(cat => (
                    <li key={cat.id} className="category-item">
                        {cat.name}
                    </li>
                ))}
            </ul>
        </main>
    );
}