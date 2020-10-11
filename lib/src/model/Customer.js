import Database from "./Database";
import moment from "moment";

export default class Customer {
    constructor() {
        let dbObj = new Database();
        this.db = dbObj.connect()
    }

    saveCustomerSegment(userId, customerId, segmentList) {
        for (let segment of segmentList) {
            this.db("customerSegment")
                .insert({
                    customerId: customerId,
                    segmentId: segment.id,
                    createDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    creatorId: userId
                })
                .then()
        }
    }

    get(where, limit) {
        limit = limit || 500
        where = where || {}
        let query = this.db("customer").select("*")
        if (where.name) {
            query.where(this.db.raw("concat_ws(' ', name, surname)"), "like", where.name.concat("%"))
        }
        if (where.id) {
            query.where("id",  where.id)
        }
        query.limit(limit)
        return query
    }

    getSegment() {
        let query = this.db("segment").select("*")
        query.limit(50)
        return query
    }

    validate(form) {
        let exception = {}

        if (isNaN(form.branchId) || form.branchId.length < 1) {
            exception.branchId = "Şube ID bilgisi elde edilemedi."
        }
        if (form.name.length < 4) {
            exception.name = "İsim bilgisi 4 karakterden küçük olamaz."
        }
        if (form.gsm.length > 0 && form.gsm.length !== 11) {
            exception.gsm = "Cep telefonu numarası 0 ile başlayıp 11 haneden oluşmalıdır."
        }
        if (form.phone.length > 0 && form.phone.length !== 11) {
            exception.phone = "Sabit hat numarası 0 ile başlayıp 11 haneden oluşmalıdır."
        }
        if (form.fax.length > 0 && form.fax.length !== 11) {
            exception.fax = "Fax numarası 0 ile başlayıp 11 haneden oluşmalıdır."
        }
        if (form.citizenIdentification.length > 0
            && (form.citizenIdentification.length !== 11 || isNaN(form.citizenIdentification)) ) {
            exception.fax = "TC kimlik numarası 11 haneden oluşmalıdır."
        }
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email) === false && form.email.length > 0)
        {
            exception.email = "Geçersiz email adresi."
        }

        return {
            status: Object.keys(exception).length === 0,
            exception
        }
    }

    setParams(params) {
        return {
            companyId: params.companyId || null,
            branchId:  params.branchId || "",
            provinceId:  params.provinceId && params.provinceId.id || null,
            districtId:  params.districtId && params.districtId.id || null,
            name: params.name && params.name.trim().split(" ").slice(0, -1).join(" ") || "",
            surname: params.name && params.name.trim().split(" ").slice(-1).join(" ") || "",
            title: params.title && params.title.trim() || "",
            citizenIdentification: params.citizenIdentification && params.citizenIdentification.trim() || "",
            taxNumber:  params.taxNumber && params.taxNumber.trim() || "",
            taxOffice:  params.taxOffice && params.taxOffice.trim() || "",
            fathersName:  params.fathersName && params.fathersName.trim() || "",
            birthDate: moment(params.birthDate, "DD.MM.YYYY").format("YYYY-MM-DD") || "",
            invoiceType:  params.invoiceType && params.invoiceType.id || "1",
            expenseClient:  params.expenseClient && params.expenseClient.id || "0",
            gsm:  params.gsm && params.gsm.trim() || "",
            phone:  params.phone && params.phone.trim() || "",
            fax:  params.fax && params.fax.trim() || "",
            email:  params.email && params.email.trim() || "",
            address:  params.address && params.address.trim() || "",
            creatorId:  params.creatorId || "",
            createDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
    }
    /*
        segment codes
    */
    segmentSave(form) {
        return this.db("segment").insert(form)
    }
    segmentValidate(form) {
        let exception = {}

        if (isNaN(form.branchId) || form.branchId.length < 1) {
            exception.branchId = "Şube ID bilgisi elde edilemedi."
        }
        if (form.name.length < 3) {
            exception.name = "İsim bilgisi 3 karakterden küçük olamaz."
        }

        return {
            status: Object.keys(exception).length === 0,
            exception
        }
    }

    setSegmentParams(params) {
        return {
            companyId: params.companyId || null,
            branchId:  params.branchId || "",
            name: params.name && params.name.trim().split(" ").slice(0, -1).join(" ") || "",
            creatorId:  params.creatorId || "",
            createDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
    }
}