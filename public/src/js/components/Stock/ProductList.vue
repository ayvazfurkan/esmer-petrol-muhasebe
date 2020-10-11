<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Stok \ Ürün Listesi</h6>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="container-fluid px-0 mb-3">
                        <div class="row">
                            <div class="col-6 align-self-center">
                                <h6 class="mb-0">Ürün Listesi</h6>
                            </div>
                            <div class="col-6 text-right">
                                <button class="btn btn-sm btn-outline-success" @click="newProduct()">
                                    <i class="ri-menu-add-line"></i> Ürün Oluştur
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
    import Multiselect from "vue-multiselect"
    import {mapGetters} from "vuex";

    export default {
        components: {Multiselect},
        data() {
            return {
                productList: [],
                newProduct: {
                    name: "",
                    nameInEnglish: "",
                },
                warehouseList: [],
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
            this.newProduct.userId = this.getSession.userDetails.id
            this.newProduct.branchId = this.getSession.userDetails.branchId
        },
        methods: {
            get() {
                ipcRenderer.send("/productList", {name})
                new Promise(function (resolve) {
                    ipcRenderer.on('productList', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    this.productList = result
                })
            },
            newProduct() {
                this.$router.push("/NewProduct")
            }
        },
        mixins: [genericMethods],
    }
</script>