<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 mb-3">
            <div class="row pb-3 pt-2">
                <div class="col align-self-center">
                    <h6 class="text-transparent mb-0">Stok \ Ürünler \ Ürün Oluştur</h6>
                </div>
            </div>
            <div class="card p-4">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label>Ürün Adı</label>
                        <div class="input-group" :class="invalidField(exception.name)">
                            <input type="text"
                                   class="form-control"
                                   maxlength="50"
                                   v-model="productInformation.name">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-user-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.name">{{exception.name}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Ürün Adı (İngilizce)</label>
                        <div class="input-group" :class="invalidField(exception.nameInEnglish)">
                            <input type="text"
                                   class="form-control"
                                   maxlength="50"
                                   v-model="productInformation.nameInEnglish">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-user-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.nameInEnglish">{{exception.nameInEnglish}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Ambalaj Ürünü Mü?</label>
                        <div class="input-group" :class="invalidField(exception.packagingProduct)">
                            <multiselect
                                    v-model="productInformation.packagingProduct"
                                    placeholder=""
                                    :options="packagingProduct"
                                    selectLabel="Seç"
                                    deselectLabel="İptal Et"
                                    noResult="Sonuç bulunamadı."
                                    selectedLabel="Seçildi"
                                    track-by="id"
                                    label="name"
                                    :custom-label="multiselectSearcher">
                                <span slot="noOptions">Yazmaya devam edin.</span>
                                <span slot="noResult">Sonuç bulunamadı.</span>
                            </multiselect>
                        </div>
                        <span class="text-danger" v-if="exception.packagingProduct">{{exception.packagingProduct}}</span>
                    </div>
                    <!-- <div class="col-12 mb-3">
                        <label>Etiketler</label>
                        <multiselect v-model="productInformation.segment" tag-placeholder=""
                                     placeholder="" label="name" track-by="id" :options="segmentList"
                                     selectLabel="Seç"
                                     deselectLabel="İptal Et"
                                     noResult="Sonuç bulunamadı."
                                     selectedLabel="Seçildi"
                                     :multiple="true" :taggable="true" @tag="addTag"></multiselect>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="col-12 text-right">
            <button class="btn btn-sm btn-light" @click="reset">Sıfırla</button>
            <button class="btn btn-sm btn-primary" @click="save"
                    :class="{'disabled': !productInformation.name || waitingResponse || success}"
                    :disabled="!productInformation.name || waitingResponse || success">
                <span v-if="!waitingResponse && !Object.keys(exception).length && !success">Kaydet</span>
                <span v-if="!waitingResponse && Object.keys(exception).length">Yeniden Dene</span>
                <div v-if="waitingResponse">
                    <div class="spinner-border"></div>
                    Kaydediliyor
                </div>
                <span v-if="success">Başarılı</span>
            </button>
        </div>
    </div>
</template>
<script>
    import genericMethods from "../../mixins/genericMethods";
    import Multiselect from "vue-multiselect"
    import {ipcRenderer} from "electron"
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                exception: {},
                productInformation: {},
                packagingProduct: [
                    {id: 1, name: "Evet"},
                    {id: 0, name: "Hayır"},
                ],
                waitingResponse: false,
                success: false
            }
        },
        components: {
             Multiselect
        },
        mixins: [genericMethods],
        computed: {
            ...mapGetters(["getSession"])
        },
        methods: {
            save() {
                this.waitingResponse = true
                let result = ipcRenderer.sendSync("/newProduct", this.productInformation)

                if (!result.status) {
                    this.exception = result.exception
                    this.success = false
                    this.waitingResponse = false
                } else {
                    this.exception = {}
                    this.success = true
                    this.waitingResponse = false
                }
            },
            reset() {
                this.success = false
                this.waitingResponse = false
                this.exception = {}
                this.productInformation = {}
                this.productInformation.creatorId = this.getSession.userDetails.id
                this.productInformation.branchId = this.getSession.userDetails.branchId
            }
        }
    }
</script>