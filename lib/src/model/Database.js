import knex from "knex"
import net from "net"
import fs from "fs"
import path from "path"
import "regenerator-runtime/runtime";

export default class Database {

    connect() {
        let credentials = {},
            credentialPath = path.normalize("./lib/dbcredentials.json"),
            connectionDetails =  JSON.parse(fs.readFileSync(credentialPath))
        credentials.client = "mysql"
        credentials.connection = connectionDetails
        return knex(credentials)
    }

    tryConnect(params) {
        let instance = knex({
            client: "mysql",
            connection: {
                host: params.host,
                port: params.port,
                user: params.user,
                password: params.password,
                database: params.database
            }
        });

        return instance.select("*").from("user").limit(1)
    }

    getParameters() {
        let credentialPath = path.normalize("./lib/dbcredentials.json")
        if (!fs.existsSync(credentialPath)) {
            return {}
        }

        return JSON.parse(fs.readFileSync(credentialPath));
    }

    save(formData) {
        let targetFilename = path.normalize("./lib/dbcredentials.json"),
            content = JSON.stringify(formData)
        return fs.promises.writeFile(targetFilename, content, function (err) {
            if (err) reject(err);
            else resolve(content);
        });
    }

    setParams(params) {
        return {
            host: params.host && params.host.trim() || "",
            port: params.port && params.port.trim() || "",
            database: params.database && params.database.trim() || "",
            user: params.user && params.user.trim() || "",
            password: params.password && params.password.trim() || "",
        }
    }

    validation(form) {
        let exception = {}
        if (form.host !== "localhost" && !net.isIP(form.host)) {
            exception.host = "Geçersiz IP adresi."
        }
        if (isNaN(form.port)) {
            exception.port = "Geçersiz port bilgisi."
        }
        if (form.database.length < 1) {
            exception.database = "Geçersiz veritabanı ismi."
        }
        if (form.user.length < 1) {
            exception.user = "Geçersiz kullanıcı ismi."
        }
        if (form.password.length < 1) {
            exception.password = "Geçersiz şifre."
        }

        return {
            status: Object.keys(exception).length === 0,
            exception: exception
        }
    }
}