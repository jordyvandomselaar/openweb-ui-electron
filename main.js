const { app, BrowserWindow, globalShortcut, ipcMain, shell } = require('electron');
const path = require('path');

let launcherWindow = null;
let mainWindow = null;

const baseUrl = '<Put your openweb-ui base url here>';

async function createMainWindow(url) {
    if (mainWindow) {
        mainWindow.loadURL(`${baseUrl}${url ?? ""}`);

        return;
    }

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    mainWindow.loadURL(`${baseUrl}${url ?? ""}`);

    // 🧠 Intercept any attempt to open a new window
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url); // Opens in default browser
        return { action: 'deny' }; // Prevent Electron from opening a new window
    });

    // 🧠 Also open external links clicked normally (like <a target="_blank">)
    mainWindow.webContents.on('will-navigate', (event, url) => {
        const mainUrl = mainWindow.webContents.getURL();
        const isSameOrigin = url.startsWith(new URL(mainUrl).origin);

        if (!isSameOrigin) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createLauncherWindow() {
    launcherWindow = new BrowserWindow({
        width: 600,
        height: 100,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    launcherWindow.loadFile('launcher.html');
    launcherWindow.on('blur', () => launcherWindow.hide());
}

app.whenReady().then(() => {
    createMainWindow(); // open main app by default
    createLauncherWindow();
    
    app.setLoginItemSettings({
        openAtLogin: true,
        openAsHidden: true
    });

    globalShortcut.register('Alt+Space', () => {
        launcherWindow.show();
        launcherWindow.focus();
    });

    ipcMain.on('launch-url', (event, { value, isSearch }) => {
        let url = ``

        if (value) {
            url = `?q=${value}`;
        }
        
        if (isSearch) {
            url += `&web-search=true`;
        } else {
            url += `&web-search=false`;
        }

        launcherWindow.hide();
        if (url && url.trim()) {
            createMainWindow(url.trim());
        }
    });
});

ipcMain.on('hide-launcher', () => {
    if (launcherWindow) {
        launcherWindow.hide();

        // Prevent mainWindow from gaining focus
        if (mainWindow) {
            mainWindow.blur(); // explicitly defocus it
        }
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});