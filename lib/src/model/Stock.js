import Database from "./Database";
import moment from "moment";

export default class Stock {
    constructor() {
        let dbObj = new Database();
        this.db = dbObj.connect()
    }

    warehouseSave(form) {
        return this.db("warehouse").insert(form);
    }

    warehouseValidate(form) {
        let exception = {}

        if (isNaN(form.branchId) || form.branchId.length < 1) {
            exception.branchId = "Şube ID bilgisi elde edilemedi."
        }
        if (form.name.length < 4) {
            exception.amount = "Depo ismi 4 karakterden küçük olamaz."
        }
        return {
            status: Object.keys(exception).length === 0,
            exception
        }
    }

    warehouseSetParams(params) {
        return {
            branchId: params.branchId || "",
            name: params.name && params.name || null,
            creatorId: params.userId || "",
            createDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
    }

}