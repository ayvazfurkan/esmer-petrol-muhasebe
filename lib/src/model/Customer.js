import Database from './Database'
import moment from 'moment'

export default class Customer {
  constructor () {
    const dbObj = new Database()
    this.db = dbObj.connect()
  }

  save (form) {
    if (form.id > 0) { // update existing customer
      return this.db('customer')
        .where('id', form.id)
        .update(form)
    } else { // new customer
      return this.db('customer').insert(form)
    }
  }

  saveCustomerSegment (userId, customerId, segmentId) {
    return this.db('customerSegment')
      .insert({
        customerId: customerId,
        segmentId: segmentId,
        creatorId: userId,
        createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      })
  }

  get (where, limit) {
    limit = limit || 500
    where = where || {}
    const query = this.db('customer').select('*')
    if (where.name) {
      query.where(this.db.raw('concat_ws(\' \', name, authorizedPersonName)'), 'like', where.name.concat('%'))
    }
    if (where.id) {
      query.where('id', where.id)
    }
    query.limit(limit)
    return query
  }

  getSummary (data) {
    data = data || {}
    let query = this.db('customerMoneyFlow as csmf').select('csmf.id','csmf.amount', 'csmf.description', 'csmf.creatorId','csmf.createDate','user.name','user.username').leftJoin('user', 'csmf.creatorId', 'user.id')
    if (data.customerId) {
      query.where('csmf.customerId', data.customerId)
    }
    query.where('csmf.isDeleted', 0)
    query.orderBy('csmf.id')
    return query
  }

  getPlates (where) {
    where = where || {}
    const limit = where.limit || 500
    let query = this.db('customerPlate').select('*')
    if (where.id) {
      query.where('id', where.id)
    }
    if (where.customerId) {
      query.where('customerId', where.customerId)
    }
    query.where('isDeleted', 0)
    query.orderBy('plate')
    query.limit(limit)
    return query
  }

  getDrivers (where) {
    where = where || {}
    const limit = where.limit || 500
    let query = this.db('customerDriver').select('*')
    if (where.id) {
      query.where('id', where.id)
    }
    if (where.customerId) {
      query.where('customerId', where.customerId)
    }
    query.where('isDeleted', 0)
    query.orderBy('name')
    query.limit(limit)
    return query
  }

  getSegments () {
    const query = this.db('segment').select('*')
    query.where('status', 1)
    query.limit(500)
    return query
  }

  getCustomerSegment (where) {
    where = where || {}
    const query = this.db('customerSegment')
      .leftJoin('segment', 'segment.id', 'customerSegment.segmentId')
      .select('customerSegment.id', 'segment.name')

    if (where.customerId) {
      query.where('customerId', where.customerId)
    }
    if (where.status) {
      query.where('status', where.status)
    }
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
    if (form.gsm.length > 0 && form.gsm.length !== 11) {
      exception.gsm = 'Cep telefonu numarası 0 ile başlayıp 11 haneden oluşmalıdır.'
    }
    if (form.forwardSalesDiscountRate < 0) {
      exception.forwardSalesDiscountRate = 'Vadeli satış indirim oranı 0 dan küçü olamaz.'
    }
    if (form.maxSalesTerm < 0) {
      exception.maxSalesTerm = 'Max. vadeli satış günü 0 dan küçük olamaz.'
    }
    if (form.maxSalesTerm > (365 * 3)) {
      exception.maxSalesTerm = 'Max. vadeli satış günü en fazla ' & (365 * 3) & ' gün (3 yıl) olabilir.'
    }
    if (form.phone.length > 0 && form.phone.length !== 11) {
      exception.phone = 'Sabit hat numarası 0 ile başlayıp 11 haneden oluşmalıdır.'
    }
    if (form.fax.length > 0 && form.fax.length !== 11) {
      exception.fax = 'Fax numarası 0 ile başlayıp 11 haneden oluşmalıdır.'
    }
    if (form.citizenIdentification.length > 0 &&
      (form.citizenIdentification.length !== 11 || isNaN(form.citizenIdentification))) {
      exception.fax = 'TC kimlik numarası 11 haneden oluşmalıdır.'
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email) === false && form.email.length > 0) {
      exception.email = 'Geçersiz email adresi.'
    }

    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  setParams (params) {
    return {
      branchId: params.branchId || '',
      name: params.name || '',
      authorizedPersonName: params.authorizedPersonName || '',
      gsm: (params.gsm && params.gsm.trim()) || '',
      citizenIdentification: (params.citizenIdentification && params.citizenIdentification.trim()) || '',
      birthDate: moment(params.birthDate, 'DD.MM.YYYY').format('YYYY-MM-DD') || '',
      taxNumber: (params.taxNumber && params.taxNumber.trim()) || '',
      taxOffice: (params.taxOffice && params.taxOffice.trim()) || '',
      forwardSalesDiscountRate: (params.forwardSalesDiscountRate && params.forwardSalesDiscountRate.trim()) || '',
      maxSalesTerm: (params.maxSalesTerm && params.maxSalesTerm.trim()) || '',
      provinceId: (params.provinceId && params.provinceId.id) || null,
      districtId: (params.districtId && params.districtId.id) || null,
      expenseClient: (params.expenseClient && params.expenseClient.id) || '0',
      phone: (params.phone && params.phone.trim()) || '',
      fax: (params.fax && params.fax.trim()) || '',
      email: (params.email && params.email.trim()) || '',
      address: (params.address && params.address.trim()) || '',
      creatorId: params.creatorId || '',
      createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  segmentSave (form) {
    if (form.id > 0) { // update existing product
      return this.db('segment')
        .where('id', form.id)
        .update(form)
    } else { // new product
      return this.db('segment').insert(form)
    }
  }

  deleteSegment (form) {
    delete form.deleteValidate
    return this.db('segment')
      .where('id', form.id)
      .update(form)
  }

  segmentValidate (form) {
    const exception = {}

    if (isNaN(form.branchId) || form.branchId.length < 1) {
      exception.branchId = 'Şube ID bilgisi elde edilemedi.'
    }
    if (form.name.length < 3) {
      exception.name = 'İsim bilgisi 3 karakterden küçük olamaz.'
    }

    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  setSegmentParams (params) {
    return {
      branchId: params.branchId || '',
      name: (params.name && params.name.trim()) || '',
      creatorId: params.creatorId || '',
      createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
