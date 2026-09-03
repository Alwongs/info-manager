import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerIpcHandlers } from './ipc/index.js';
import { initDatabase } from './database.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('=== ПРОВЕРКА .ENV ===');
console.log('MASTER_KEY из .env:', process.env.MASTER_KEY ? '✅ ЕСТЬ' : '❌ НЕТ');
console.log('=====================');

// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let mainWindow;
let db;

// --- ПОЛУЧАЕМ __dirname В ES-МОДУЛЕ ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
    mainWindow = new BrowserWindow({
            width: 1100,
            height: 700,
            minWidth: 1020,    // ← Минимальная ширина
            minHeight: 500,   // ← Минимальная высота
            webPreferences: {
                // preload.js связывает React и Node.js миры
                preload: path.join(__dirname, 'preload.cjs'),
                // Важные настройки безопасности
                contextIsolation: true,
                nodeIntegration: false,
            },
            show: false, // Окно не будет показано, пока не будет готово
            icon: path.join(__dirname, '../build/icon.png'),
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173'); // Vite dev server
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html')); // Продакшен-сборка
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};


// --- ОБРАБОТЧИКИ СОБЫТИЙ ПРИЛОЖЕНИЯ (APP EVENTS) ---
// Этот код выполнится, когда Electron завершит инициализацию.
app.whenReady().then(() => {
    // Устанавливаем пустое меню
    Menu.setApplicationMenu(null);    
    db = initDatabase(); 

    createWindow();

    registerIpcHandlers(ipcMain, db);    

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
