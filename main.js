const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    title: "Lifesaver - Editor Acessível",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const templateMenu = [
    {
      label: 'Arquivo',
      submenu: [
        { label: 'Salvar .txt', accelerator: 'CmdOrCtrl+S', click: () => win.webContents.send('comando-menu', 'salvar-txt') },
        { label: 'Exportar .md', click: () => win.webContents.send('comando-menu', 'salvar-md') },
        { label: 'Gerar PDF', accelerator: 'CmdOrCtrl+P', click: () => win.webContents.send('comando-menu', 'pdf') },
        { type: 'separator' },
        { label: 'Sair', role: 'quit' }
      ]
    },
    {
      label: 'Inserir',
      submenu: [
        { label: 'Link', accelerator: 'CmdOrCtrl+K', click: () => win.webContents.send('comando-menu', 'link') },
        { label: 'Imagem', accelerator: 'CmdOrCtrl+G', click: () => win.webContents.send('comando-menu', 'imagem') }
      ]
    },
    {
      label: 'Ferramentas',
      submenu: [
        { label: 'Estatísticas', accelerator: 'CmdOrCtrl+Shift+C', click: () => win.webContents.send('comando-menu', 'estatisticas') }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        { 
          label: 'Manual (F1)', 
          accelerator: 'F1', 
          click: () => {
            dialog.showMessageBox(win, {
              type: 'info',
              title: 'Ajuda Lifesaver',
              message: 'Atalhos:\n• Ctrl+S: Salvar .txt\n• Ctrl+P: PDF\n• Ctrl+Shift+C: Estatísticas\n• Ctrl+K: Link\n• Ctrl+G: Imagem',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(templateMenu));
  win.loadFile('index.html');
}

ipcMain.on('salvar-arquivo', (event, { conteudo, extensao }) => {
  const caminho = dialog.showSaveDialogSync({
    title: 'Salvar Arquivo',
    filters: [{ name: 'Documento', extensions: [extensao] }]
  });
  if (caminho) {
    fs.writeFileSync(caminho, conteudo, 'utf8');
  }
});

app.whenReady().then(createWindow);