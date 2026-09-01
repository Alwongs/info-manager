export const registerCategoryHandlers = (ipcMain, db) => {
    if (!db) {
        throw new Error('База данных не передана в обработчики категорий');
    }

    ipcMain.handle('category:getAll', () => {
        const rows = db.prepare('SELECT id, name FROM categories').all();
        return rows;
    });

    ipcMain.handle('category:add', (event, name) => {
        const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
        const info = stmt.run(name);
        return { id: info.lastInsertRowid, name: name };
    });

    ipcMain.handle('category:update', (event, id, name) => {
        const stmt = db.prepare('UPDATE categories SET name = ? WHERE id = ?');
        const info = stmt.run(name, id);
        return info.changes > 0; // true если обновлено, false если нет
    });    

    ipcMain.handle('category:delete', (event, id) => {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    });
};