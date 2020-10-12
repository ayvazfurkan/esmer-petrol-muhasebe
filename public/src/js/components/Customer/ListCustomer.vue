<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Müşteriler \ Müşteri Listesi</h6>
        </div>
        <div class="col-12 mb-3">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="input-group">
                                <input type="text"
                                       class="form-control form-control-sm"
                                       v-model="quickSearch"
                                       placeholder="Hızlı Arama">
                                <div class="input-group-append">
                                    <span class="input-group-text input-group-text-sm">
                                        <i class="ri-user-search-line"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <span class="dropdown form-dropdown">
                            <button class="btn btn-sm btn-light" data-toggle="dropdown">
                                <i class="ri-user-star-line"></i> Segment <i class="ri-arrow-down-s-line"></i>
                            </button>
                                  <div class="dropdown-menu" @click.stop>
                                    <a class="dropdown-item" href="#">
                                        <ul class="list-group list-group-flush">
                                          <li class="list-group-item d-flex justify-content-between align-items-center"
                                              v-for="(segment, i) of segmentList">
                                              <span @click="selectSegment(i)">{{segment.name}}</span>
                                            <span class="badge" v-if="segment.status"><i
                                                    class="ri-check-line text-success"></i></span>
                                          </li>
                                        </ul>
                                    </a>
                                </div>
                            </span>
                        </div>
                        <div class="col-md-6">
                            <div class="text-right">
                                <button class="btn btn-sm btn-outline-success" @click="newCustomer()">
                                    <i class="ri-user-add-line"></i> Müşteri Ekle
                                </button>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="ri-list-check"></i> İcmal Yazdır
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="customerList.length > 0">
                        <table class="table table-hover table-bordered">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>İsim / Unvan</th>
                                <th>Yetkili</th>
                                <th>TRY Bakiyesi</th>
                                <th>İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(customer,i) in customerList" @click="detail(customer.id)">
                                <th>{{i + 1}}</th>
                                <td>{{customer.name}}</td>
                                <td>{{customer.authorizedPersonName}}</td>
                                <td>0,00</td>
                                <td></td>
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
    </div>
</template>
<style>
    tr {
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
                customerList: {},
                segmentList: [],
                quickSearch: ""
            }
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        mounted() {
            this.getCustomers()
            this.setSegment()
        },
        methods: {
            getCustomers() {
                new Promise(function (resolve) {
                    ipcRenderer.send("/customerList")
                    ipcRenderer.on('customerList', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    this.customerList = result.result
                })
            },
            setSegment() {
                ipcRenderer.send("/segmentList")
                new Promise(function (resolve) {
                    ipcRenderer.on('segmentList', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    for (let segment of result) {
                        this.segmentList.push({id: segment.id, name: segment.name, status: false})
                    }
                })

            },
            selectSegment(i) {
                this.segmentList[i].status = !this.segmentList[i].status
            },
            detail(customerId) {
                this.$router.push("/DetailCustomer/" + customerId)
            },
            newCustomer() {
                this.$router.push("/NewCustomer")
            }
        },
        mixins: [genericMethods],
    }
</script>