import { ipcMain } from 'electron'
import Helper from '../model/Helper'
import Customer from '../model/Customer'

ipcMain.on('/provinceList', (e) => {
  const hObj = new Helper()
  hObj.provinceList().then(provinceList => {
    e.reply('provinceList', provinceList)

    return false
  }).catch(err => {
    console.error(err)
  })
})

ipcMain.on('/districtList', (e, provinceId) => {
  const hObj = new Helper()
  hObj.districtList(provinceId).then(districtList => {
    e.reply('districtList', districtList)

    return false
  }).catch(err => {
    console.error(err)
  })
})

ipcMain.on('/regionList', (e, data) => {
  const cObj = new Helper()
  cObj.getRegion(data).then(dataset => {
    e.reply('regionList', dataset)

    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/warehouseList', (e, data) => {
  const cObj = new Helper()
  cObj.getWarehouse(data).then(dataset => {
    e.reply('warehouseList', dataset)

    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/currencyList', (e) => {
  const hObj = new Helper()
  hObj.currencyList().then(dataset => {
    e.reply('currencyList', dataset)

    return false
  }).catch(err => {
    console.error(err)
  })
})
ipcMain.on('/quickSearch', (e, data) => {
  const cObj = new Customer()
  cObj.get(data, 15).then(dataset => {
    e.reply('searchResults', dataset)

    return false
  }).catch(err => {
    console.log(err)
  })
})
