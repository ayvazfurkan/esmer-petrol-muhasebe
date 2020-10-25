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

  get (where, limit) {
    limit = limit || 500
    where = where || {}
    const query = this.db('product').select('*')
    if (where.id){
      query.where('id', where.id)
    }
    query.limit(limit)
    return query
  }

  validate (form) {
    const exception = {}
    if (isNaN(form.branchId) || form.branchId.length < 1) {
      exception.branchId = 'Şube ID bilgisi elde edilemedi.'
    }
    if (form.name.length < 4) {
      exception.name = 'İsim bilgisi 4 karakterden küçük olamaz.'
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

  setParams (params) {
    return {
      branchId: params.branchId || '',
      name: (params.name && params.name.trim()) || '',
      salePrice: (params.salePrice && params.salePrice.trim()) || 0,
      forwardSalePrice: (params.forwardSalePrice && params.forwardSalePrice.trim()) || 0,
      onCredit: params.onCredit || '',
      allowable: params.allowable || '',
      creatorId: params.creatorId || '',
      createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
