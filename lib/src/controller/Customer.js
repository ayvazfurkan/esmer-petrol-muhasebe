import { ipcMain } from 'electron'
import Customer from '../model/Customer'
import moment from 'moment'

ipcMain.on('/newCustomer', (e, data) => {
  const cObj = new Customer()
  const form = cObj.setParams(data)
  if (data.id > 0) {
    form.id = data.id
    form.updaterId = form.creatorId
    form.updateDate = form.createDate
    delete form.creatorId
    delete form.createDate
  }
  const validationResult = cObj.validate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  cObj.save(form).then(customerId => {
    if (data.segment && data.segment.length) {
      for (const segment of data.segment) {
        cObj.saveCustomerSegment(form.creatorId, customerId, segment.id).then()
      }
    } else {
      cObj.saveCustomerSegment(form.creatorId, customerId, 0).then()
    }
    e.returnValue = {
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/getCustomer', (e, data) => {
  const cObj = new Customer()
  cObj.get(data, 15).then(dataset => {
    e.reply('customerList', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getCustomerDetail', (e, data) => {
  const cObj = new Customer()
  const getCustomer = cObj.get(data)
  getCustomer.then(dataset => {
    cObj.getCustomerSegment(data).then(segmentList => {
      dataset[0].segment = segmentList
      e.reply('getCustomerDetail', {
        status: true,
        result: dataset[0]
      })
    })
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getCustomerSummary', (e, data) => {
  const cObj = new Customer()
  data.dataPerPage = data.dataPerPage || 10
  const summary = cObj.getSummary(data, true)
  summary.then(rowCountDataset => {
    const rowCount = rowCountDataset[0].rowCount
    const pageCount = Math.ceil(parseInt(rowCount) / parseInt(data.dataPerPage))
    if (data.pageNumber <= 0 || data.pageNumber > pageCount || isNaN(data.pageNumber)) {
      data.pageNumber = pageCount
    }
    const queryStartTime = moment().valueOf()
    cObj.getSummary(data, false).then(dataset => {
      e.reply('getCustomerSummary', {
        status: true,
        result: dataset,
        pageNumber: data.pageNumber,
        queryTime: (moment().valueOf() - queryStartTime) / 1000,
        rowCount,
        pageCount
      })
      return false
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getOncreditProducts', (e, data) => {
  const oncreditId = data.oncreditId
  const cObj = new Customer()
  cObj.getOncreditProducts(oncreditId).then(dataset => {
    e.reply('getOncreditProducts', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getCustomerBalance', (e, data) => {
  const cObj = new Customer()
  cObj.getBalance(data).then(dataset => {
    e.reply('getCustomerBalance', {
      status: true,
      result: dataset[0].balance
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getCustomerPlates', (e, data) => {
  const cObj = new Customer()
  cObj.getPlates(data).then(dataset => {
    e.reply('getCustomerPlates', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getCustomerDrivers', (e, data) => {
  const cObj = new Customer()
  cObj.getDrivers(data).then(dataset => {
    e.reply('getCustomerDrivers', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/getCustomerSegment', (e, data) => {
  const cObj = new Customer()
  cObj.getCustomerSegment(data).then(dataset => {
    e.reply('getCustomerSegment', {
      status: true,
      result: dataset
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})
ipcMain.on('/customerList', (e, data) => {
  const cObj = new Customer()
  data.dataPerPage = data.dataPerPage || 10
  const rowCounter = cObj.get(data, true)
  rowCounter.then(rowCountDataset => {
    const rowCount = rowCountDataset[0].rowCount
    const pageCount = Math.ceil(parseInt(rowCount) / parseInt(data.dataPerPage))
    if (data.pageNumber <= 0 || data.pageNumber > pageCount || isNaN(data.pageNumber)) {
      data.pageNumber = pageCount
    }
    const queryStartTime = moment().valueOf()
    const getData = cObj.get(data, false)
    getData.then(dataset => {
      e.reply('customerList', {
        status: true,
        result: dataset,
        pageNumber: data.pageNumber,
        queryTime: (moment().valueOf() - queryStartTime) / 1000,
        rowCount,
        pageCount
      })
      return false
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/segmentList', (e, data) => {
  const cObj = new Customer()
  cObj.getSegments().then(dataset => {
    e.reply('segmentList', dataset)
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/newSegment', (e, data) => {
  const cObj = new Customer()
  const form = cObj.setSegmentParams(data)
  if (data.id > 0) {
    form.id = data.id
    form.updaterId = form.creatorId
    form.updateDate = form.createDate
    delete form.creatorId
    delete form.createDate
  }
  const validationResult = cObj.segmentValidate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  cObj.segmentSave(form).then(segmentId => {
    e.returnValue = {
      id: segmentId,
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/deleteSegment', (e, data) => {
  const cObj = new Customer()
  const form = cObj.setDeleteParams(data)
  const validationResult = cObj.deleteValidate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  cObj.deleteSegment(form).then(productId => {
    e.returnValue = {
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/deleteMoneyFlow', (e, data) => {
  const cObj = new Customer()
  const form = cObj.setDeleteMoneyFlowParams(data)
  const validationResult = cObj.deleteMoneyFlowValidate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  cObj.deleteMoneyFlow(form).then(moneyFlowId => {
    e.returnValue = {
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/newMoneyFlow', (e, data) => {
  const cObj = new Customer()
  const form = cObj.setMoneyFlowParams(data)
  if (data.id > 0) {
    form.id = data.id
    form.updaterId = form.creatorId
    form.updateDate = form.createDate
    delete form.creatorId
    delete form.createDate
  }
  const validationResult = cObj.validateMoneyFlow(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  cObj.saveMoneyFlow(form).then(customerId => {
    e.returnValue = {
      status: true,
      exception: {}
    }
    return false
  }).catch(err => {
    console.log(err)
  })
})
