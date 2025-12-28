const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
let mainWindow;
let isManualMaximized = false;
let previousBounds = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        transparent: false,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        show: false,
    });

    // Load the app
    if (isDev) {
        const startUrl = 'http://localhost:3000';
        mainWindow.loadURL(startUrl);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC handlers for window controls
ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (isManualMaximized) {
            // Restore to previous bounds
            if (previousBounds) {
                mainWindow.setBounds(previousBounds);
            }
            isManualMaximized = false;
        } else {
            // Save current bounds
            previousBounds = mainWindow.getBounds();
            // Get screen work area (excludes taskbar)
            const display = screen.getDisplayMatching(mainWindow.getBounds());
            const workArea = display.workArea;
            mainWindow.setBounds({
                x: workArea.x,
                y: workArea.y,
                width: workArea.width,
                height: workArea.height,
            });
            isManualMaximized = true;
        }
    }
});

ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
    return isManualMaximized;
});

app.whenReady().then(() => {
    createWindow();

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

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
