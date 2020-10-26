import { ipcMain } from 'electron'
import Product from '../model/Product'

ipcMain.on('/newProduct', (e, data) => {
  const pObj = new Product()
  const form = pObj.setParams(data)
  if (data.id > 0) {
    form.id = data.id
    form.updaterId = form.creatorId
    form.updateDate = form.createDate
    delete form.creatorId
    delete form.createDate
  }
  const validationResult = pObj.validate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  pObj.save(form).then(customerId => {
    e.returnValue = {
      status: true,
      exception: {},
      id: customerId
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/getProduct', (e, data) => {
  const pObj = new Product()
  pObj.get(data, 15).then(dataset => {
    e.reply('customerList', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/getProductDetail', (e, data) => {
  const pObj = new Product()
  pObj.get(data, 1).then(dataset => {
    e.reply('getProductDetail', {
      status: true,
      result: dataset[0]
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/productList', (e, data) => {
  const pObj = new Product()
  pObj.get().then(dataset => {
    e.reply('productList', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
