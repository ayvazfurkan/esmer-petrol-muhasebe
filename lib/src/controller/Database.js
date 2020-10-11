import {ipcMain} from "electron"
import Database from "../model/Database"

ipcMain.on("/databaseChecker", (e, data) => {
    let databaseObj = new Database(),
        credentials = databaseObj.setParams(databaseObj.getParameters())
    databaseObj.tryConnect(credentials).then(result => {
        e.returnValue = {
            status: true,
            exception: {}
        }
        return false
    }).catch(err => {
        e.returnValue = {
            status: false,
            exception: {connection: "Bağlantı bilgileri geçersiz."}
        }
        return false
    });
})

ipcMain.on("/databaseConnector", (e, data) => {
    let databaseObj = new Database(),
        form = databaseObj.setParams(data),
        validationResult = databaseObj.validation(form)
    if (!validationResult.status) {
        e.returnValue = validationResult
        return false
    }
    databaseObj.tryConnect(form).then(result => {
        databaseObj.save(form).then(result => {
            e.returnValue = {
                status: true,
                exception: {}
            }
        }).catch(err => {
            e.returnValue = {
                status: false,
                exception: {connection: "Veriler kaydedilemiyor."}
            }
        })
        return false
    }).catch(err => {
        console.log(err)
        e.returnValue = {
            status: false,
            exception: {connection: "Bağlantı bilgileri geçersiz."}
        }
        return false
    });
})
