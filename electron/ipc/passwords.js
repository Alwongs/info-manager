import { 
    setMasterPassword, 
    clearMasterPassword, 
    isMasterPasswordSet,
    savePassword,
    loadPassword,
    hasSavedPassword,
    verifyPassword,
    encrypt,
    decrypt
} from './encryption.js';

export const registerPasswordHandlers = (ipcMain, db) => {

    ipcMain.handle('password:set', (event, password) => {
        setMasterPassword(password);
        savePassword(password);
        return { success: true };
    });

    ipcMain.handle('password:has', () => {
        return hasSavedPassword();
    });

    ipcMain.handle('password:clear', () => {
        clearMasterPassword();
        return { success: true };
    });

    ipcMain.handle('password:isSet', () => {
        return isMasterPasswordSet();
    });

    ipcMain.handle('password:change', (event, oldPassword, newPassword) => {
        // 1. Загружаем сохраненный пароль в память (старый ключ)
        const savedPassword = loadPassword();
        if (!savedPassword) {
            throw new Error('Сохраненный пароль не найден');
        }
        setMasterPassword(savedPassword);

        // 2. Проверяем старый пароль
        if (!verifyPassword(oldPassword)) {
            throw new Error('Неверный текущий пароль');
        }
        
        // 3. Получаем все зашифрованные параграфы
        const stmt = db.prepare('SELECT id, content FROM paragraphs WHERE is_encrypted = 1');
        const paragraphs = stmt.all();
        
        // 4. ✅ РАСШИФРОВЫВАЕМ старым ключом (ДО смены пароля)
        const decryptedContents = [];
        for (const p of paragraphs) {
            const decrypted = decrypt(p.content);
            decryptedContents.push({ id: p.id, content: decrypted });
        }
        
        // 5. Устанавливаем НОВЫЙ пароль
        setMasterPassword(newPassword);
        
        // 6. Шифруем новым ключом
        const updateStmt = db.prepare('UPDATE paragraphs SET content = ? WHERE id = ?');
        for (const p of decryptedContents) {
            const encrypted = encrypt(p.content);
            updateStmt.run(encrypted, p.id);
        }
        
        // 7. Сохраняем новый пароль
        savePassword(newPassword);
        
        return { success: true, reencrypted: paragraphs.length };
    });
};