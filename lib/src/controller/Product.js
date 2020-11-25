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
    e.reply('newProduct', validationResult)
    return false
  }
  pObj.save(form).then(productId => {
    e.reply('newProduct', {
      status: true,
      exception: {},
      id: productId
    })
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/saveCustomerPrices', (e, data) => {
  const pObj = new Product()
  const form = pObj.setCustomerPricesParams(data)
  const validationResult = pObj.validateCustomerPrices(form)
  if (!validationResult.status) {
    e.reply('saveCustomerPrices', validationResult)
    return false
  }
  pObj.saveCustomerPricesChanges(form)
  e.reply('saveCustomerPrices', {
    status: true,
    exception: {}
  })
})

ipcMain.on('/deleteProduct', (e, data) => {
  const pObj = new Product()
  const form = pObj.setDeleteParams(data)
  const validationResult = pObj.deleteValidate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  pObj.deleteProduct(form).then(productId => {
    e.returnValue = {
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/getProduct', (e, data) => {
  const pObj = new Product()
  pObj.get(data, 15).then(dataset => {
    e.reply('productList', {
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

ipcMain.on('/getCustomerProductPrice', (e, data) => {
  const pObj = new Product()
  pObj.getCustomerProductPrice(data).then(dataset => {
    e.reply('getCustomerProductPrice', {
      status: true,
      result: dataset
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
