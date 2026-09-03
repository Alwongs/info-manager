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
                    note_id,  -- ✅ добавил
                    title, 
                    content, 
                    is_encrypted,
                    created_at, 
                    updated_at
                FROM paragraphs 
                WHERE (
                    -- ✅ Если зашифрован — ищем ТОЛЬКО по заголовку
                    (is_encrypted = 1 AND title LIKE ? OR title LIKE ? OR title LIKE ?)
                    OR
                    -- ✅ Если НЕ зашифрован — ищем по заголовку ИЛИ по content
                    (is_encrypted = 0 AND (title LIKE ? OR content LIKE ? OR title LIKE ? OR content LIKE ? OR title LIKE ? OR content LIKE ?))
                )
                ORDER BY created_at DESC
            `);
            
            return stmt.all(
                searchLower, searchUpper, searchCapitalized,  // для зашифрованных (только title)
                searchLower, searchLower,                    // для незашифрованных (title + content)
                searchUpper, searchUpper,
                searchCapitalized, searchCapitalized
            );
        } catch (error) {
            console.error('❌ Ошибка поиска по параграфам:', error);
            return [];
        }
    });



    // ipcMain.handle('paragraph:getByPhrase', (event, phrase) => {
    //     if (!phrase || !phrase.trim()) {
    //         return [];
    //     }
    //     try {
    //         const trimmed = phrase.trim();
    //         const searchLower = `%${trimmed.toLowerCase()}%`;
    //         const searchUpper = `%${trimmed.toUpperCase()}%`;
    //         const searchCapitalized = `%${trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()}%`;
            
    //         const stmt = db.prepare(`
    //             SELECT 
    //                 id, 
    //                 title, 
    //                 content, 
    //                 is_encrypted,
    //                 created_at, 
    //                 updated_at
    //             FROM paragraphs 
    //             WHERE title LIKE ? 
    //             OR content LIKE ?
    //             OR title LIKE ? 
    //             OR content LIKE ?
    //             OR title LIKE ?
    //             OR content LIKE ?
    //             ORDER BY created_at DESC
    //         `);
            
    //         return stmt.all(
    //             searchLower, searchLower,
    //             searchUpper, searchUpper,
    //             searchCapitalized, searchCapitalized
    //         );
    //     } catch (error) {
    //         console.error('❌ Ошибка поиска по параграфам:', error);
    //         return [];
    //     }
    // });
};