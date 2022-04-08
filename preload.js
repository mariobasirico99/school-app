//USATO PER FAR COMUNICARE I PROCESSI SECONDARI(RENDERER) AL PRIMARIO (MAIN) E QUINDI RIUSCIR AD AVERE I SUOI PRIVILEGI
window.ipcRenderer = require('electron').ipcRenderer;
window.shell = require('electron').shell