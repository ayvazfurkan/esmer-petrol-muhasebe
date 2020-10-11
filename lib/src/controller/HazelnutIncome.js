import {ipcMain} from "electron"
import HazelnutIncome from "../model/HazelnutIncome"

ipcMain.on("/newAcceptance", (e, data) => {
    let hiObj = new HazelnutIncome(),
        form = hiObj.setParams(data),
        hasError = hiObj.validate(form);
    if (hasError.status) {
        e.returnValue = hasError
        return false
    }
    hiObj.save(form).then(success => {
        e.returnValue = {
            status: true,
            exception: {}
        }
        return false
    }).catch(err => {
        console.error(err)
    })
})

ipcMain.on("/createRegion", (e, data) => {
    let hiObj = new HazelnutIncome(),
        form = hiObj.setRegionParams(data),
        hasError = hiObj.validateRegion(form);
    if (hasError.status) {
        e.reply('createRegion', hasError)
        return false
    }
    hiObj.saveRegion(form).then(success => {
        e.reply('createRegion', {
            status: true,
            exception: {}
        })
        return false
    }).catch(err => {
        console.error(err)
    })
})

ipcMain.on("/editRegion", (e, data) => {
    let hiObj = new HazelnutIncome(),
        form = hiObj.setRegionUpdateParams(data),
        hasError = hiObj.validateRegion(form);
    if (hasError.status) {
        e.reply('editRegion', hasError)
        return false
    }
    hiObj.editRegion(form).then(success => {
        e.reply('editRegion', {
            status: success === 1,
            exception: {}
        })
        return false
    }).catch(err => {
        console.error(err)
    })
})

ipcMain.on("/deleteRegion", (e, data) => {
    let hiObj = new HazelnutIncome()
    hiObj.deleteRegion(data).then(success => {
        e.reply('deleteRegion', {
            status: success === 1,
            exception: {}
        })
        return false
    }).catch(err => {
        console.error(err)
    })
})