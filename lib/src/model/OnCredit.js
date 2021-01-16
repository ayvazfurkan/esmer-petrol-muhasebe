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
      .where('oncredit.isDeleted', 0)
      .orderBy('oncredit.id', 'desc')

    if (!_.isEmpty(form.customerId)) {
      q.where('oncredit.customerId', form.customerId.toString())
    }
    if (!_.isEmpty(form.dateStart)) {
      q.whereRaw('date(oncredit.createDate) >= ?', [form.dateStart.toString()])
    }
    if (!_.isEmpty(form.dateEnd)) {
      q.whereRaw('date(oncredit.createDate) <= ?', [form.dateEnd.toString()])
    }

    return q
  }

  summaryByCustomer (form) {
    return this.db('oncredit')
      .select(this.db.raw('SUBSTRING(customer.name, 1, 30) as customer'))
      .sum('oncredit.totalPrice as total')
      .groupBy('oncredit.customerId')
      .orderBy('total', 'desc')
      .leftJoin('customer', 'customer.id', 'oncredit.customerId')
      .where('oncredit.branchId', form.branchId.toString())
      .where('oncredit.isDeleted', 0)
      .limit(6)
  }

  summaryBySegment (form) {
    return this.db('oncredit')
      .select(this.db.raw('ifnull(segment.name, \'Tanımsız\') as segment'))
      .sum('oncredit.totalPrice as total')
      .groupBy('segment.id')
      .leftJoin('customer', 'customer.id', 'oncredit.customerId')
      .leftJoin('customerSegment', 'customer.id', 'customerSegment.customerId')
      .leftJoin('segment', 'customerSegment.segmentId', 'segment.id')
      .where('oncredit.branchId', form.branchId.toString())
      .where('oncredit.isDeleted', 0)
      .limit(6)
  }

  summaryByProduct (form) {
    return this.db('oncreditProduct')
      .select(this.db.raw('ifnull(product.name, \'Diğer\') as product'))
      .select(this.db.raw('round(sum(if(oncreditProduct.productId is null, oncreditProduct.price, oncreditProduct.price * oncreditProduct.amount))) as total'))
      .groupBy('product')
      .orderBy('total', 'desc')
      .leftJoin('oncredit', 'oncredit.id', 'oncreditProduct.oncreditId')
      .leftJoin('product', 'product.id', 'oncreditProduct.productId')
      .where('oncredit.branchId', form.branchId.toString())
      .where('oncredit.isDeleted', 0)
      .limit(6)
  }

  summaryPeriodic (form) {
    return this.db('oncredit')
      .select('oncredit.createDate as date')
      .sum('oncredit.totalPrice as total')
      .groupByRaw('YEAR(oncredit.createDate)')
      .groupByRaw('MONTH(oncredit.createDate)')
      .groupByRaw('DAY(oncredit.createDate)')
      .whereRaw('oncredit.createDate >= CURRENT_DATE - INTERVAL ? DAY', [form.interval.toString()])
      .where('oncredit.branchId', form.branchId.toString())
      .where('oncredit.isDeleted', 0)
  }
}
