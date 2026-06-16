import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';

export default function Home({ category, items, onAddItem, onDeleteItem }) {
    return (
        <main className="home-page">
            {!category ? (
                <div className="no-category">
                    <p>Выберите категорию слева</p>
                </div>
            ) : (
                <>
                    <h1 className="page-title">{category.name}</h1>
                    <NoteForm onAdd={onAddItem} />
                    <NoteList items={items} onDelete={onDeleteItem} />
                </>
            )}
        </main>
    );
}