<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Fındık İşlemleri \ Ürün Bölgeleri</h6>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-6 align-self-center">
                            <h6 class="mb-0">Bölge Listesi</h6>
                        </div>
                        <div class="col-6 text-right">
                            <button class="btn btn-sm btn-outline-success"
                                    @click="showCreateModal">
                                <i class="ri-map-pin-add-line"></i> Bölge Ekle
                            </button>
                        </div>
                    </div>
                    <div class="table-responsive" v-if="regionList.length > 0">
                        <table class="table table-hover table-bordered">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Bölge Adı</th>
                                <th>Ekleyen</th>
                                <th>Eklenme Tarihi</th>
                                <th class="text-right">İşlemler</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(region,i) in regionList">
                                <th>{{i + 1}}</th>
                                <td>{{region.name}}</td>
                                <td>{{region.username}}</td>
                                <td>{{region.createDate && moment(region.createDate).format("LLL") || ""}}</td>
                                <td class="text-right">
                                    <button class="btn btn-sm btn-outline-danger" @click="showDeleteModal(i)">
                                        <i class="ri-close-line"></i> Sil
                                    </button>
                                    <button class="btn btn-sm btn-light" @click="showEditModal(i)">
                                        <i class="ri-edit-line"></i> Düzenle
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <div class="spinner-border text-primary"></div>
                        Yükleniyor..
                    </div>
                </div>
            </div>
        </div>
        <modal name="createRegionModal">
            <div class="container-fluid p-5">
                <div class="row">
                    <div class="col-12">
                        <h5 class="mb-5">Yeni Bölge Ekle</h5>
                    </div>
                    <div class="col-12 mb-5">
                        <label>Bölge Adı</label>
                        <div class="input-group" :class="invalidField(exception.name)">
                            <input type="text"
                                   class="form-control"
                                   v-model="newRegion.name" @keyup="newRegion.name = makeTitle(newRegion.name)">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-map-pin-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.name">{{exception.name}}</span>
                    </div>
                    <div class="col-12 text-right">
                        <button class="btn btn-outline-primary" @click="create"
                                :disabled="waitingResponse || newRegion.name.length < 4">
                            <div v-if="waitingResponse">
                                <div class="spinner-border text-primary"></div>
                                Kaydediliyor..
                            </div>
                            <span v-if="success || !waitingResponse"><i class="ri-add-circle-line"></i> Kaydet</span>

                        </button>
                    </div>
                </div>
            </div>
        </modal>
        <modal name="editRegionModal">
            <div class="container-fluid p-5">
                <div class="row">
                    <div class="col-12">
                        <h5 class="mb-5">Bölge Düzenle</h5>
                    </div>
                    <div class="col-12 mb-5">
                        <label>Bölge Adı</label>
                        <div class="input-group" :class="invalidField(exception.name)">
                            <input type="text"
                                   class="form-control"
                                   v-model="editRegion.name" @keyup="editRegion.name = makeTitle(editRegion.name)">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-map-pin-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.name">{{exception.name}}</span>
                    </div>
                    <div class="col-12 text-right">
                        <button class="btn btn-outline-primary" @click="edit"
                                :disabled="waitingResponse || editRegion.name.length < 4">
                            <div v-if="waitingResponse">
                                <div class="spinner-border text-primary"></div>
                                Kaydediliyor..
                            </div>
                            <span v-if="success || !waitingResponse"><i class="ri-add-circle-line"></i> Kaydet</span>
                        </button>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>
<style>
    [data-toggle=collapse] {
        cursor: pointer;
    }
</style>
<script>
    import {ipcRenderer} from "electron"
    import genericMethods from "../../mixins/genericMethods"
    import {mapGetters} from "vuex"
    import moment from "moment"

    export default {
        data() {
            return {
                regionList: [],
                newRegion: {
                    name: ""
                },
                editRegion: {
                    name: ""
                },
                exception: {},
                quickSearch: "",
                waitingResponse: false,
                success: false
            }
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        mounted() {
            this.get()
            this.newRegion.userId = this.getSession.userDetails.id
            this.newRegion.branchId = this.getSession.userDetails.branchId
        },
        methods: {
            get() {
                ipcRenderer.send("/regionList", {name})
                new Promise(function (resolve) {
                    ipcRenderer.on('regionList', (e, result) => {
                        resolve(result)
                    })
                }).then(result => {
                    this.regionList = result
                })
            },
            create() {
                this.waitingResponse = true
                ipcRenderer.send("/createRegion", this.newRegion)
                new Promise(function (resolve) {
                    ipcRenderer.on('createRegion', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    if (!result.status) {
                        this.exception = result.exception
                        this.success = false
                        this.waitingResponse = false
                    } else {
                        setTimeout(() => {
                            this.regionList.push({name: this.newRegion.name, username:  this.getSession.userDetails.username})
                            this.newRegion.name = ""
                            this.$modal.hide('createRegionModal')
                            this.exception = {}
                            this.success = true
                            this.waitingResponse = false
                        }, 1000)
                    }
                })
            },
            showCreateModal() {
                this.$modal.show('createRegionModal')
            },
            showEditModal(i) {
                this.editRegion.index = i
                this.editRegion.name = this.regionList[i].name
                this.editRegion.id = this.regionList[i].id
                this.$modal.show('editRegionModal')
            },
            edit() {
                this.waitingResponse = true
                ipcRenderer.send("/editRegion", this.editRegion)
                new Promise(function (resolve) {
                    ipcRenderer.on('editRegion', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    if (!result.status) {
                        this.exception = result.exception
                        this.success = false
                        this.waitingResponse = false
                    } else {
                        setTimeout(() => {
                            this.regionList[this.editRegion.index] = {
                                name: this.editRegion.name,
                                username:  this.getSession.userDetails.username,
                                createDate: moment(new Date())
                            }
                            this.$modal.hide('editRegionModal')
                            this.exception = {}
                            this.success = true
                            this.waitingResponse = false
                        }, 1000)
                    }
                })
            },
            showDeleteModal(i) {
                this.$modal.show('dialog', {
                    title: 'Uyarı',
                    text: 'Bu kaydı silmek istediğinize emin misiniz?',
                    buttons: [
                        {
                        title: 'Vazgeç',
                        handler: () => {
                                this.$modal.hide('dialog')
                            }
                        },
                        {
                        title: 'Sil',
                        handler: () => {
                                this.del({id: this.regionList[i].id, index: i})
                            }
                        }
                    ]
                    })
            },
            del(form) {
                if (this.waitingResponse !== false) {
                    return false
                }
                this.waitingResponse = true
                ipcRenderer.send("/deleteRegion", {id: form.id})
                new Promise(function (resolve) {
                    ipcRenderer.on('deleteRegion', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    if (!result.status) {
                        console.error(result)
                    } else {
                        setTimeout(() => {
                            this.regionList.splice(form.index, 1);
                            this.$modal.hide('dialog')
                            this.waitingResponse = false
                        }, 500)
                    }
                })
            }
        },
        mixins: [genericMethods],
    }
</script>