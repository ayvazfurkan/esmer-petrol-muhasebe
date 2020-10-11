import Database from "./Database";
import crypto from "crypto"
import moment from "moment";

export default class HazelnutIncome {
    constructor() {
        let dbObj = new Database();
        this.db = dbObj.connect()
    }

    save(form) {
        return this.db("hazelnutIncome").insert(form);
    }

    validate(form) {
        let exception = {}
        let invalidValue = "invalid-value";
        return {
            status: Object.keys(exception).length !== 0,
            exception
        }
    }

    setParams(params) {
        return {
            transactionId: HazelnutIncome.generateTransactionId(),
            userId: params.userId || "",
            branchId: params.branchId || "",
            customerId: params.customerId.id || "",
            regionId: params.regionId.id || "",
            warehouseId: params.warehouseId.id || "",
            receivedWeight: params.receivedWeight || "",
            sackQuantity: params.sackQuantity || "",
            vehiclePlate: params.vehiclePlate && params.vehiclePlate.trim() || "",
            waybillNumber: params.waybillNumber && params.waybillNumber.trim() || "",
            description: params.description && params.description.trim() || "",
            yieldAuto: params.yieldAuto || "0",
            yieldSample: params.yieldSample || "0",
            yieldSolid: params.yieldSolid || "0",
            yieldWrinkled: params.yieldWrinkled || "0",
            yieldMoisture: params.yieldMoisture || "6",
            yieldRatio: params.yieldRatio || "",
            netWeight: params.netWeight || "",
            oldHazelnut: params.oldHazelnut || "0",
            isReceiptPrinted: params.isReceiptPrinted || "0",
            updateDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            insertDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
    }

    static generateTransactionId() {
        return crypto.randomBytes(4).toString('hex')
    }

    saveRegion(form) {
        return this.db("region").insert(form)
    }

    editRegion(form) {
        return this.db("region").update({name: form.name}).where({id: form.id})
    }

    deleteRegion(form) {
        return this.db("region").update({status: "0"}).where({id: form.id})
    }

    setRegionParams(params) {
        return {
            name: params.name || "",
            creatorId: params.userId || "",
            createDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            status: "1"
        }
    }

    setRegionUpdateParams(params) {
        return {
            name: params.name || "",
            id: params.id || ""
        }
    }

    validateRegion(form) {
        let exception = {}
        if (form.name.length < 4) {
            exception.name = "İsim bilgisi 4 karakterden küçük olamaz."
        }

        return {
            status: Object.keys(exception).length !== 0,
            exception
        }
    }
}