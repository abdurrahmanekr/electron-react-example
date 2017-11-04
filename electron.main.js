const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater

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

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ["Sistem Ne'yi Yeniden Başlat", "Sonra"],
        title: 'Sistem Ne için Yeni Güncelleme Mevcut!',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'Yeni güncelleme indirildi. Güncellemeleri kurmak için yeniden başlatmanız gerekiyor.'
    }

    // kullanıcıya güncellemeyi kabul etmesi için bir pencere açıyoruz
    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    })
  })

  autoUpdater.on('error', message => {
    console.error('Güncellemede hata oluştu!');
    console.error(message);
  })

  // uygulamamızın güncellemeleri takip ettiği adresi belirliyoruz
  const server = 'http://download.example.com'
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL(feed);
  // Güncellemeleri kontrol ediyoruz
  autoUpdater.checkForUpdates();
  setInterval(function() {
    // saatte bir güncellemeleri kontrol ediyor.
    autoUpdater.checkForUpdates();
  }, 1000 * 60 * 60);
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