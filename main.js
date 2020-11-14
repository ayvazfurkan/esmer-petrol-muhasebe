const { app, BrowserWindow } = require('electron')
const path = require('path')

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  if (process.env.NODE_ENV !== 'production') {
    require('vue-devtools').install()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// ipcRenderer - ipcMain Process
require(path.join(__dirname, './lib/dist/controller/Database'))
require(path.join(__dirname, './lib/dist/controller/Helper'))
require(path.join(__dirname, './lib/dist/controller/Authentication'))
require(path.join(__dirname, './lib/dist/controller/Customer'))
require(path.join(__dirname, './lib/dist/controller/Cash'))
require(path.join(__dirname, './lib/dist/controller/Product'))
require(path.join(__dirname, './lib/dist/controller/Salesofficer'))
require(path.join(__dirname, './lib/dist/controller/OnCredit'))
require(path.join(__dirname, './lib/dist/controller/Chart'))
require(path.join(__dirname, './lib/dist/controller/Settings'))
