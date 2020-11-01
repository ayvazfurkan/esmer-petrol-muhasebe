const { app, BrowserWindow } = require('electron')
const path = require('path')
const os = require('os')

function createWindow () {
  const win = new BrowserWindow({
    width: 650,
    height: 350,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, './public/static/img/logo.png'),
    show: false
  })
  win.loadFile('./public/static/template/index.html').then()
  win.once('ready-to-show', () => {
    win.show()
  })
}

app.allowRendererProcessReuse = true
app.whenReady().then(createWindow)

app.on('ready', () => {
  if (process.env.NODE_ENV !== 'production') {
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0')
    )
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// ipcRenderer - ipcMain Process
require('./lib/dist/controller/Database')
require('./lib/dist/controller/Helper')
require('./lib/dist/controller/Authentication')
require('./lib/dist/controller/Customer')
require('./lib/dist/controller/Cash')
require('./lib/dist/controller/Product')
require('./lib/dist/controller/Salesofficer')
require('./lib/dist/controller/OnCredit')
require('./lib/dist/controller/Chart')
