import { ipcMain } from 'electron'
import Settings from '../model/Settings'

ipcMain.on('/settings/user/password', (e, data) => {
  const obj = new Settings()
  const form = Settings.setParamsPassword(data)
  const checkUser = obj.getUser(data.userId)
  checkUser.then(userData => {
    if (!userData) {
      e.reply('passwordChange', {
        status: false,
        errors: { general: 'Kullanıcı bulunamadı.' }
      })
      return false
    }
    const validationResult = obj.validatePassword(form, userData[0])
    if (!validationResult.status) {
      e.reply('passwordChange', validationResult)
      return false
    }
    obj.updatePassword(form).then(id => {
      e.reply('passwordChange', {
        status: true,
        errors: {}
      })
      return false
    }).catch(err => {
      console.error(err)
    })
  })
})