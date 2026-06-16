import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ categories, onAddCategory, activePage }) {
    const navigate = useNavigate();
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        if (!newCategory.trim()) return;
        onAddCategory(newCategory.trim());
        setNewCategory('');
    };

    const handleNavigate = (path) => {
        navigate(path);
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
                        className="sidebar-item"
                        onClick={() => navigate(`/categories/${cat.id}`)}
                    >
                        {cat.name}
                    </li>
                ))}
            </ul>

            <div className="sidebar-nav">
                <button
                    className="sidebar-nav-link"
                    onClick={() => handleNavigate('/')}
                    style={{ backgroundColor: activePage === '/' ? '#4ecca3' : 'transparent' }}
                >
                    🏠 Главная
                </button>
                {/* <button
                    className="sidebar-nav-link"
                    onClick={() => handleNavigate('/categories')}
                    style={{ backgroundColor: activePage === '/categories' ? '#4ecca3' : 'transparent' }}
                >
                    📋 Категории
                </button> */}
                <button
                    className="sidebar-nav-link"
                    onClick={() => handleNavigate('/archive')}
                    style={{ backgroundColor: activePage === '/archive' ? '#4ecca3' : 'transparent' }}
                >
                    📁 Архив
                </button>
                <button
                    className="sidebar-nav-link"
                    onClick={() => handleNavigate('/settings')}
                    style={{ backgroundColor: activePage === '/settings' ? '#4ecca3' : 'transparent' }}
                >
                    ⚙️ Настройки
                </button>
            </div>
        </aside>
    );
}