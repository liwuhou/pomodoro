const { app, BrowserWindow, Notification, ipcMain } = require('electron')

/** 开发调试代码 */
try {
  require('electron-reloader')(module)
} catch (_) {

}

let win
app.on('ready', () => {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('src/pages/index/index.html')
  handleIPC()
})
// globalShortcut

function handleIPC() {
  ipcMain.handle('work-notification', async function () {
    let res = await new Promise((resolve, reject) => {
      let notification = new Notification({
        title: '任务结束',
        body: '是否开始休息',
        actions: [{ text: '开始休息', type: 'button' }],
      })
      notification.show()
      notification.on('action', () => {
        resolve('rest')
      })
      notification.on('close', () => {
        resolve('close')
      })
    })
    return res
  })
  ipcMain.handle('rest-notification', async function () {
    let res = await new Promise((resolve, reject) => {
      let notification = new Notification({
        title: '休息结束',
        body: '开始专注吧',
        actions: [{ text: '开始专注', type: 'button' }]
      })
      notification.show()
      notification.on('action', () => {
        resolve('work')
      })
      notification.on('close', () => {
        resolve('close')
      })
    })
    return res
  })
}

