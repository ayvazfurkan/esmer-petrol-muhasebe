import {ipcRenderer} from "electron";

const genericMethods = {
    methods: {
        invalidIcon(property, defaultIcon) {
            return !property ? defaultIcon : "ri-error-warning-line text-danger"
        },
        invalidField(property) {
            return !property ? null : "is-invalid"
        },
        multiselectSearcher({name}) {
            return `${name}`;
        },
        getCustomers(name) {
            this.customerList = []
            if (name.length < 3) {
                return false
            }
            ipcRenderer.send("/getCustomer", {name})
            new Promise(function (resolve) {
                ipcRenderer.on('customerList', (event, result) => {
                    resolve(result);
                })
            }).then(result => {
                this.customerList = []
                for (let customer of result.result) {
                    this.customerList.push({id: customer.id, name: customer.name.concat(" ", customer.surname)})
                }
            })
        },
        getProvinces() {
            ipcRenderer.send("/provinceList")
            new Promise(function (resolve) {
                ipcRenderer.on('provinceList', (e, result) => {
                    resolve(result);
                })
            }).then(result => {
                for (let province of result) {
                    this.provinces.push({id: province.id, name: province.name})
                }
            })
        },
        getDistricts(provinceId) {
            ipcRenderer.send("/districtList", provinceId)
            new Promise(function (resolve) {
                ipcRenderer.on('districtList', (e, result) => {
                    resolve(result);
                })
            }).then(result => {
                this.districts = []
                for (let district of result) {
                    this.districts.push({id: district.id, name: district.name})
                }
            })
        },
        getRegions(name) {
            this.regionList = []
            if (name.length < 2) {
                return false
            }
            ipcRenderer.send("/regionList", {name})
            new Promise(function (resolve) {
                ipcRenderer.on('regionList', (e, result) => {
                    resolve(result);
                })
            }).then(result => {
                this.regionList = []
                for (let region of result) {
                    this.regionList.push({id: region.id, name: region.name})
                }
            })
        },
        getWarehouses(name) {
            this.customerList = []
            if (name.length < 2) {
                return false
            }
            ipcRenderer.send("/warehouseList", {name})
            new Promise(function (resolve) {
                ipcRenderer.on('warehouseList', (e, result) => {
                    resolve(result);
                })
            }).then(result => {
                this.warehouseList = []
                for (let warehouse of result) {
                    this.warehouseList.push({id: warehouse.id, name: warehouse.name})
                }
            })
        },
        getCurrencies() {
            ipcRenderer.send("/currencyList")
            new Promise(function (resolve) {
                ipcRenderer.on('currencyList', (e, result) => {
                    resolve(result);
                })
            }).then(result => {
                this.currencies = []
                for (let currency of result) {
                    this.currencies.push({id: currency.id, name: currency.name})
                }
            })
        },
        makeTitle(text) {
            let wordsArray = text.toLowerCase().split(' ')
            let capsArray = wordsArray.map(word => {
                return word.length > 0 && word.replace(word[0], word[0].toUpperCase()) || ""
            })
            return capsArray.join(' ')
        }
    }
}

export default genericMethods