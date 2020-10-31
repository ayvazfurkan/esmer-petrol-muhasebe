import { ipcMain } from 'electron'
import Customer from '../model/Customer'

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
    if (data.segment) {
      for (const segment of data.segment) {
        cObj.saveCustomerSegment(form.creatorId, customerId, segment.id).then()
      }
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
  cObj.get(data, 1).then(dataset => {
    e.reply('getCustomerDetail', {
      status: true,
      result: dataset[0]
    })
    return false
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('/getCustomerSummary', (e, data) => {
  const cObj = new Customer()
  cObj.getSummary(data).then(dataset => {
    e.reply('getCustomerSummary', {
      status: true,
      result: dataset
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
  cObj.get().then(dataset => {
    e.reply('customerList', {
      status: true,
      result: dataset
    })
    return false
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
