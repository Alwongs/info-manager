import crypto from 'crypto';
import { safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const SALT = 'my-app-salt-2024';
const KEY_FILE = path.join(app.getPath('userData'), 'master.key');

let masterKey = null;

// --- Установка пароля ---
export const setMasterPassword = (password) => {
    masterKey = crypto.pbkdf2Sync(password, SALT, 100000, 32, 'sha256');
};

export const clearMasterPassword = () => {
    masterKey = null;
};

export const isMasterPasswordSet = () => {
    return masterKey !== null;
};

// --- safeStorage ---
export const savePassword = (password) => {
    const encrypted = safeStorage.encryptString(password);
    fs.writeFileSync(KEY_FILE, encrypted);
};

export const loadPassword = () => {
    try {
        const encrypted = fs.readFileSync(KEY_FILE);
        return safeStorage.decryptString(encrypted);
    } catch {
        return null;
    }
};

export const hasSavedPassword = () => {
    return fs.existsSync(KEY_FILE);
};

// --- Шифрование (простое) ---
export const encrypt = (text) => {
    if (!text || !masterKey) return text;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
};

// --- Расшифровка (простая) ---
export const decrypt = (encryptedData) => {
    console.log('encrypt: ' + encryptedData)
    if (!encryptedData || !masterKey) return encryptedData;

    try {
        const [ivHex, encrypted] = encryptedData.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, iv);
        const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    } catch {
        // ✅ ВЫБРАСЫВАЕМ ошибку
        throw new Error('Неверный пароль или данные повреждены');
    }
};

// --- Проверка пароля ---
export const verifyPassword = (password) => {
    if (!masterKey) return false;
    const testKey = crypto.pbkdf2Sync(password, SALT, 100000, 32, 'sha256');
    return testKey.equals(masterKey);
};