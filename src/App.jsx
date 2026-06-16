import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Archive from './pages/Archive';
import Settings from './pages/Settings';

export default function App() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [activePage, setActivePage] = useState('/');
    const location = useLocation();

    useEffect(() => {
        const savedCategories = localStorage.getItem('infoManagerCategories');
        if (savedCategories) setCategories(JSON.parse(savedCategories));

        const savedItems = localStorage.getItem('infoManagerItems');
        if (savedItems) setItems(JSON.parse(savedItems));
    }, []);

    useEffect(() => {
        setActivePage(location.pathname);
    }, [location]);

    const handleAddCategory = (name) => {
        const newCategory = { id: Date.now(), name };
        const updated = [...categories, newCategory];
        setCategories(updated);
        localStorage.setItem('infoManagerCategories', JSON.stringify(updated));
    };

    const handleAddItem = (text, categoryId) => {
        const newItem = { id: Date.now(), text, categoryId: categoryId || null };
        const updated = [newItem, ...items];
        setItems(updated);
        localStorage.setItem('infoManagerItems', JSON.stringify(updated));
    };

    const handleDeleteItem = (id) => {
        const updated = items.filter(item => item.id !== id);
        setItems(updated);
        localStorage.setItem('infoManagerItems', JSON.stringify(updated));
    };

    return (
        <div className="app-layout">
            <Sidebar
                categories={categories}
                onAddCategory={handleAddCategory}
                activePage={activePage}
            />
            <div className="main-content">
                <Routes>
                    {/* Главная — без категории (или можно убрать) */}
                    <Route path="/" element={
                        <Home
                            categories={categories}
                            items={items}
                            onAddItem={handleAddItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    } />

                    {/* Страница конкретной категории */}
                    <Route path="/categories/:id" element={
                        <Home
                            categories={categories}
                            items={items}
                            onAddItem={handleAddItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    } />

                    {/* Страницы управления и настроек */}
                    <Route path="/categories" element={<Categories categories={categories} onAddCategory={handleAddCategory} />} />
                    <Route path="/archive" element={<Archive />} />
                    <Route path="/settings" element={<Settings />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}