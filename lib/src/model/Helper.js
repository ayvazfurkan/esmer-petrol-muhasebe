import Database from "./Database";

export default class Helper {
    constructor() {
        let dbObj = new Database();
        this.db = dbObj.connect()
    }

    provinceList() {
        return this.db("province").select("*")
    }

    districtList(provinceId) {
        return this.db("district").select("*").where({provinceId: provinceId})
    }

    getRegion(form) {
        let query = this.db("region").select("region.*", "user.username")
            .leftJoin('user', 'user.id', 'region.creatorId')
        if (form.name) {
            query.where("name", "like", form.name.concat("%"))
        }
        query.where("region.status", "1")
        query.limit(15)
        return query
    }

    getWarehouse(form) {
        let query = this.db("warehouse").select("*")
        if (form.name) {
            query.where("name", "like", form.name.concat("%"))
        }
        query.where("warehouse.status", "1")
        query.limit(15)
        return query
    }

    currencyList() {
        return this.db("currency").select("*")
    }

}