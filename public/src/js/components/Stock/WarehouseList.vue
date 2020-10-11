<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Stok \ Depo Listesi</h6>
        </div>
        <div class="col-6">
            <div class="card">
                <div class="card-body">
                    <div class="container-fluid px-0 mb-3">
                        <div class="row">
                            <div class="col-6 align-self-center">
                                <h6 class="mb-0">Depo Listesi</h6>
                            </div>
                            <div class="col-6 text-right">
                                <button class="btn btn-sm btn-outline-dark">
                                    <i class="ri-pie-chart-line"></i> Depo Raporu
                                </button>
                                <button class="btn btn-sm btn-outline-success"
                                        @click="showModal">
                                    <i class="ri-menu-add-line"></i> Depo Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="warehouseList.length > 0">
                        <div class="accordion" id="warehouseList">
                            <div class="card mb-3" v-for="(warehouse,i) in warehouseList">
                                <div class="card-header" :id="'heading' + i">
                                    <p class="mb-0" data-toggle="collapse" :data-target="'#collapse'+i">
                                        <i class="ri-home-6-line"></i> {{warehouse.name}}
                                    </p>
                                </div>
                                <div :id="'collapse'+i" class="collapse" :aria-labelledby="'heading' + i" data-parent="#warehouseList">
                                    <div class="card-body">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">ÜRÜN: </li>
                                            <li class="list-group-item">ÜRÜN: </li>
                                            <li class="list-group-item">ÜRÜN: </li>
                                            <li class="list-group-item">ÜRÜN: </li>
                                            <li class="list-group-item">ÜRÜN: </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="spinner-border text-primary"></div>
                        Yükleniyor..
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card">
                <div class="card-body">
                    <div class="container-fluid px-0 mb-3">
                        <div class="row">
                            <div class="col-6 align-self-center">
                                <h6 class="mb-0">Ürün Stok Özeti</h6>
                            </div>
                            <div class="col-6 text-right">
                                <button class="btn btn-sm btn-outline-dark">
                                    <i class="ri-bar-chart-line"></i> Ürün Raporu
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="spinner-border text-primary"></div>
                        Yükleniyor..
                    </div>
                </div>
            </div>
        </div>
        <modal name="createWarehouseModal">
            <div class="container-fluid p-5">
                <div class="row">
                    <div class="col-12">
                        <h5 class="mb-5">Yeni Depo Ekle</h5>
                    </div>
                    <div class="col-12 mb-5">
                        <label>Depo Adı</label>
                        <div class="input-group" :class="invalidField(exception.name)">
                            <input type="text"
                                   class="form-control"
                                   v-model="newWarehouse.name" @keyup="newWarehouse.name = makeTitle(newWarehouse.name)">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-home-6-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.name">{{exception.name}}</span>
                    </div>
                    <div class="col-12 text-right">
                        <button class="btn btn-outline-primary" @click="create"
                                :disabled="waitingResponse || newWarehouse.name.length < 4">
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
    import {ipcRenderer} from "electron";
    import genericMethods from "../../mixins/genericMethods";
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                warehouseList: [],
                newWarehouse: {
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
            this.newWarehouse.userId = this.getSession.userDetails.id
            this.newWarehouse.branchId = this.getSession.userDetails.branchId
        },
        methods: {
            get() {
                ipcRenderer.send("/warehouseList", {name})
                new Promise(function (resolve) {
                    ipcRenderer.on('warehouseList', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    this.warehouseList = result
                })
            },
            create() {
                this.waitingResponse = true
                let result = ipcRenderer.sendSync("/createWarehouse", this.newWarehouse)

                if (!result.status) {
                    this.exception = result.exception
                    this.success = false
                    this.waitingResponse = false
                } else {
                    setTimeout(() => {
                        this.warehouseList.push({name: this.newWarehouse.name})
                        this.newWarehouse.name = ""
                        this.$modal.hide('createWarehouseModal')
                        this.exception = {}
                        this.success = true
                        this.waitingResponse = false
                    }, 1000)
                }
            },
            showModal() {
                this.$modal.show('createWarehouseModal')
            }
        },
        mixins: [genericMethods],
    }
</script>