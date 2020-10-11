<template>
    <div class="container-fluid px-0 m-0 frame-menu pr-0 bg-white">
        <div class="row mx-0">
            <div class="col-xl-2 col-md-2 align-self-center bg-primary text-white py-4">
                <i class="ri-menu-2-fill"></i>
                <span class="app-name">BLX.FINDIK</span>
            </div>
            <div class="col-xl-4 col-md-5 align-self-center bg-white py-2">
                <div class="input-group no-drag">
                    <multiselect
                            v-model="quickSearch"
                            placeholder="Hızlı Ara"
                            :options="searchResults"
                            selectLabel="Seçmek için Enter"
                            deselectLabel="İptal için Enter"
                            noResult="Sonuç bulunamadı."
                            selectedLabel="Seçildi"
                            track-by="id"
                            label="name"
                            :custom-label="multiselectSearcher"
                            @search-change="search"
                            @input="redirect">
                        <span slot="noOptions">Yazmaya devam edin.</span>
                        <span slot="noResult">Sonuç bulunamadı.</span>
                    </multiselect>
                </div>
            </div>
            <div class="col-xl-6 col-md-5 text-right px-0 pt-2 pb-1 bg-white text-primary align-self-center">
                <span>
                    <i class="frame-control ri-notification-3-line mr-5"></i>
                    <i class="frame-control ri-mail-line mr-5"></i>
                    <i class="frame-control ri-star-line mr-5"></i>
                    <i class="frame-control ri-settings-5-line mr-5"></i>
                    <i class="frame-control ri-lock-line mr-5"></i>
                    <span class="dropdown">
                        <i class="frame-control ri-user-3-line dropdown-toggle mr-5" data-toggle="dropdown"></i>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                            <span class="dropdown-item-text"> {{getSession.userDetails.username}}</span>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" @click="logout">
                                <i class="ri-logout-box-line"></i> Güvenli Çıkış
                            </a>
                        </div>
                    </span>
                </span>
                <span class="frame-control mr-3 ml-5 text-dark" @click="minimize()">
                    <i class="ri-subtract-line "></i>
                </span>
                <span class="frame-control mx-3  text-dark" @click="maximize()">
                    <i :class="[fullScreen ? 'ri-fullscreen-exit-line' : 'ri-checkbox-blank-line']"></i>
                </span>
                <span class="frame-control exit mx-3 text-dark" @click="close()">
                    <i class="ri-close-line"></i>
                </span>
            </div>
        </div>
    </div>
</template>
<style>
    .frame-menu {
        position: fixed;
        -webkit-app-region: drag;
        top: 0;
        right: 0;
        z-index: 999999999999999;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .frame-control {
        -webkit-app-region: no-drag;
        padding-top: .3rem;
        font-size: 1.25rem;
        cursor: pointer;
    }

    .frame-control:hover {
        color: rgba(0, 0, 0, .75)
    }

    .frame-control.exit:hover {
        color: red;
    }

    .app-name {
        letter-spacing: 4px;
        font-weight: 400;
    }

    .no-drag {
        -webkit-app-region: no-drag;
    }

    .nav-buttons {
        font-size: 1rem;
        cursor: pointer;
    }
</style>
<script type="application/javascript">
    import {mapActions, mapGetters} from "vuex";
    import genericMethods from "../mixins/genericMethods";
    import Multiselect from "vue-multiselect"
    import {ipcRenderer} from "electron";

    export default {
        data() {
            return {
                currentWindow: "",
                fullScreen: false,
                quickSearch: [],
                searchResults: [],
            }
        },
        components: {Multiselect},
        mounted: function () {
            const {remote} = require('electron');
            this.currentWindow = remote.getCurrentWindow();
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        methods: {
            ...mapActions(["destroySession"]),
            minimize() {
                this.currentWindow.minimize();
            },
            maximize() {
                if (this.currentWindow.isMaximized()) {
                    this.currentWindow.unmaximize();
                    this.fullScreen = false;
                } else {
                    this.currentWindow.maximize();
                    this.fullScreen = true;
                }
            },
            isMaximized() {
                return this.currentWindow.isMaximized();
            },
            close() {
                this.currentWindow.close();
            },
            logout() {
                this.destroySession();
                this.close();
            },
            search(name) {
                ipcRenderer.removeAllListeners("searchResults")
                this.searchResults = []
                if (name.length < 3) {
                    return false
                }
                ipcRenderer.send("/quickSearch", {name})
                new Promise(function (resolve) {
                    ipcRenderer.on('searchResults', (event, result) => {
                        resolve(result);
                    })
                }).then(result => {
                        this.searchResults = []
                        for (let item of result) {
                            this.searchResults.push({
                                id: item.id,
                                name: item.name + (item.surname && " " + item.surname || "")
                            })
                        }
                    }
                )
            },
            redirect() {
                this.$router.push("/DetailCustomer/" + this.quickSearch.id)
                this.quickSearch = []
            }
        },
        mixins: [genericMethods],
    }
</script>