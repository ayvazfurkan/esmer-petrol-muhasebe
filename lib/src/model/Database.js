import knex from 'knex'
import net from 'net'
import fs from 'fs'
import path from 'path'

export default class Database {
  connect () {
    const credentials = {}
    const credentialPath = path.join(__dirname, path.normalize('../../../lib/dbcredentials.json'))
    const connectionDetails = JSON.parse(fs.readFileSync(credentialPath))
    credentials.client = 'mysql'
    credentials.connection = connectionDetails
    return knex(credentials)
  }

  tryConnect (params) {
    const instance = knex({
      client: 'mysql',
      connection: {
        host: params.host,
        port: params.port,
        user: params.user,
        password: params.password,
        database: params.database
      }
    })

    return instance.select('*').from('user').limit(1)
  }

  getParameters () {
    const credentialPath = path.join(__dirname, path.normalize('../../../lib/dbcredentials.json'))
    if (!fs.existsSync(credentialPath)) {
      return {}
    }
    const credentials = fs.readFileSync(credentialPath)
    return JSON.parse(credentials)
  }

  save (formData) {
    const targetFilename = path.join(__dirname, path.normalize('../../../lib/dbcredentials.json'))
    const content = JSON.stringify(formData)
    return fs.promises.writeFile(targetFilename, content, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  }

  setParams (params) {
    return {
      host: params.host && params.host.trim() || '',
      port: params.port && params.port.trim() || '',
      database: params.database && params.database.trim() || '',
      user: params.user && params.user.trim() || '',
      password: params.password && params.password.trim() || ''
    }
  }

  validation (form) {
    const exception = {}
    if (form.host !== 'localhost' && !net.isIP(form.host)) {
      exception.host = 'Geçersiz IP adresi.'
    }
    if (isNaN(form.port)) {
      exception.port = 'Geçersiz port bilgisi.'
    }
    if (form.database.length < 1) {
      exception.database = 'Geçersiz veritabanı ismi.'
    }
    if (form.user.length < 1) {
      exception.user = 'Geçersiz kullanıcı ismi.'
    }
    if (form.password.length < 1) {
      exception.password = 'Geçersiz şifre.'
    }

    return {
      status: Object.keys(exception).length === 0,
      exception: exception
    }
  }
}
