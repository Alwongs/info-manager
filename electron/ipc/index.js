import { registerCategoryHandlers } from './categories.js';
import { registerNoteHandlers } from './notes.js';
import { registerParagraphHandlers } from './paragraphs.js';
import { registerSearchHandlers } from './search.js';
import { registerPasswordHandlers } from './passwords.js';

export const registerIpcHandlers = (ipcMain, db) => {
    if (!db) {
        throw new Error('База данных не передана в обработчики IPC');
    }
    registerCategoryHandlers(ipcMain, db);
    registerNoteHandlers(ipcMain, db);
    registerParagraphHandlers(ipcMain, db);
    registerSearchHandlers(ipcMain, db);
    registerPasswordHandlers(ipcMain, db);
};