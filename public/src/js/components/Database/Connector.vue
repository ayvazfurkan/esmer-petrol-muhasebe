<template>
    <div class="row">
        <div class="offset-md-2 col-md-8 mt-4">
            <div class="alert alert-danger shadow">
                <i class="ri-error-warning-line"></i> <strong>Hata!</strong>
                Veritabanı bağlantısı kurulamadı. Devam etmek için lütfen veritabanı bilgilerini giriniz.
            </div>
        </div>
        <div class="offset-md-2 col-md-8">
            <div class="card shadow p-5 rounded">
                <div class="row">
                    <div class="col-12 mb-3">
                        <h2 class="text-transparent">Veritabanı Bilgileri</h2>
                    </div>
                    <div class="col-md-8 mb-3">
                        <label>Sunucu Adresi</label>
                        <div class="input-group" :class="invalidField(exception.host)">
                            <input class="form-control" type="text" v-model="database.host" maxlength="15"
                                   placeholder="localhost"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.host, 'ri-lib-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.host">{{exception.host}}</span>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label>Port</label>
                        <div class="input-group" :class="invalidField(exception.port)">
                            <input class="form-control" type="text" v-model="database.port" maxlength="4"
                                   placeholder="3306"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.port, 'ri-git-commit-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.port">{{exception.port}}</span>
                    </div>
                    <div class="col-12 mb-3">
                        <label>Veritabanı Adı</label>
                        <div class="input-group" :class="invalidField(exception.database)">
                            <input class="form-control" type="text" v-model="database.database" maxlength="50"
                                   placeholder="BLX.Findik"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.database, 'ri-database-2-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.database">{{exception.database}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Kullanıcı Adı</label>
                        <div class="input-group" :class="invalidField(exception.user)">
                            <input class="form-control" type="text" v-model="database.user" maxlength="50"
                                   placeholder="root"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.user, 'ri-user-3-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.user">{{exception.user}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Şifre</label>
                        <div class="input-group" :class="invalidField(exception.password)">
                            <input class="form-control" type="password" v-model="database.password" maxlength="50"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.password, 'ri-lock-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.password">{{exception.password}}</span>
                    </div>
                    <div class="col-md-6">
                        <!-- BURAYA CANLI SISTEM VEYA DEMO ORTAMI ICIN BIR RADIO SECENEK GELECEK -->
                    </div>
                    <div class="col-md-6 mt-2 mb-3 text-right">
                        <button class="btn btn-dark" :class="{'disabled': waitingResponse || success }"
                                :disabled="waitingResponse || success || !database.password || !database.user || !database.host || !database.database"
                                @click="connect">
                            <span v-if="!waitingResponse && !Object.keys(exception).length">Bağlan</span>
                            <span v-if="!waitingResponse && Object.keys(exception).length">Yeniden Dene</span>
                            <div v-if="waitingResponse">
                                <div class="spinner-border text-light"></div>
                                Doğrulanıyor
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="offset-md-2 col-md-8 mt-4" v-if="exception.connection">
            <div class="alert alert-danger shadow">
                <i class="ri-error-warning-line"></i> <strong>Hata!</strong> {{exception.connection}}
            </div>
        </div>
        <div class="offset-md-2 col-md-8 mt-4" v-if="success">
            <div class="alert alert-success shadow">
                <i class="ri-check-line"></i> <strong>Başarılı!</strong> Veritabanı bağlantısı başarılı.
                Giriş sayfasına yönlendiriliyorsunuz.
            </div>
        </div>
    </div>
</template>
<script>
    import {ipcRenderer} from "electron"
    import genericMethods from "../../mixins/genericMethods";

    export default {
        data() {
            return {
                database: {
                    host: "localhost",
                    user: "root",
                    database: "blxfindik"
                },
                exception: {},
                success: false,
                waitingResponse: false
            }
        },
        methods: {
            connect() {
                this.waitingResponse = true
                let result = ipcRenderer.sendSync("/databaseConnector", this.database)
                if (result.status === true) {
                    this.waitingResponse = false
                    this.success = true
                    setTimeout(() => {
                        this.$router.push("/Login")
                    }, 2000)
                } else {
                    this.waitingResponse = false
                    this.exception = result.exception
                }
                console.log(result)
            }
        },
        mixins: [genericMethods],
    }
</script>