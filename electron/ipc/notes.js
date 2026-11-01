export const registerNoteHandlers = (ipcMain, db) => {
    if (!db) {
        throw new Error('База данных не передана в обработчики заметок');
    }

    ipcMain.handle('note:getAll', () => {
        const rows = db.prepare('SELECT id, title, category_id FROM notes').all();
        return rows;
    });

    ipcMain.handle('note:getByCategory', (event, categoryId) => {
        if (!categoryId) {
            console.warn('⚠️ categoryId не передан');
            return [];
        }
        const stmt = db.prepare('SELECT id, title, content, category_id, created_at, updated_at FROM notes WHERE category_id = ? ORDER BY title');
        return stmt.all(categoryId);
    });

    ipcMain.handle('note:add', (event, title, categoryId, content = '') => {
        if (!title || !title.trim()) {
            throw new Error('Название заметки обязательно');
        }
        if (!categoryId) {
            throw new Error('Категория обязательна');
        }
        const stmt = db.prepare(`INSERT INTO notes (title, category_id, content) VALUES (?, ?, ?)`);
        const info = stmt.run(title.trim(), Number(categoryId), content || '');
        return {
            id: info.lastInsertRowid,
            title: title.trim(),
            category_id: Number(categoryId),
            content: content || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    });

    ipcMain.handle('note:update', (event, id, title, categoryId, content = '') => {
        if (!id) {
            throw new Error('ID заметки обязателен');
        }
        if (!title || !title.trim()) {
            throw new Error('Название заметки обязательно');
        }
        if (!categoryId) {
            throw new Error('Категория обязательна');
        }        
        const stmt = db.prepare(`
            UPDATE notes 
            SET title = ?, category_id = ?, content = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        const info = stmt.run(
            title.trim(), 
            Number(categoryId), 
            content || '', 
            id
        );
        return info.changes > 0;
    }); 
    
    ipcMain.handle('note:delete', (event, id) => {
        const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    });
};