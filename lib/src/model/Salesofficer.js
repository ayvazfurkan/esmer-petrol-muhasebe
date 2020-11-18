import Database from './Database'
import _ from 'lodash'
import moment from 'moment'

export default class Salesofficer {
  constructor () {
    const dbObj = new Database()
    this.db = dbObj.connect()
  }

  get (form) {
    return this.db('salesofficer')
      .select('*')
      .where('branchId', form.branchId.toString())
      .where('isDeleted', 0)
  }

  create (form) {
    return this.db('salesofficer').insert(form)
  }

  update (form) {
    let data
    const q = this.db('salesofficer')
    if (!_.isEmpty(form.isDeleted)) {
      data = { isDeleted: form.isDeleted.toString() }
    }
    if (!_.isEmpty(form.form)) {
      data = form.form
    }
    q.where('id', form.id.toString())
    q.update(data)

    return q
  }

  static validateCreate (form) {
    const errors = {}
    if (!form.branchId) {
      errors.general = 'Şube kodu elde edilemedi.'
    }
    if (_.isEmpty(form.name) || form.name.length < 5) {
      errors.name = 'İsim bilgisi boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (_.isEmpty(form.username) || form.username.length < 5) {
      errors.username = 'Kullanıcı adı bilgisi boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (!_.isEmpty(form.form.phone) && form.form.phone.length < 10) {
      errors.phone = 'Telefon numarası 05XXX ile başlamalı.'
    }
    if (!_.isEmpty(form.form.phone) && form.form.phone.length > 11) {
      errors.phone = 'Telefon numarası en fazla 11 karakter olabilir.'
    }
    return {
      status: Object.keys(errors).length !== 0,
      errors
    }
  }

  static validateUpdate (form) {
    const errors = {}
    if (!form.id) {
      errors.general = form.id
    }
    if (_.isEmpty(form.form.name) || form.form.name.length < 5) {
      errors.name = 'Bu alan boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (_.isEmpty(form.form.username) || form.form.username.length < 5) {
      errors.username = 'Kullanıcı adı bilgisi boş bırakılamaz ve 5 karakterden küçük olamaz.'
    }
    if (!_.isEmpty(form.form.phone) && form.form.phone.length < 10) {
      errors.phone = 'Telefon numarası 05XXX ile başlamalı.'
    }
    if (!_.isEmpty(form.form.phone) && form.form.phone.length > 11) {
      errors.phone = 'Telefon numarası en fazla 11 karakter olabilir.'
    }
    return {
      status: Object.keys(errors).length !== 0,
      errors
    }
  }

  static setCreateParams (form) {
    return {
      branchId: form.branchId || '',
      name: (form.name && form.name.trim()) || '',
      username: (form.username && form.username.trim()) || '',
      img: (form.img && form.img.trim()) || '',
      phone: form.phone || '',
      insertDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
