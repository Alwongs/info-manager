import React from 'react';
import styles from './CategoryList.module.css';
import CategoryItem from '../../components/CategoryItem/CategoryItem';

export default function CategoryList({ categories, onEdit, onDelete, onSelectCategory, selectedCategoryId }) {
    
    const handleDeleteClick = (categoryId, categoryName) => {
        const isConfirmed = window.confirm(`Вы уверены, что хотите удалить категорию "${categoryName}"?`);
        if (isConfirmed) {
            onDelete(categoryId);
        }
    };

    return (
        <ul className={styles['category-list']}>
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    onEdit={onEdit}
                    onDelete={handleDeleteClick}
                    onSelect={onSelectCategory}
                    selectedCategoryId={selectedCategoryId}
                />
            ))}
        </ul>
    );
}