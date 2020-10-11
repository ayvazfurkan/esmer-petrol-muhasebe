<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 mb-3">
            <div class="row pb-3 pt-2">
                <div class="col align-self-center">
                    <h6 class="text-transparent mb-0">Müşteriler \ Yeni Müşteri Ekle</h6>
                </div>
            </div>
            <div class="card p-4">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label>Müşteri Adı/Unvanı <span class="text-danger">*</span></label>
                        <div class="input-group" :class="invalidField(exception.name)">
                            <input type="text"
                                   class="form-control"
                                   maxlength="50"
                                   v-model="userInformation.name">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-user-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.name">{{exception.name}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Yetkili Adı</label>
                        <div class="input-group" :class="invalidField(exception.authorizedPersonName)">
                            <input type="text"
                                   class="form-control"
                                   v-model="userInformation.authorizedPersonName">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-user-2-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.authorizedPersonName">{{exception.authorizedPersonName}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Cep Telefonu <span class="text-danger">*</span></label>
                        <div class="input-group" :class="invalidField(exception.gsm)">
                            <input type="text"
                                   class="form-control" maxlength="12"
                                   v-model="userInformation.gsm">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-smartphone-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.gsm">{{exception.gsm}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>TC Kimlik Numarası</label>
                        <div class="input-group" :class="invalidField(exception.citizenIdentification)">
                            <input maxlength="11" minlength="11"
                                   class="form-control"
                                   v-model="userInformation.citizenIdentification">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-bank-card-2-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.citizenIdentification">{{exception.citizenIdentification}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Doğum Tarihi</label>
                        <div class="input-group" :class="invalidField(exception.birthDate)">
                            <date-picker v-model="userInformation.birthDate" format="DD.MM.YYYY"
                                         input-class="form-control">
                                <i class="input-group-text ri-calendar-event-line ri-fw ml-1" slot="icon-calendar"></i>
                            </date-picker>
                        </div>
                        <span class="text-danger" v-if="exception.birthDate">{{exception.birthDate}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Vergi Kimlik Numarası</label>
                        <div class="input-group" :class="invalidField(exception.taxNumber)">
                            <input type="text"
                                   class="form-control"
                                   v-model="userInformation.taxNumber">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-hand-coin-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.taxNumber">{{exception.taxNumber}}</span>
                    </div>

                    <div class="col-md-3 mb-3">
                        <label>Vergi Dairesi</label>
                        <div class="input-group" :class="invalidField(exception.taxOffice)">
                            <input type="text"
                                   class="form-control"
                                   v-model="userInformation.taxOffice">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-building-4-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.taxOffice">{{exception.taxOffice}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Vadeli Satış İndirim Oranı (Yüzde%)</label>
                        <div class="input-group" :class="invalidField(exception.forwardSalesDiscountRate)">
                            <input type="text"
                                   class="form-control"
                                   v-model="userInformation.forwardSalesDiscountRate">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-building-4-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.forwardSalesDiscountRate">{{exception.forwardSalesDiscountRate}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Max. Vadeli Satış Günü</label>
                        <div class="input-group" :class="invalidField(exception.maxSalesTerm)">
                            <input type="number"
                                   min="1"
                                   max="1095"
                                   class="form-control"
                                   v-model="userInformation.maxSalesTerm">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-building-4-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.maxSalesTerm">{{exception.maxSalesTerm}}</span>
                    </div>
                    <div class="col-6 mb-3">
                        <label>Segment</label>
                        <multiselect v-model="userInformation.segment" tag-placeholder=""
                                     placeholder="" label="name" track-by="id" :options="segmentList"
                                     selectLabel="Seç"
                                     deselectLabel="İptal Et"
                                     noResult="Sonuç bulunamadı."
                                     selectedLabel="Seçildi"
                                     :multiple="true" :taggable="true" @tag="addTag"></multiselect>
                    </div>

                    <div class="col-12">
                        <hr/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label>İl</label>
                        <div class="input-group" :class="invalidField(exception.provinceId)">
                            <multiselect
                                    v-model="userInformation.provinceId"
                                    placeholder=""
                                    :options="provinces"
                                    selectLabel="Seçmek için Enter"
                                    deselectLabel="İptal için Enter"
                                    noResult="Sonuç bulunamadı."
                                    selectedLabel="Seçildi"
                                    track-by="id"
                                    label="name"
                                    :custom-label="multiselectSearcher"
                                    @input="getDistricts(userInformation.provinceId.id)">
                                <span slot="noOptions">Yazmaya devam edin.</span>
                                <span slot="noResult">Sonuç bulunamadı.</span>
                            </multiselect>
                        </div>
                        <span class="text-danger" v-if="exception.provinceId">{{exception.provinceId}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>İlçe</label>
                        <div class="input-group" :class="invalidField(exception.districtId)">
                            <multiselect
                                    v-model="userInformation.districtId"
                                    placeholder=""
                                    :options="districts"
                                    selectLabel="Seçmek için Enter"
                                    deselectLabel="İptal için Enter"
                                    noResult="Sonuç bulunamadı."
                                    selectedLabel="Seçildi"
                                    track-by="id"
                                    label="name"
                                    :custom-label="multiselectSearcher">
                                <span slot="noOptions">Yazmaya devam edin.</span>
                                <span slot="noResult">Sonuç bulunamadı.</span>
                            </multiselect>
                        </div>
                        <span class="text-danger" v-if="exception.districtId">{{exception.districtId}}</span>
                    </div>
                    <div class="col-6 mb-3">
                        <label>Adres</label>
                        <div class="input-group" :class="invalidField(exception.address)">
                            <textarea class="form-control"
                                      v-model="userInformation.address"></textarea>
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-map-pin-2-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.address">{{exception.address}}</span>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label>E-Mail Adresi</label>
                        <div class="input-group" :class="invalidField(exception.email)">
                            <input type="email"
                                   class="form-control"
                                   v-model="userInformation.email">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-mail-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.email">{{exception.email}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>İş Telefonu</label>
                        <div class="input-group" :class="invalidField(exception.phone)">
                            <input type="text"
                                   class="form-control" maxlength="12"
                                   v-model="userInformation.phone">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-phone-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.phone">{{exception.phone}}</span>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label>Fax Numarası</label>
                        <div class="input-group" :class="invalidField(exception.fax)">
                            <input type="text"
                                   class="form-control" maxlength="12"
                                   v-model="userInformation.fax">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-printer-line"></i>
                                </span>
                            </div>
                        </div>
                        <span class="text-danger" v-if="exception.fax">{{exception.fax}}</span>
                    </div>
                    <div class="col-12">
                        <hr>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label>Gider Müşterisi mi?</label>
                        <div class="input-group" :class="invalidField(exception.expenseClient)">
                            <multiselect
                                    v-model="userInformation.expenseClient"
                                    placeholder=""
                                    :options="yesNo"
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
                        <span class="text-danger" v-if="exception.expenseClient">{{exception.expenseClient}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 text-right">
            <button class="btn btn-sm btn-light" @click="reset">Sıfırla</button>
            <button class="btn btn-sm btn-primary" @click="save"
                    :class="{'disabled': !userInformation.name || waitingResponse || success}"
                    :disabled="!userInformation.name || waitingResponse || success">
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
    import DatePicker from 'vue2-datepicker';
    import Multiselect from "vue-multiselect"
    import 'vue2-datepicker/index.css';
    import 'vue2-datepicker/locale/tr';
    import {ipcRenderer} from "electron"
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                exception: {},
                userInformation: {},
                yesNo: [
                    {id: 1, name: "Evet"},
                    {id: 0, name: "Hayır"},
                ],
                segmentList: [],
                provinces: [],
                districts: [],
                waitingResponse: false,
                success: false,
            }
        },
        components: {
            DatePicker, Multiselect
        },
        mixins: [genericMethods],
        mounted() {
            this.userInformation.creatorId = this.getSession.userDetails.id
            this.userInformation.branchId = this.getSession.userDetails.branchId
            this.setSegment()
            this.getProvinces()
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        methods: {
            setSegment() {
                ipcRenderer.send("/segmentList")
                new Promise(function (resolve) {
                    ipcRenderer.on('segmentList', (e, result) => {
                        resolve(result);
                    })
                }).then(result => {
                    for (let segment of result) {
                        this.segmentList.push({id: segment.id, name: segment.name})
                    }
                })

            },
            addTag(newTag) {
                const tag = {
                    name: newTag,
                    id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                }
                this.options.push(tag)
                this.value.push(tag)
            },
            save() {
                this.waitingResponse = true
                let result = ipcRenderer.sendSync("/newCustomer", this.userInformation)

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
                this.userInformation = {}
                this.userInformation.creatorId = this.getSession.userDetails.id
                this.userInformation.branchId = this.getSession.userDetails.branchId
            }
        }
    }
</script>