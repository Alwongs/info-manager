import { useState, useEffect } from 'react';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    const loadCategories = async () => {
        try {
            const data = await window.electronAPI.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    };

    const handleAddCategory = async (name) => {
        try {
            const newCategory = await window.electronAPI.addCategory(name);
            setCategories(prev => [newCategory, ...prev]);
            return newCategory;
        } catch (error) {
            console.error("Ошибка при добавлении категории:", error);
            alert("Не удалось добавить категорию.");
            throw error;
        }
    };

    const handleEditCategory = async (id, name) => {
        try {
            // Если есть API для обновления
            await window.electronAPI.updateCategory(id, name);
            
            // Обновляем локальное состояние
            setCategories(prev => prev.map(cat => 
                cat.id === id ? { ...cat, name } : cat
            ));
        } catch (error) {
            console.error("Ошибка при редактировании:", error);
            alert("Не удалось обновить категорию.");
            throw error;
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await window.electronAPI.deleteCategory(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
            if (selectedCategoryId === id) {
                setSelectedCategoryId('');
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Не удалось удалить категорию.");
        }
    };

    const handleSelectCategory = (id) => {
        setSelectedCategoryId(id);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return {
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        handleAddCategory,
        handleEditCategory,
        handleDeleteCategory,
        handleSelectCategory,
        loadCategories,
    };
};