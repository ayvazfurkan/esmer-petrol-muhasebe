<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Segmentler</h6>
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
                        <div class="col-md-9">
                            <div class="text-right">
                                <button class="btn btn-sm btn-outline-success" @click="newSegment()">
                                    <i class="ri-user-add-line"></i> Segment Ekle
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
                    <div class="table-responsive" v-if="segmentList.length > 0">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Segment Adı</th>
                                    <th>Türü</th>
                                    <th>Müşteri Sayısı</th>
                                    <th class="text-right">İşlemler</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(segment,i) in segmentList" @click="detail(segment.id)">
                                    <th>{{i + 1}}</th>
                                    <td>{{segment.name}}</td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right">
                                        <button class="btn btn-sm btn-light">
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
                segmentList: [],
                quickSearch: ""
            }
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        mounted() {
            this.getSegments()
        },
        methods: {
            getSegments() {
                new Promise(function (resolve) {
                    ipcRenderer.send("/segmentList")
                    ipcRenderer.on('segmentList', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    this.segmentList = result
                })
            },
            detail(segmentId) {
                this.$router.push("/DetailSegment/" + segmentId)
            },
            newSegment() {
                this.$router.push("/NewSegment")
            }
        },
        mixins: [genericMethods],
    }
</script>