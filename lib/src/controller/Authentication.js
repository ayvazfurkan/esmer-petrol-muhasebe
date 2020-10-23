import { ipcMain } from 'electron'
import Authentication from '../model/Authentication'

ipcMain.on('/auth', (e, data) => {
  const authObj = new Authentication()
  const form = authObj.setParams(data)
  const dbResult = authObj.getUser(form)
  dbResult.then(result => {
    const validationResult = authObj.validate(form, result)
    if (!validationResult.status) {
      authObj.fail(form).then()
      e.returnValue = validationResult
      return false
    }
    authObj.login(result).then()
    e.returnValue = {
      status: true,
      userDetails: result
    }
    return false
  }).catch(err => {
    console.log(err)
    e.returnValue = {
      status: false,
      exception: { general: 'Kullanıcı bulunamadı.' }
    }
    return false
  })
})
