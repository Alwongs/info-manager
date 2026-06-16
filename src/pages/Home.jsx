import { useState } from 'react';
import { useParams } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';

export default function Home({ categories, items, onAddItem, onDeleteItem }) {
    const { id } = useParams(); // ← теперь id, а не categoryId

    const category = categories.find(cat => String(cat.id) === id) || null;

    return (
        <main className="home-page">
            {!category ? (
                <div className="no-category">
                    <p>Выберите категорию слева</p>
                </div>
            ) : (
                <>
                    <h1 className="page-title">{category.name}</h1>
                    <NoteForm onAdd={(text) => onAddItem(text, category.id)} />
                    <NoteList items={items.filter(item => item.categoryId === category.id)} onDelete={onDeleteItem} />
                </>
            )}
        </main>
    );
}