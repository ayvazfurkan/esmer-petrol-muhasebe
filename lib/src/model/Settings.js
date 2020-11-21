import Database from './Database'
import bcrypt from 'bcrypt'

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
}
