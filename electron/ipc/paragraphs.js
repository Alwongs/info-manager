import { encrypt, decrypt, isMasterPasswordSet } from './encryption.js';

export const registerParagraphHandlers = (ipcMain, db) => {
    if (!db) {
        throw new Error('База данных не передана в обработчики параграфов');
    }

    const isPasswordCategory = (noteId) => {
        const stmt = db.prepare(`
            SELECT c.name 
            FROM categories c
            JOIN notes n ON n.category_id = c.id
            WHERE n.id = ?
        `);
        const result = stmt.get(Number(noteId));
        console.log(result.name.toLowerCase());
        return result && result.name.toLowerCase() === 'passwords';
    };

    ipcMain.handle('paragraph:getByNote', (event, id) => {
        if (!id || isNaN(Number(id))) {
            return [];
        }
        const stmt = db.prepare(`
            SELECT 
                id,
                note_id,
                title,
                content,  -- зашифрованный или нет
                is_encrypted,
                created_at,
                updated_at
            FROM paragraphs 
            WHERE note_id = ? 
            ORDER BY created_at ASC
        `);
        const paragraphs = stmt.all(Number(id));
        return paragraphs;
    });

    ipcMain.handle('paragraph:decrypt', (event, id) => {
        // Проверяем, установлен ли пароль в памяти
        if (!isMasterPasswordSet()) {
            throw new Error('MASTER_PASSWORD_REQUIRED');
        }        
        
        const stmt = db.prepare(`
            SELECT id, content, is_encrypted 
            FROM paragraphs 
            WHERE id = ?
        `);
        const paragraph = stmt.get(id);
        
        if (!paragraph) {
            throw new Error('Параграф не найден');
        }
        
        if (!paragraph.is_encrypted) {
            return { id: paragraph.id, content: paragraph.content };
        }
        
        try {
            const decryptedContent = decrypt(paragraph.content);
            return { 
                id: paragraph.id, 
                content: decryptedContent 
            };
        } catch (error) {
            console.error('Ошибка расшифровки:', error);
            throw new Error('Неверный пароль');
        }
    });

    ipcMain.handle('paragraph:add', (event, noteId, title = '', content) => {
        if (!noteId || !content) {
            throw new Error('ID заметки и содержимое обязательны');
        }

        let contentToSave = content;
        let isEncrypted = 0;

        if (isPasswordCategory(noteId)) {
            contentToSave = encrypt(content);
            isEncrypted = 1;
        }

        const stmt = db.prepare(`
            INSERT INTO paragraphs (note_id, title, content, is_encrypted) 
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(Number(noteId), title, contentToSave, isEncrypted);

        const selectStmt = db.prepare(`
            SELECT 
                id,
                note_id,
                title,
                content,
                is_encrypted,
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

        // Получаем note_id для проверки категории
        const noteStmt = db.prepare('SELECT note_id FROM paragraphs WHERE id = ?');
        const paragraph = noteStmt.get(id);
        
        if (!paragraph) {
            throw new Error('Параграф не найден');
        }

        let contentToSave = content;
        let isEncrypted = 0;

        // Если категория "passwords" - шифруем
        if (isPasswordCategory(paragraph.note_id)) {
            contentToSave = encrypt(content);
            isEncrypted = 1;
        }

        const stmt = db.prepare(`
            UPDATE paragraphs 
            SET title = ?, content = ?, is_encrypted = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        const info = stmt.run(title.trim(), contentToSave, isEncrypted, id);
        return info.changes > 0;
    });

    ipcMain.handle('paragraph:delete', (event, id) => {
        const stmt = db.prepare('DELETE FROM paragraphs WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    });
};










// export const registerParagraphHandlers = (ipcMain, db) => {
//     if (!db) {
//         throw new Error('База данных не передана в обработчики параграфов');
//     }

//     ipcMain.handle('paragraph:getByNote', (event, id) => {
//         if (!id || isNaN(Number(id))) {
//             return [];
//         }

//         const stmt = db.prepare(`
//             SELECT 
//                 id,
//                 note_id,
//                 title,
//                 content,
//                 created_at,
//                 updated_at
//             FROM paragraphs 
//             WHERE note_id = ? 
//             ORDER BY created_at ASC
//         `);
//         return stmt.all(Number(id));
//     });

//     ipcMain.handle('paragraph:add', (event, noteId, title = '', content) => {
//         if (!noteId || !content) {
//             throw new Error('ID заметки и содержимое обязательны');
//         }

//         const stmt = db.prepare(`
//             INSERT INTO paragraphs (note_id, title, content) 
//             VALUES (?, ?, ?)
//         `);
//         const info = stmt.run(Number(noteId), title, content);

//         const selectStmt = db.prepare(`
//             SELECT 
//                 id,
//                 note_id,
//                 title,
//                 content,
//                 created_at,
//                 updated_at
//             FROM paragraphs 
//             WHERE id = ?
//         `);
//         return selectStmt.get(info.lastInsertRowid);
//     });


//     ipcMain.handle('paragraph:update', (event, id, title, content = '') => {
//         if (!id) {
//             throw new Error('ID параграфа обязателен');
//         }
//         if (!title || !title.trim()) {
//             throw new Error('Название параграфа обязательно');
//         }       
//         const stmt = db.prepare(`
//             UPDATE paragraphs 
//             SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
//             WHERE id = ?
//         `);
//         const info = stmt.run(
//             title.trim(), 
//             content || '', 
//             id
//         );
//         return info.changes > 0;
//     });



//     ipcMain.handle('paragraph:delete', (event, id) => {
//         const stmt = db.prepare('DELETE FROM paragraphs WHERE id = ?');
//         const info = stmt.run(id);
//         return info.changes;
//     });
// };