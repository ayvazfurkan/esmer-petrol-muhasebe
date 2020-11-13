import { ipcRenderer } from 'electron'

const genericMethods = {
  data () {
    return {
      loading: false,
      errors: {},
      success: false
    }
  },
  methods: {
    invalidIcon (property, defaultIcon) {
      return !property ? defaultIcon : 'ri-error-warning-line text-danger'
    },
    invalidField (property) {
      return !property ? null : 'is-invalid'
    },
    multiselectSearcher ({ name }) {
      return `${name}`
    },
    getCustomers (name) {
      this.customerList = []
      if (name.length < 3) {
        return false
      }
      ipcRenderer.send('/getCustomer', { name })
      new Promise(function (resolve) {
        ipcRenderer.on('customerList', (event, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customerList = []
        for (const customer of result.result) {
          this.customerList.push({
            id: customer.id,
            name: customer.name.concat(' ', customer.surname)
          })
        }
      })
    },
    getProvinces () {
      ipcRenderer.send('/provinceList')
      new Promise(function (resolve) {
        ipcRenderer.on('provinceList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        for (const province of result) {
          this.provinces.push({
            id: province.id,
            name: province.name
          })
        }
      })
    },
    getDistricts (provinceId) {
      ipcRenderer.send('/districtList', provinceId)
      new Promise(function (resolve) {
        ipcRenderer.on('districtList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.districts = []
        for (const district of result) {
          this.districts.push({
            id: district.id,
            name: district.name
          })
        }
      })
    },
    getRegions (name) {
      this.regionList = []
      if (name.length < 2) {
        return false
      }
      ipcRenderer.send('/regionList', { name })
      new Promise(function (resolve) {
        ipcRenderer.on('regionList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.regionList = []
        for (const region of result) {
          this.regionList.push({
            id: region.id,
            name: region.name
          })
        }
      })
    },
    getProducts (name) {
      this.productList = []
      if (name.length < 3) {
        return false
      }
      ipcRenderer.send('/getProduct', { name })
      new Promise(function (resolve) {
        ipcRenderer.on('productList', (event, result) => {
          resolve(result)
        })
      }).then(result => {
        this.productList = []
        for (const product of result.result) {
          this.productList.push({
            id: product.id,
            name: product.name
          })
        }
      })
    },
    makeTitle (text) {
      const wordsArray = text.toLowerCase().split(' ')
      const capsArray = wordsArray.map(word => {
        return (word.length > 0 && word.replace(word[0], word[0].toUpperCase())) || ''
      })
      return capsArray.join(' ')
    },
    moneyFormat (price) {
      return new Intl.NumberFormat('tr-TR', { style: 'decimal' }).format(price)
    }
  }
}

export default genericMethods
