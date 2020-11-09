import { ipcMain } from 'electron'
import Salesofficer from '../model/Salesofficer'

ipcMain.on('/salesofficer/list', (e, form) => {
  const model = new Salesofficer()
  const dbResult = model.get(form)
  dbResult.then(result => {
    e.reply('salesofficerList', result)
    return false
  }).catch(err => {
    console.log(err)
    e.reply('salesofficerList', {
      status: false,
      errors: { general: 'Kritik hata.' }
    })
    return false
  })
})

ipcMain.on('/salesofficer/remove', (e, form) => {
  const model = new Salesofficer()
  const dbResult = model.update(form)
  dbResult.then(result => {
    e.reply('salesofficerResult', result)
    return false
  }).catch(err => {
    console.log(err)
    e.reply('salesofficerResult', {
      status: false,
      errors: { general: 'Kritik hata.' }
    })
    return false
  })
})

ipcMain.on('/salesofficer/update', (e, form) => {
  const obj = new Salesofficer()
  const validationResult = Salesofficer.validateUpdate(form)
  if (validationResult.status) {
    e.reply('salesofficerUpdate', validationResult)
    return false
  }
  obj.update(form).then(result => {
    e.reply('salesofficerUpdate', { status: true })
    return false
  }).catch(err => {
    console.error(err)
    return false
  })
})

ipcMain.on('/salesofficer/create', (e, data) => {
  const obj = new Salesofficer()
  const form = Salesofficer.setCreateParams(data)
  const validationResult = Salesofficer.validateCreate(form)
  if (validationResult.status) {
    e.reply('salesofficerCreate', validationResult)
    return false
  }
  obj.create(form).then(id => {
    e.reply('salesofficerCreate', {
      status: true,
      description: id,
      errors: {}
    })
    return false
  }).catch(err => {
    console.error(err)
  })
})
