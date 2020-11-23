import Database from './Database'
import bcrypt from 'bcrypt'
import moment from 'moment'

export default class Settings {
  constructor () {
    const dbObj = new Database()
    this.db = dbObj.connect()
  }

  getUser (userId) {
    const q = this.db('user')
    q.where('id', userId.toString())
    q.select('user.password')
    return q
  }

  getBranchDetail (branchId) {
    branchId = branchId || ''
    const q = this.db('branch')
    q.where('id', branchId)
    q.select('*')
    return q
  }

  updatePassword (form) {
    const q = this.db('user')
    const newPassword = bcrypt.hashSync(form.newPassword, 10)
    q.where('id', form.id.toString())
    q.update({ password: newPassword })

    return q
  }

  validatePassword (form, userData) {
    const errors = {}
    if (form.newPassword.length < 6) {
      errors.newPassword = 'Yeni şifre 6 karakterden küçük olamaz.'
    }
    if (form.newPassword !== form.newPasswordCheck) {
      errors.newPassword = 'Şifreler eşleşmiyor.'
      errors.newPasswordCheck = 'Şifreler eşleşmiyor.'
    }
    if (!bcrypt.compareSync(form.currentPassword, userData.password)) {
      errors.currentPassword = 'Geçersiz şifre.'
    }
    return {
      status: Object.keys(errors).length === 0,
      errors
    }
  }

  static setParamsPassword (form) {
    return {
      id: form.userId || '',
      currentPassword: form.currentPassword || '',
      newPassword: (form.newPassword && form.newPassword.trim()) || '',
      newPasswordCheck: (form.newPasswordCheck && form.newPasswordCheck.trim()) || ''
    }
  }

  setBranchParams (params) {
    return {
      id: params.id || '',
      name: (params.name && params.name.trim()) || '',
      phone: params.phone || '',
      address: params.address || '',
      taxNumber: params.taxNumber || '',
      taxOffice: params.taxOffice || '',
      pumpPrinterIP: params.pumpPrinterIP || '',
      pumpPrinterVid: params.pumpPrinterVid || '',
      pumpPrinterPid: params.pumpPrinterPid || '',
      pumpPrinterCopy: params.pumpPrinterCopy || '',
      receiptAgreement: params.receiptAgreement || '',
      pumpPrinterBeep: params.pumpPrinterBeep || 0,
      updaterId: params.creatorId || '',
      updateDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  branchValidate (form) {
    const exception = {}

    if (isNaN(form.id) || form.id.length < 1) {
      exception.id = 'Şube ID bilgisi elde edilemedi.'
    }
    if (form.name.length < 3) {
      exception.name = 'Şirket adı 3 karakterden küçük olamaz.'
    }
    if (form.address.length < 10) {
      exception.address = 'Adres bilgisi 10 karakterden küçük olamaz.'
    }
    if (form.taxNumber.length !== 10) {
      exception.taxNumber = 'Vergi numarası 10 karakter olmak zorundadır.'
    }
    if (form.taxOffice.length < 3) {
      exception.taxOffice = 'Vergi dairesi 3 karakterden küçük olamaz.'
    }
    if (isNaN(form.pumpPrinterCopy)) {
      exception.pumpPrinterCopy = 'Yazıcı kopya sayısı 1 ile 5 arasında olabilir.'
    }
    if (form.pumpPrinterCopy < 1) {
      exception.pumpPrinterCopy = 'Yazıcı kopya sayısı en az 1 olabliir.'
    }
    if (form.pumpPrinterCopy > 5) {
      exception.pumpPrinterCopy = 'Yazıcı kopya sayısı en fazla 5 olabliir.'
    }
    return {
      status: Object.keys(exception).length === 0,
      exception
    }
  }

  branchSave (form) {
    if (form.id > 0) {
      return this.db('branch')
        .where('id', form.id)
        .update(form)
    } else {
      return false
    }
  }
}
