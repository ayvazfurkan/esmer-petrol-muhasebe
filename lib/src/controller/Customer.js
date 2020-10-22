import {ipcMain} from "electron"
import Customer from "../model/Customer";

ipcMain.on("/newCustomer", (e, data) => {
    let cObj = new Customer(),
        form = cObj.setParams(data),
        validationResult = cObj.validate(form);
    if (!validationResult.status) {
        e.returnValue = validationResult
        return false
    }
    cObj.save(form).then(customerId => {
        if (data.segment) {
            for (let segment of data.segment){
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

ipcMain.on("/getCustomer", (e, data) => {
    let cObj = new Customer()
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

ipcMain.on("/getCustomerDetail", (e, data) => {
    let cObj = new Customer()
    // burada bir çok join kullanılacak
    cObj.get(data, 1).then(dataset => {
        e.returnValue = {
            status: true,
            result: dataset[0]
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on("/getCustomerSegment", (e, data) => {
    let cObj = new Customer()
    cObj.getCustomerSegment(data).then(dataset => {
        e.returnValue = {
            status: true,
            result: dataset
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on("/getSegmentName", (e, data) => {
    let cObj = new Customer()
    cObj.getSegmentName(data).then(dataset => {
        e.returnValue = {
            status: true,
            result: dataset[0]
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on("/customerList", (e, data) => {
    let cObj = new Customer()
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

ipcMain.on("/segmentList", (e, data) => {
    let cObj = new Customer()
    cObj.getSegment().then(dataset => {
        e.reply('segmentList', dataset)
        return false
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on("/newSegment", (e, data) => {
    let cObj = new Customer(),
        form = cObj.setSegmentParams(data),
        validationResult = cObj.segmentValidate(form);
    if (!validationResult.status) {
        e.returnValue = validationResult
        return false
    }
    cObj.segmentSave(form).then(customerId => {
        e.returnValue = {
            status: true,
            exception: {}
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})
