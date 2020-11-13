import { ipcMain } from 'electron'
import Oncredit from '../model/OnCredit'

ipcMain.on('/chart/customerVolume', (e, form) => {
  const obj = new Oncredit()
  const summary = obj.summaryByCustomer(form)
  summary
    .then(dataset => {
      e.reply('chartCustomerVolume', dataset)
    })
    .catch(err => {
      console.error(err)
    })
})

ipcMain.on('/chart/customerSegment', (e, form) => {
  const obj = new Oncredit()
  const summary = obj.summaryBySegment(form)
  summary
    .then(dataset => {
      e.reply('chartCustomerSegment', dataset)
    })
    .catch(err => {
      console.error(err)
    })
})

ipcMain.on('/chart/product', (e, form) => {
  const obj = new Oncredit()
  const summary = obj.summaryByProduct(form)
  summary
    .then(dataset => {
      e.reply('chartProduct', dataset)
    })
    .catch(err => {
      console.error(err)
    })
})

ipcMain.on('/chart/summaryPeriodic', (e, form) => {
  const obj = new Oncredit()
  const summary = obj.summaryPeriodic(form)
  summary
    .then(dataset => {
      e.reply('chartSummaryPeriodic', dataset)
    })
    .catch(err => {
      console.error(err)
    })
})
