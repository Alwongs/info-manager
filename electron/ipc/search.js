export const registerSearchHandlers = (ipcMain, db) => {
    if (!db) {
        throw new Error('База данных не передана в обработчики поиска');
    }

    // Поиск по заметкам
    ipcMain.handle('note:getByPhrase', (event, phrase) => {
        if (!phrase || !phrase.trim()) {
            return [];
        }
        try {
            const trimmed = phrase.trim();
            const searchLower = `%${trimmed.toLowerCase()}%`;
            const searchUpper = `%${trimmed.toUpperCase()}%`;
            const searchCapitalized = `%${trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()}%`;
            
            const stmt = db.prepare(`
                SELECT 
                    id, 
                    title, 
                    content, 
                    created_at, 
                    updated_at
                FROM notes 
                WHERE title LIKE ? 
                OR content LIKE ?
                OR title LIKE ? 
                OR content LIKE ?
                OR title LIKE ?
                OR content LIKE ?
                ORDER BY created_at DESC
            `);
            
            return stmt.all(
                searchLower, searchLower,
                searchUpper, searchUpper,
                searchCapitalized, searchCapitalized
            );
        } catch (error) {
            console.error('❌ Ошибка поиска по заметкам:', error);
            return [];
        }
    });

    // Поиск по параграфам
    ipcMain.handle('paragraph:getByPhrase', (event, phrase) => {
        if (!phrase || !phrase.trim()) {
            return [];
        }
        try {
            const trimmed = phrase.trim();
            const searchLower = `%${trimmed.toLowerCase()}%`;
            const searchUpper = `%${trimmed.toUpperCase()}%`;
            const searchCapitalized = `%${trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()}%`;
            
            const stmt = db.prepare(`
                SELECT 
                    id, 
                    title, 
                    content, 
                    created_at, 
                    updated_at
                FROM paragraphs 
                WHERE title LIKE ? 
                OR content LIKE ?
                OR title LIKE ? 
                OR content LIKE ?
                OR title LIKE ?
                OR content LIKE ?
                ORDER BY created_at DESC
            `);
            
            return stmt.all(
                searchLower, searchLower,
                searchUpper, searchUpper,
                searchCapitalized, searchCapitalized
            );
        } catch (error) {
            console.error('❌ Ошибка поиска по параграфам:', error);
            return [];
        }
    });
};