import Database from "./Database";
import moment from "moment";
import { param } from "jquery";

export default class cashOutFlow {
    constructor() {
        let dbObj = new Database();
        this.db = dbObj.connect()
    }

    save(form) {
        return this.db("cashFlow").insert(form);
    }

    validate(form) {
        let exception = {}

        if (isNaN(form.branchId) || form.branchId.length < 1) {
            exception.branchId = "Şube ID bilgisi elde edilemedi."
        }
        if (form.customerId === 0 || !form.customerId) {
            exception.customerId = "İşlem yapan müşteriyi seçiniz."
        }
        if (form.amount.length === 0 || isNaN(form.amount) || form.amount >= 0) {
            exception.amount = "Tutar sıfırdan büyük olmalıdır"
        }
        if (form.currencyId === 0 || !form.currencyId) {
            exception.currencyId = "Para birimi seçiniz"
        }
        return {
            status: Object.keys(exception).length === 0,
            exception
        }
    }

    setParams(params) {
        return {
            branchId: params.branchId || "",
            customerId: params.customerId && params.customerId.id || null,
            currencyId: params.currencyId && params.currencyId.id || null,
            amount: params.amount && params.amount.trim() && (params.amount * -1) || "",
            description: params.description && params.description.trim() || "",
            creatorId: params.creatorId || "",
            createDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
    }
}