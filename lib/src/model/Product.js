import Database from './Database'
import moment from 'moment'

export default class Product {
  constructor () {
    const dbObj = new Database()
    this.db = dbObj.connect()
  }

  save (form) {
    if (form.id > 0) { // update existing product
      return this.db('product')
        .where('id', form.id)
        .update(form)
    } else { // new product
      return this.db('product').insert(form)
    }
  }

  deleteProduct (form) {
    delete form.deleteValidate
    return this.db('product')
      .where('id', form.id)
      .update(form)
  }

  get (where, limit) {
    limit = limit || 500
    where = where || {}
    const query = this.db('product').select('*')
    if (where.id) {
      query.where('id', where.id)
    }
    if (where.name) {
      query.where(this.db.raw('name', 'like', where.name.concat('%')))
    }
    query.where('status', 1)
    query.limit(limit)
    return query
  }

  getCustomerProductPrice (data) {
    data = data || {}
    const query = this.db('customerProductPrice as cp')
      query
      .select('cp.*')
      .select('cs.name as customerName')
      .where('cp.branchId', data.branchId)
      .where('cp.productId', data.productId)
      .where('cp.isDeleted', 0)
      .leftJoin('customer as cs', 'cs.id', 'cp.customerId')
    return query
  }

  setCustomerPricesParams (data) {
    let newParams = []
    for (const item of data.list) {
      const params = {
        productId: data.productId || '',
        customerId: item.customerId || '',
        salePrice: item.salePrice || 0,
        branchId: data.branchId || '',
        creatorId: data.userId || '',
        isDeleted: item.deleted || 0
      }
      if (item.id !== '0') {
        params.id = item.id || 0
      }
      newParams.push(params)
    }
    return newParams
  }

  validateCustomerPrices (newParams) {
    const exception = []
    for (const i in newParams) {
      exception[i] = {}
      if (isNaN(newParams[i].productId)) {
        exception[i].productId = 'Ürün ID bilgisi elde edilemedi.'
      }
      if (isNaN(newParams[i].customerId)) {
        exception[i].customerId = 'Müşteri ID bilgisi elde edilemedi.'
      }
      if (newParams[i].salePrice <= 0) {
        exception[i].salePrice = 'Özel satış fiyatı sıfırdan büyük olmalı.'
      }
      if (isNaN(newParams[i].branchId)) {
        exception[i].branchId = 'Şube ID bilgisi elde edilemedi.'
      }
      if (isNaN(newParams[i].creatorId)) {
        exception[i].creatorId = 'User ID bilgisi elde edilemedi.'
      }
      if (!exception[i].length) {
        exception.splice(i, 1)
      }
    }
    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  saveCustomerPricesChanges (form) {
    for (const item of form) {
      const query = this.db('customerProductPrice')
      if ( item.isDeleted || item.id > 0) {
        query.where('id', item.id).update(item)
      } else {
        query.insert(item)
      }
      query.then(result => {  })
        .catch( error => {
          // console.log(error)
          // console.error('Bir hata meydana geldi. Lütfen yeniden deneyin. ')
      })
    }
  }

  setParams (params) {
    return {
      branchId: params.branchId || '',
      name: (params.name && params.name.trim()) || '',
      salePrice: params.salePrice || 0,
      forwardSalePrice: params.forwardSalePrice || 0,
      onCredit: params.onCredit || 0,
      allowable: params.allowable || 0,
      creatorId: params.creatorId || '',
      createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  validate (form) {
    const exception = {}
    if (isNaN(form.branchId) || form.branchId.length < 1) {
      exception.branchId = 'Şube ID bilgisi elde edilemedi.'
    }
    if (form.name.length < 3) {
      exception.name = 'İsim bilgisi 3 karakterden küçük olamaz.'
    }
    if (form.salePrice < 0) {
      exception.salePrice = 'Satış fiyatı sıfırdan küçük olamaz.'
    }
    if (form.forwardSalePrice < 0) {
      exception.forwardSalePrice = 'Vadeli satış fiyatı sıfırdan küçük olamaz'
    }
    if (form.forwardSalePrice > 0 && form.salePrice > form.forwardSalePrice) {
      exception.salePrice = 'Satış fiyatı vadeli satış fiyatından büyük olamaz'
      exception.forwardSalePrice = 'Vadeli satış fiyatı satış fiyatından küçük olamaz'
    }
    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  setDeleteParams (params) {
    return {
      branchId: params.branchId || '',
      id: params.id || 0,
      deleteValidate: params.deleteValidate || 0,
      updaterId: params.updaterId || '',
      updateDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      status: 0
    }
  }

  deleteValidate (form) {
    const exception = {}
    if (isNaN(form.branchId) || form.branchId.length < 1) {
      exception.branchId = 'Şube ID bilgisi elde edilemedi.'
    }
    if (isNaN(form.updaterId) || form.updaterId.length < 1) {
      exception.updaterId = 'Kullanıcı ID bilgisi elde edilemedi.'
    }
    if (!form.id > 0) {
      exception.id = 'Ürün ID bilgisi elde edilemedi.'
    }
    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }
}
