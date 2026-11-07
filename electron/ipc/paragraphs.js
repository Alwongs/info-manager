export const registerParagraphHandlers = (ipcMain, db) => {
    if (!db) {
        throw new Error('База данных не передана в обработчики параграфов');
    }

    ipcMain.handle('paragraph:getByNote', (event, id) => {
        if (!id || isNaN(Number(id))) {
            return [];
        }
        const stmt = db.prepare(`
            SELECT 
                id,
                note_id,
                title,
                content,
                created_at,
                updated_at
            FROM paragraphs 
            WHERE note_id = ? 
            ORDER BY title
        `);
        const paragraphs = stmt.all(Number(id));
        return paragraphs;
    });

    ipcMain.handle('paragraph:add', (event, noteId, title = '', content) => {
        if (!noteId || !content) {
            throw new Error('ID заметки и содержимое обязательны');
        }

        const stmt = db.prepare(`
            INSERT INTO paragraphs (note_id, title, content) 
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(Number(noteId), title, content);

        const selectStmt = db.prepare(`
            SELECT 
                id,
                note_id,
                title,
                content,
                created_at,
                updated_at
            FROM paragraphs 
            WHERE id = ?
        `);
        const newParagraph = selectStmt.get(info.lastInsertRowid);
        
        if (newParagraph.is_encrypted) {
            newParagraph.content = decrypt(newParagraph.content);
        }
        
        return newParagraph;
    });

    ipcMain.handle('paragraph:update', (event, id, title, content = '') => {
        if (!id) {
            throw new Error('ID параграфа обязателен');
        }
        if (!title || !title.trim()) {
            throw new Error('Название параграфа обязательно');
        }

        const noteStmt = db.prepare('SELECT note_id FROM paragraphs WHERE id = ?');
        const paragraph = noteStmt.get(id);
        
        if (!paragraph) {
            throw new Error('Параграф не найден');
        }

        let contentToSave = content;

        const updateStmt = db.prepare(`
            UPDATE paragraphs 
            SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        const info = updateStmt.run(title.trim(), contentToSave, id);
        
        if (info.changes === 0) {
            throw new Error('Параграф не найден');
        }

        const selectStmt = db.prepare(`
            SELECT 
                id,
                note_id,
                title,
                content,
                created_at,
                updated_at
            FROM paragraphs 
            WHERE id = ?
        `);
        const result = selectStmt.get(id);
        
        return result;
    });

    ipcMain.handle('paragraph:delete', (event, id) => {
        const stmt = db.prepare('DELETE FROM paragraphs WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    });
};

