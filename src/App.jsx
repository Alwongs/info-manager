import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Archive from './pages/Archive';
import Settings from './pages/Settings';

export default function App() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const savedCategories = localStorage.getItem('infoManagerCategories');
        if (savedCategories) setCategories(JSON.parse(savedCategories));

        const savedItems = localStorage.getItem('infoManagerItems');
        if (savedItems) setItems(JSON.parse(savedItems));
    }, []);

    const handleAddCategory = (name) => {
        const newCategory = { id: Date.now(), name };
        const updated = [...categories, newCategory];
        setCategories(updated);
        localStorage.setItem('infoManagerCategories', JSON.stringify(updated));
    };

    const handleSelectCategory = (category) => setSelectedCategory(category);

    const handleAddItem = (text) => {
        const newItem = { id: Date.now(), text, categoryId: selectedCategory?.id || null };
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
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onAddCategory={handleAddCategory}
            />
            <div className="main-content">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                category={selectedCategory}
                                items={items.filter(item => item.categoryId === selectedCategory?.id)}
                                onAddItem={handleAddItem}
                                onDeleteItem={handleDeleteItem}
                            />
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <Categories
                                categories={categories}
                                onAddCategory={handleAddCategory}
                            />
                        }
                    />
                    <Route
                        path="/archive"
                        element={<Archive />}
                    />
                    <Route
                        path="/settings"
                        element={<Settings />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}