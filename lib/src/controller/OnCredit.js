import { ipcMain } from 'electron'
import Oncredit from '../model/Oncredit'

ipcMain.on('/oncredit/list', (e, form) => {
  const model = new Oncredit()
  const dbResult = model.get(form)
  dbResult
    .then(result => {
      e.reply('oncreditList', result)
    })
    .catch(err => {
      console.log(err)
    })
})
