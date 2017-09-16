var electron = require('electron');

if (electron.ipcRenderer) { // eğer bu kontrolü yapmazsak tarayıcı üzerinde ipcRenderer is not a function hatasını alırız
	const ipcRenderer = electron.ipcRenderer;
	// burada sendSync ile anında değer gelmesi ve onu değişkene atmasını istiyoruz.
	var sistem = ipcRenderer.sendSync('isletimSisteminiGetir');
	alert('Bu bilgisayarın işletim sistemi:' + sistem);
}