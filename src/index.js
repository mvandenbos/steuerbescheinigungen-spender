import { app, BrowserWindow, ipcMain, shell, Menu  } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
const updater = require('electron-simple-updater');
if(require('electron-squirrel-startup')) app.quit();
updater.init('https://apps.fcg-frankfurt.de/steuerbescheinigungen-spender/updates.json');

let mainWindow;
let reportWindow;
let testWindow;

const template = [  
  {
    label: 'App',
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload();

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  reportWindow = new BrowserWindow({show : false});
  testWindow  = new BrowserWindow({show: true})

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  reportWindow.loadURL(`file://${__dirname}/background/index.html`);
  testWindow.loadURL(`file://${__dirname}/mgb/index.html`);

  if (isDevMode) {
    await installExtension(VUEJS_DEVTOOLS);
    mainWindow.webContents.openDevTools();
    reportWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    reportWindow.close();
    reportWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('generate-report-complete', (event, file_path) => {
  console.log('generate-report-complete')
  mainWindow.webContents.send('generated-report-saved', file_path );
  shell.openItem(file_path);
})

ipcMain.on('start-generate-report', (event, data) => {
  console.log("start-generate-report")
  reportWindow.webContents.send('generate-report', data );
})

ipcMain.on('generate-excel-complete', (event, file_path) => {
  console.log('generate-excel-complete')
  mainWindow.webContents.send('generated-excel-saved', file_path );
  shell.openItem(file_path);
})

ipcMain.on('start-generate-excel', (event, data) => {
  console.log("start-generate-excel")
  reportWindow.webContents.send('generate-excel', data );
})

ipcMain.on('parse-addison-data-complete', (event, data) => {
  console.log('parse-addison-data-complete')
  mainWindow.webContents.send('parsed-addison-data-saved', data );
})

ipcMain.on('start-parse-addison-data', (event, file_path) => {
  console.log("start-parse-addison-data")
  reportWindow.webContents.send('parse-addison-data', file_path );
})

ipcMain.on('parse-donor-data-complete', (event, data) => {
  console.log('parse-donor-data-complete')
  mainWindow.webContents.send('parsed-donor-data-saved', data );
})

ipcMain.on('start-parse-donor-data', (event, data) => {
  console.log("start-parse-donor-data")
  reportWindow.webContents.send('parse-donor-data', data );
})

ipcMain.on('parse-existing-report-complete', (event, data) => {
  console.log('parse-existing-report-complete')
  mainWindow.webContents.send('parsed-existing-report-saved', data );
})

ipcMain.on('start-parse-existing-report', (event, data) => {
  console.log("start-parse-existing-report")
  reportWindow.webContents.send('parse-existing-report', data );
})

ipcMain.on('background-error', (event, err) => {
  console.log('background-error')
  mainWindow.webContents.send('display-error', err );
})
