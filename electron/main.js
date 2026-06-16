// electron/main.js
// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// function createWindow() {
//     const win = new BrowserWindow({
//         width: 1200,
//         height: 800,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false
//         },
//         backgroundColor: '#f8f9fa'
//     });

//     // Если ELECTRON_START_URL задан (dev-режим), используем URL
//     if (process.env.ELECTRON_START_URL) {
//         console.log(`🔌 Загрузка dev-сервера: ${process.env.ELECTRON_START_URL}`);
//         win.loadURL(process.env.ELECTRON_START_URL);
//     } else {
//         // PROD-режим: загружаем built-файл
//         const indexPath = path.join(__dirname, '../dist/index.html');
//         console.log(`📦 Загрузка prod-файла: ${indexPath}`);
//         win.loadFile(indexPath);
//     }

//     win.webContents.openDevTools();
// }

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow();
//     }
// });


const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        backgroundColor: '#f8f9fa'
    });

    if (process.env.ELECTRON_START_URL) {
        win.loadURL(process.env.ELECTRON_START_URL);
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());