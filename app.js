//const { app, BrowserWindow } = require('electron')

const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const url = require("url");
var connectionJson = require("./dbConfig.json")

const path = require("path");
var ipcMain = electron.ipcMain;
var child = require('child_process');
//const { Menu } = require('electron');
let mainWindow

// Connection Al DB --> cambiare le configurazioni nel file dbConfig.json
const knex = require('knex')({
    client: 'mysql2',
    connection: connectionJson.connection,
    pool: {
        afterCreate: function(conn, done) {
            console.log("CONNECTED")
            done();
        }
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: __dirname + '/preload.js'
        },
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/terna-launcher-app/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    mainWindow.webContents.openDevTools();
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
            pathname: path.join(__dirname, `/dist/terna-launcher-app/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
}
//CHIAMATE SHELL PER AVVIARE APPLICAZIONI ESTERNE
/*
ipcMain.on('openApp', (event, arg) => {
    let executablePath = arg.link;
    child.execFile(executablePath, function(err, data) {
        event.returnValue = data;
    });

});
ipcMain.on('openUrl', (event, arg) => {
    electron.shell.openExternal(arg.link);
});
*/


//CHIAMATE AL DB
/*
ipcMain.handle('insert', async(event, arg) => {
    let result;
    await knex(arg.table)
        .insert(arg.query)
        .onConflict(arg.conflict).ignore()
        .then(res => { console.log("Insert: ", res), result = res });
    return result

})
ipcMain.handle("delete", async(event, arg) => {
    await knex(arg.table)
        .where('id', arg.id)
        .del().then(res => { console.log("Delete: ", res), result = res });
    return result
})
ipcMain.handle("select", async(event, arg) => {
    let result;
    await knex.select(arg.select).from(arg.table).then(res => { console.log("Select: ", res), result = res });
    return result
})
ipcMain.handle("where", async(event, arg) => {
    let result;
    await knex(arg.table).where(arg.column, arg.value).then(res => { console.log("Where: ", res), result = res });
    return result
})
ipcMain.handle("loginn", async(event, arg) => {
    let result;
    await knex("user").where({ "username": arg.username, "password": arg.password }).then(res => { console.log("Auth: ", res), result = res });
    return result
})
ipcMain.handle("join", async(event, arg) => {
    let result
    await knex.from('user_application').where("user_id", arg.user_id).innerJoin('application', 'user_application.application_id', 'application.id_app').orderBy([{ column: 'index' }]).then(res => { console.log("Join: ", res), result = res });
    return result
})
ipcMain.handle('update', async(event, arg) => {
    let result
    if (arg.id_app) {
        await knex(arg.table)
            .where('id_app', '=', arg.id_app)
            .update(arg.query)
            .clearCounters().then(res => { console.log("Update: ", res), result = res });
        return result
    } else {
        await knex(arg.table)
            .where('id', '=', arg.id)
            .update(arg.query)
            .clearCounters().then(res => { console.log("Update: ", res), result = res });
        return result
    }
})
ipcMain.handle("insert_new_app", async(event, arg) => {
    let result;
    const subquery = knex.select(0, "id", arg.id_app, 0).from("user").whereIn("role", [...arg.roles])
    await knex("user_application")
        .insert(subquery)
        .onConflict("id").ignore()
        .then(res => { console.log("Insert: ", res), result = res });
    return result
})
ipcMain.handle("addAppByUserId", async(event, arg) => {
    let result;
    const subquery = knex.select(0, arg.id_user, "id_app", 0).from("application").whereIn("name", [...arg.apps])
    await knex("user_application")
        .insert(subquery)
        .onConflict("id").ignore()
        .then(res => { console.log("Insert: ", res), result = res });
    return result
})
ipcMain.handle("selectAppNotMine", async(event, arg) => {
    const subquery = knex.select("id_app").from('user_application').where("user_id", arg.user_id).innerJoin('application', 'user_application.application_id', 'application.id_app');
    let result;
    await knex.select("*").from("application").whereNotIn("id_app", subquery).then(res => { console.log("Select: ", res), result = res });
    return result
})
ipcMain.handle("getAppsByRole", async(event, arg) => {
    let query = '%' + arg.value + '%'
    let result;
    await knex.select("name").from("application").where('visibility', 'like', query).then(res => { console.log("getAppsByRole: ", res), result = res });
    return result
})
ipcMain.handle("deleteApplication", async(event, arg) => {
    let result;
    console.log(knex(arg.table)
        .where({
            user_id: arg.user_id,
            application_id: arg.application_id
        }))
    await knex(arg.table)
        .where({
            user_id: arg.user_id,
            application_id: arg.application_id
        })
        .del().then(res => { console.log("Delete: ", res), result = res });
    return result
})
*/