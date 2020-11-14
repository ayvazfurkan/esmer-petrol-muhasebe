import Database from './Database'
import _ from 'lodash'

export default class OnCredit {
  constructor () {
    const dbObj = new Database()
    this.db = dbObj.connect()
  }

  get (form) {
    const q = this.db('oncreditProduct')
      .leftJoin('oncredit', 'oncredit.id', 'oncreditProduct.oncreditId')
      .leftJoin('customer', 'customer.id', 'oncredit.customerId')
      .leftJoin('customerDriver', 'customerDriver.id', 'oncredit.customerDriverId')
      .leftJoin('customerPlate', 'customerPlate.id', 'oncredit.customerPlateId')
      .select(
        'oncredit.description',
        'oncredit.customerId',
        'oncredit.sms',
        'oncredit.totalPrice',
        'oncredit.createDate',
        'customer.name as customerName',
        'customerDriver.name as driverName',
        'customerPlate.plate'
      )
      .groupBy('oncredit.id')
      .where('oncredit.branchId', form.branchId.toString())
      .orderBy('oncredit.id', 'desc')

    if (!_.isEmpty(form.customerId)) {
      q.where('oncredit.customerId', form.customerId.toString())
    }
    if (!_.isEmpty(form.date)) {
      q.whereRaw('date(oncredit.createDate) = ?', [form.date.toString()])
    }

    return q
  }

  summaryByCustomer (form) {
    return this.db('oncredit')
      .select('customer.name as customer')
      .sum('oncredit.totalPrice as total')
      .groupBy('oncredit.customerId')
      .leftJoin('customer', 'customer.id', 'oncredit.customerId')
      .where('oncredit.branchId', form.branchId.toString())
      .limit(6)
  }

  summaryBySegment (form) {
    return this.db('oncredit')
      .select('segment.name as segment')
      .sum('oncredit.totalPrice as total')
      .groupBy('segment.id')
      .leftJoin('customer', 'customer.id', 'oncredit.customerId')
      .leftJoin('customerSegment', 'customer.id', 'customerSegment.customerId')
      .leftJoin('segment', 'customerSegment.segmentId', 'segment.id')
      .where('oncredit.branchId', form.branchId.toString())
      .limit(6)
  }

  summaryByProduct (form) {
    return this.db('oncreditProduct')
      .select(this.db.raw('ifnull(product.name, \'Diğer\') as product'))
      .select(this.db.raw('round(sum(if(oncreditProduct.productId is null, oncreditProduct.price, oncreditProduct.price * oncreditProduct.amount))) as total'))
      .groupBy('product')
      .leftJoin('oncredit', 'oncredit.id', 'oncreditProduct.oncreditId')
      .leftJoin('product', 'product.id', 'oncreditProduct.productId')
      .where('oncredit.branchId', form.branchId.toString())
      .limit(6)
  }

  summaryPeriodic (form) {
    return this.db('oncredit')
      .select('oncredit.createDate as date')
      .sum('oncredit.totalPrice as total')
      .groupBy('oncredit.createDate')
      .whereRaw('oncredit.createDate >= CURRENT_DATE - INTERVAL ? DAY', [form.interval.toString()])
      .where('oncredit.branchId', form.branchId.toString())
  }
}
