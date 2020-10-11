<template>
    <div class="container-fluid p-0">
        <div class="row">
            <i class="close-app ri-close-line" @click="closeApp()"></i>
            <div class="col-4 text-center align-self-center bg-light">
                <img src="../../../img/logo-blx.png" class="img-fluid">
            </div>
            <div class="col-8 bg-white py-5">
                <div class="row pl-5">
                    <div class="col-12 mb-2">
                        <h2 class="text-transparent">BLX.FINDIK</h2>
                    </div>
                    <div class="col-12 mb-3">
                        <label>Kullanıcı Adı</label>
                        <div class="input-group" :class="invalidField(exception.username)">
                            <input class="form-control" type="text" v-model="user.username" ref="usernameInput"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.username, 'ri-user-3-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.username">{{exception.username}}</span>
                    </div>
                    <div class="col-12 mb-4">
                        <label>Şifre</label>
                        <div class="input-group" :class="invalidField(exception.password)">
                            <input class="form-control" type="password" v-model="user.password"
                                   @keyup.enter="authenticate"/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <i :class="invalidIcon(exception.password, 'ri-lock-line')"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.password">{{exception.password}}</span>
                    </div>
                    <div class="col-12 text-right">
                        <button class="btn btn-outline-dark"
                                :class="{'disabled': !user.username || !user.password || waitingResponse || success}"
                                :disabled="!user.username || !user.password || waitingResponse || success"
                                @click="authenticate">
                            <span v-if="!waitingResponse && !Object.keys(exception).length && !success">Giriş</span>
                            <span v-if="!waitingResponse && Object.keys(exception).length">Yeniden Dene</span>
                            <div v-if="waitingResponse">
                                <div class="spinner-border text-primary"></div>
                                Doğrulanıyor
                            </div>
                            <span v-if="success">Başarılı</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-danger shadow rounded mt-3" v-if="exception.general">
            <i class="ri-error-warning-line"></i> <strong>Hata!</strong> {{exception.general}}
        </div>
    </div>
</template>
<style>
    .close-app {
        position: absolute;
        right: .6rem;
        top: .5rem;
        z-index: 1;
        font-size: 24px;
        color: #495057;
        cursor: pointer
    }
</style>
<script>
    import {ipcRenderer, remote} from "electron"
    import {mapState, mapGetters, mapActions} from "vuex"
    import genericMethods from "../../mixins/genericMethods"

    export default {
        data() {
            return {
                user: {},
                exception: {},
                success: false,
                waitingResponse: false
            }
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        mounted() {
            this.$refs.usernameInput.focus()
            if (this.getSession.userDetails) {
               this.login()
            }
        },
        methods: {
            ...mapActions(["appendSession"]),
            authenticate() {
                let result = ipcRenderer.sendSync("/auth", this.user)
                this.waitingResponse = true
                if (!result.status) {
                    setTimeout(() => {
                        this.exception = result.exception
                        this.waitingResponse = false
                    }, 1000)
                    return false
                } else {
                    setTimeout(() => {
                        this.appendSession({userDetails: result.userDetails[0]})
                        this.login()
                    }, 1000)
                    return false
                }
            },
            login() {
                this.exception = {}
                this.waitingResponse = false
                this.success = true
                this.$router.push("/NewCustomer")
                remote.getCurrentWindow().maximize()
                remote.getCurrentWindow().setMinimumSize(1200, 600);
            },
            closeApp() {
                remote.getCurrentWindow().close()
            }
        },
        mixins: [genericMethods],
    }
</script>