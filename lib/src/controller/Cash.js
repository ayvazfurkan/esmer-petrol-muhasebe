import {ipcMain} from "electron"
import cashInFlow from "../model/CashInFlow";
import cashOutFlow from "../model/CashOutFlow";

ipcMain.on("/cash/inFlow", (e, data) => {
    let cObj = new cashInFlow(),
        form = cObj.setParams(data),
        validationResult = cObj.validate(form);
    if (!validationResult.status) {
        e.returnValue = validationResult
        return false
    }
    cObj.save(form).then(dataset => {
        e.returnValue = {
            status: true,
            exception: {}
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on('/cash/outFlow', (e, data) => {
  let cObj = new cashOutFlow(),
    form = cObj.setParams(data),
    validationResult = cObj.validate(form)
  if (!validationResult.status) {
    e.returnValue = validationResult
    return false
  }
  cObj.save(form).then(dataset => {
    e.returnValue = {
      status: true,
      exception: {}
    }
    cObj.save(form).then(dataset => {
        e.returnValue = {
            status: true,
            exception: {}
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})