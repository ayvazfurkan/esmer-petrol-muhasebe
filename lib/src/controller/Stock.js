import {ipcMain} from "electron"
import Stock from "../model/Stock";

ipcMain.on("/createWarehouse", (e, data) => {
    let sObj = new Stock(),
        form = sObj.warehouseSetParams(data),
        validationResult = sObj.warehouseValidate(form);
    if (!validationResult.status) {
        e.returnValue = validationResult
        return false
    }
    sObj.warehouseSave(form).then(dataset => {
        e.returnValue = {
            status: true,
            exception: {}
        }
        return false
    }).catch(err => {
        console.log(err)
    })
})


