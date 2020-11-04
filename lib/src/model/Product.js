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