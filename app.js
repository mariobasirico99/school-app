//const { app, BrowserWindow } = require('electron')

const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const url = require("url");
var users = require("./users.json")
var data = require("./data.json")
const path = require("path");
var ipcMain = electron.ipcMain;
const fs = require('file-system');
let mainWindow


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: __dirname + '/src/assets/images/logo.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: __dirname + '/preload.js'
        },
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/school-app/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    //mainWindow.webContents.openDevTools();
    mainWindow.maximize()
    mainWindow.on('closed', function() {
        mainWindow = null
    })

}
app.on('ready', function() {
    createWindow()
    const template = []

    const body = [{
        label: "body"
    }]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    if (mainWindow === null) createWindow()
})

function returnToLauncher() {
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/school-app/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
}

ipcMain.handle('writeFile', async (event, arg) => {
  try{
    if (arg.type === "user") {
      const users = await fs.readFileSync("./users.json");
      const jsonString = Buffer.from(users).toString('utf8')
      let result = JSON.parse(jsonString)
      result.users.push(arg.data)
      fs.writeFileSync("./users.json", JSON.stringify({users:result.users}));
      return true
    }
    else if (arg.type === "book") {
      const books = await fs.readFileSync("./data.json");
      const jsonString = Buffer.from(books).toString('utf8')
      let result = JSON.parse(jsonString)
      result.data.push(arg.data)
      fs.writeFileSync("./data.json", JSON.stringify({data:result.data}));
      return true
    }
  }
  catch (e) {
    return false
  }
  return false
});


ipcMain.handle('editFile', async (event, arg) => {
  try{
    if (arg.type === "user") {
      const users = await fs.readFileSync("./users.json");
      const jsonString = Buffer.from(users).toString('utf8')
      let result = JSON.parse(jsonString)
      for(let i = 0; i< result.users.length; i++){
        if(result.users[i].username == arg.user.username){
          result.users[i] = arg.user
        }
      }
      fs.writeFileSync("./users.json", JSON.stringify({users:result.users}));
      return true
    }
    else if (arg.type === "book") {
      const books = await fs.readFileSync("./data.json");
      const jsonString = Buffer.from(books).toString('utf8')
      let result = JSON.parse(jsonString)
      for(let i = 0; i< result.data.length; i++){
        if(result.data[i].name === arg.data.name && result.data[i].code === arg.data.code){
          result.data[i] = arg.data
        }
      }
      fs.writeFileSync("./data.json", JSON.stringify({data:result.data}));
      return true
    }
  }
  catch (e) {
    return false
  }
  return false
});

ipcMain.handle('deleteFile', async (event, arg) => {
  try {
    if (arg.type === "book") {
      const books = await fs.readFileSync("./data.json");
      const jsonString = Buffer.from(books).toString('utf8')
      let result = JSON.parse(jsonString)
      const objWithIdIndex = result.data.findIndex((obj) => obj.name === arg.data.name && obj.code === arg.data.code);
      if (objWithIdIndex > -1) {
        result.data.splice(objWithIdIndex, 1);
      }

      fs.writeFileSync("./data.json", JSON.stringify({data: result.data}));
      return true
    }
  } catch (e) {
    return false
  }
  return false
});

ipcMain.handle('write', (event, arg) => {
    //fs.unlinkSync(arg.path)
    fs.writeFileSync(arg.path, JSON.stringify(arg.data));
});

ipcMain.handle('read', async(event, arg) => {
    const data = await fs.readFileSync(arg.path);
    return data
});
