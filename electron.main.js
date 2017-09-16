const electron = require('electron')
const app = electron.app
// Tarayıcı penceresi için gerekli
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

/* pencere için global bir referans oluşturuyoruz */
let mainWindow

const os = require('os');
const {ipcMain} = require('electron')

// burada ui'ı (renderer'ı) dinleyeceğiz
// eğer çağrılırsa anında değer döndereceğiz
ipcMain.on('isletimSisteminiGetir', (event, arg) => {
  event.returnValue = os.platform();
});

function createWindow () {
  // yeni tarayıcı penceresi.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // sonra index.html dosyasını uygulamaya ekliyoruz.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Başlangıçta geliştirme penceresini açabilirsiniz
  // mainWindow.webContents.openDevTools()

  // Pencere kapatıldığında
  mainWindow.on('closed', function () {
    // pencere bellekte yer kaplamaması için boşaltıyoruz.
    mainWindow = null
  })
}

// Electron'a ait herşeyin yüklenmesi bittiğinde çalışır
app.on('ready', createWindow)

// Tüm pencereler hapatıldığında
app.on('window-all-closed', function () {
  // Eğer OSX değilse bu şekilde çıkabiliyor.
  // OSX için sadece Cmd + Q ile çıkış yapılabilir.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Uygulama penceresi her aktif olduğunda tetiklenir
app.on('activate', function () {
  // Eğer window yoksa yeniden oluşturuyor
  if (mainWindow === null) {
    createWindow()
  }
})