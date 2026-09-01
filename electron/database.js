import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let dbInstance = null;

/**
 * Инициализирует базу данных и создает таблицы.
 * @returns {Database} Экземпляр базы данных
 */
export const initDatabase = () => {
    if (dbInstance) {
        console.log('База данных уже инициализирована.');
        return dbInstance;
    }

    const dbPath = path.join(app.getPath('userData'), 'app-data.db');

    dbInstance = new Database(dbPath, { verbose: console.log });

    // ✅ ВКЛЮЧАЕМ РЕГИСТРОНЕЗАВИСИМЫЙ ПОИСК ДЛЯ ВСЕЙ БД
    dbInstance.prepare('PRAGMA case_sensitive_like = OFF').run();   

    // ✅ Проверяем PRAGMA (безопасно)
    try {
        const pragmaCheck = dbInstance.prepare('PRAGMA case_sensitive_like').get();
    } catch (error) {
    }

    dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT DEFAULT '#666666',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        )
    `);

    dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS paragraphs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER NOT NULL,
            title TEXT DEFAULT '',
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
        )
    `);  

    try {
        dbInstance.exec(`ALTER TABLE paragraphs ADD COLUMN is_encrypted INTEGER DEFAULT 0`);
        console.log('✅ Поле is_encrypted добавлено в таблицу paragraphs');
    } catch (e) {
        console.info('The field is_encrypted is already exist')
    }    

    dbInstance.exec(`
        CREATE INDEX IF NOT EXISTS idx_notes_category_id ON notes(category_id);
        CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_paragraphs_note_id ON paragraphs(note_id);
    `);

    console.log('✅ База данных успешно инициализирована.');

    return dbInstance;
};