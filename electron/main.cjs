const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const zmq = require('zeromq');

// --- Global Variables ---
let mainWindow;
let splashWindow;
let pythonProcess;

// ZeroMQ Sockets
const sockReq = new zmq.Request();    // For sending Commands (REQ)
const sockSub = new zmq.Subscriber(); // For listening to Updates (SUB)

// --- 1. ZeroMQ Setup Function ---
async function setupZMQ() {
    try {
        // Connect to the Python ports
        sockReq.connect("tcp://127.0.0.1:5555");
        sockSub.connect("tcp://127.0.0.1:5556");
        
        sockSub.subscribe("progress"); 
        sockSub.subscribe("result");

        console.log("[Electron] Connected to Python ZMQ Sockets.");

        // Start listening for incoming messages
        for await (const [msg] of sockSub) {
            const message = msg.toString();
            if (mainWindow) {
                mainWindow.webContents.send('zmq-update', message);
            }
        }
    } catch (err) {
        console.error("[Electron] ZeroMQ Error:", err);
    }
}

// --- 2. Window Creation ---
function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        transparent: false,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const splashUrl = process.env.ELECTRON_START_URL 
        ? `${process.env.ELECTRON_START_URL}/splash.html` 
        : `file://${path.join(__dirname, '../dist/splash.html')}`;

    splashWindow.loadURL(splashUrl);
    
    splashWindow.on('closed', () => {
        splashWindow = null;
    });
}

function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        frame: false,
        autoHideMenuBar: true,
        show: false, // Don't show immediately
        webPreferences: {
            nodeIntegration: false, 
            contextIsolation: true, 
            preload: path.join(__dirname, 'preload.cjs') 
        }
    });

    mainWindow.loadURL(startUrl);

    // Wait for the window to be ready to show
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            if (splashWindow) {
                splashWindow.close();
            }
            if (mainWindow) {
                mainWindow.show();
            }
        }, 3000); // 3 seconds splash
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// --- 3. IPC Handlers (React -> Electron) ---
ipcMain.handle('send-command', async (event, command) => {
    console.log(`[Electron] Sending command to Python: ${command}`);
    try {
        await sockReq.send(command);
        const [reply] = await sockReq.receive();
        return reply.toString();
    } catch (err) {
        console.error("ZMQ Send Error:", err);
        return JSON.stringify({ error: "Failed to reach backend" });
    }
});

// --- 4. Python Process Management ---
function startPythonBackend() {
    const scriptPath = path.join(__dirname, '..', 'py_backend', 'backend.py');
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    console.log(`[Electron] Launching Python from: ${scriptPath}`);
    pythonProcess = spawn(pythonCmd, [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`[Python]: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`[Python Err]: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`[Python] Process exited with code ${code}`);
    });
}

// --- 5. App Lifecycle ---
// Force enable touch events for Linux
app.commandLine.appendSwitch('touch-events', 'enabled');

app.whenReady().then(() => {
    startPythonBackend(); 
    setupZMQ();           
    createSplashWindow(); 
    createWindow();       
});

// Cleanup on Exit
app.on('will-quit', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
    sockReq.close();
    sockSub.close();
});

// Mac-specific window behavior
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createSplashWindow();
        createWindow();
    }
});
