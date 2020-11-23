import { ipcMain } from 'electron'
import Settings from '../model/Settings'
import Customer from '../model/Customer'

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

ipcMain.on('/saveBranchDetail', (e, data) => {
  const Obj = new Settings()
  const form = Obj.setBranchParams(data)
  const validationResult = Obj.branchValidate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  Obj.branchSave(form).then(segmentId => {
    e.returnValue = {
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/getBranchDetail', (e, data) => {
  const Obj = new Settings()
  const getBranch = Obj.getBranchDetail(data.id)
  getBranch.then(dataset => {
    e.reply('getBranchDetail', {
      status: true,
      result: dataset[0]
    })
  }).catch(err => {
    console.log(err)
  })
})
