import Database from './Database'
import moment from 'moment'
import * as EmailValidator from 'email-validator'

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

  saveMoneyFlow (form) {
    if (form.id > 0) { // update existing money flow
      return this.db('customerMoneyFlow')
        .where('id', form.id)
        .update(form)
    } else { // new money flow
      return this.db('customerMoneyFlow').insert(form)
    }
  }

  saveCustomerSegment (userId, customerId, segmentId) {
    const updateOldSegment = this.db('customerSegment')
      .where('customerId', customerId)
      .update({
        status: 0,
        updaterId: userId,
        updaterDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      })

    return updateOldSegment.then(result => {
      if (segmentId > 0) {
        return this.db('customerSegment')
          .insert({
            customerId: customerId,
            segmentId: segmentId,
            creatorId: userId,
            createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          })
      }
    })
  }

  get (where, rowCount) {
    where = where || {}
    rowCount = rowCount || false
    const query = this.db('customer').select('customer.*')
      .select('customer.id as customerOrgId')
      .leftJoin('province as pr', 'pr.id', 'customer.provinceId')
      .leftJoin('district as ds', 'ds.id', 'customer.districtId')
      .select('ds.name as districtName', 'pr.name as provinceName')
    if (where.name) {
      query.where('name', 'like', '%' + where.name + '%')
      query.orWhere('authorizedPersonName', 'like', '%' + where.name + '%')
    }
    if (where.moneySituation === '1') {
      query.where('customer.balance', '>', 0)
    }
    if (where.moneySituation === '-1') {
      query.where('customer.balance', '<', 0)
    }
    if (where.id) {
      query.where('customer.id', where.id)
    }
    if (!rowCount && where.dataPerPage) {
      if (where.pageNumber > 0) {
        query.limit(where.dataPerPage).offset(where.dataPerPage * (where.pageNumber - 1))
      }
    } else {
      query.count('customer.id as rowCount')
    }
    return query
  }

  getBalance (data) {
    data.customerId = data.customerId || 0
    const query = this.db('customerMoneyFlow').sum('amount as balance')
    if (data.customerId) {
      query.where('customerId', data.customerId)
      query.where('isDeleted', 0)
    }
    return query
  }

  getSummary (data, rowCount) {
    data = data || {}
    rowCount = rowCount || false
    const query = this.db('customerMoneyFlow as csmf').select('csmf.id', 'csmf.amount', 'csmf.description', 'csmf.oncreditId', 'csmf.creatorId', 'csmf.createDate', 'csmf.priceDifference', 'user.name', 'user.username', 'so.name as salesofficerName')
      .leftJoin('user', 'csmf.creatorId', 'user.id')
      .leftJoin('oncredit as oc', 'oc.id', 'csmf.oncreditId')
      .leftJoin('salesofficer as so', 'so.id', 'oc.salesofficerId')
    if (data.customerId) {
      query.where('csmf.customerId', data.customerId)
    }
    if (data.plateId) {
      const subquery = this.db.select('id').from('oncredit')
      subquery.where('customerPlateId', data.plateId)
      // subquery.where('customerId', data.customerId)
      query.whereIn('oncreditId', subquery)
    }
    if (data.driverId) {
      const subquery = this.db.select('id').from('oncredit')
      subquery.where('customerDriverId', data.driverId)
      // subquery.where('customerId', data.customerId)
      query.whereIn('oncreditId', subquery)
    }
    query.where('csmf.isDeleted', 0)
    query.orderBy('csmf.id')
    if (!rowCount && data.dataPerPage) {
      if (!data.plateId && !data.driverId) {
        query.select(this.db.raw('(select sum(amount) from customerMoneyFlow WHERE id <= csmf.id AND customerId = csmf.customerId AND isDeleted = 0) AS balance'))
      }
      if (data.pageNumber > 0) {
        query.limit(data.dataPerPage).offset(data.dataPerPage * (data.pageNumber - 1))
      }
    } else {
      query.count('csmf.id as rowCount')
    }
    return query
  }

  getOncreditProducts (oncreditId) {
    return this.db('oncreditProduct as ocp')
      .select(
        'pr.name as productName',
        'ocp.price',
        'ocp.amount',
        'ocp.subTotal',
        'oc.description',
        'pl.plate',
        'dr.name as driverName',
        'so.name as salesofficerName',
        'so.img as salesofficerImg',
        'oc.createDate',
        'oc.totalPrice'
      )
      .where('ocp.oncreditId', oncreditId)
      .leftJoin('oncredit as oc', 'oc.id', oncreditId)
      .leftJoin('product as pr', 'pr.id', 'ocp.productId')
      .leftJoin('salesofficer as so', 'so.id', 'oc.salesofficerId')
      .leftJoin('customerDriver as dr', 'dr.id', 'oc.customerDriverId')
      .leftJoin('customerPlate as pl', 'pl.id', 'oc.customerPlateId')
      .orderBy('ocp.productId', 'DESC')
  }

  getPlates (where) {
    where = where || {}
    const limit = where.limit || 500
    const query = this.db('customerPlate').select('*')
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
    const query = this.db('customerDriver').select('*')
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
    const query = this.db('segment as seg').select('seg.id', 'seg.name')
    query.select(this.db.raw('(select count(id) from customerSegment WHERE segmentId = seg.id AND status = 1) AS countCustomer'))
    query.select(this.db.raw('(select sum(amount) from customerMoneyFlow WHERE customerId IN (select customerId from customerSegment WHERE segmentId = seg.id AND status = 1) AND isDeleted = 0) AS balanceCustomer'))
    query.where('status', 1)
    query.limit(500)
    return query
  }

  getCustomerSegment (where) {
    where = where || {}
    const query = this.db('customerSegment')
      .leftJoin('segment', 'segment.id', 'customerSegment.segmentId')
      .select('customerSegment.segmentId as id', 'segment.name')
      .groupBy('customerSegment.segmentId')

    if (where.customerId) {
      query.where('customerId', where.customerId)
    }
    query.where('customerSegment.status', 1)
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
    if (form.email.length > 0 && !EmailValidator.validate(form.email)) {
      exception.email = 'Geçersiz email adresi.'
    }

    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  validateMoneyFlow (form) {
    const exception = {}
    if (isNaN(form.branchId) || form.branchId.length < 1) {
      exception.branchId = 'Şube ID bilgisi elde edilemedi.'
    }
    if (form.amount === 0 || isNaN(form.amount)) {
      exception.amount = 'Tutar sıfırdan büyük bir sayı olmalıdır.'
    }
    if (form.description > 250) {
      exception.description = 'Açıklama en fazla 250 karakter olabilir.'
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

  setMoneyFlowParams (params) {
    return {
      branchId: params.branchId || '',
      customerId: params.customerId || '',
      amount: parseFloat(params.amount) * parseInt(params.flowType),
      priceDifference: params.priceDifference || 0,
      description: (params.description && params.description.trim()) || '',
      creatorId: params.creatorId || '',
      createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  setDeleteMoneyFlowParams (params) {
    return {
      branchId: params.branchId || '',
      id: params.id || 0,
      deleteValidate: params.deleteValidate || 0,
      updaterId: params.updaterId || '',
      updateDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      isDeleted: 1
    }
  }

  deleteMoneyFlowValidate (form) {
    const exception = {}
    if (isNaN(form.branchId) || form.branchId.length < 1) {
      exception.branchId = 'Şube ID bilgisi elde edilemedi.'
    }
    if (isNaN(form.updaterId) || form.updaterId.length < 1) {
      exception.updaterId = 'Kullanıcı ID bilgisi elde edilemedi.'
    }
    if (!form.id > 0) {
      exception.id = 'İşlem ID bilgisi elde edilemedi.'
    }
    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  deleteMoneyFlow (form) {
    delete form.deleteValidate
    return this.db('customerMoneyFlow')
      .where('id', form.id)
      .update(form)
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
