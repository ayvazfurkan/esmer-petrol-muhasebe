<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Kabuklu Fındık \ Kuru Fındık Alım</h6>
        </div>
        <div class="col-md-7">
            <div class="card p-4">
                <div class="row">
                    <div class="col-12 mb-3">
                        <h6>Kabuklu Fındık Alım Bilgisi</h6>
                    </div>
                    <div class="col-md-12 col-lg-8 mb-3">
                        <label>Fındığı Getiren <span class="text-danger">*</span></label>
                        <div class="input-group" :class="invalidField(exception.customerId)">
                            <multiselect
                                    v-model="acceptanceForm.customerId"
                                    placeholder=""
                                    noOptions="Aramak için yazmaya başlayın"
                                    noResult="Sonuç bulunamadı"
                                    :options="customerList"
                                    selectLabel="Seç"
                                    deselectLabel="İptal Et"
                                    selectedLabel="Seçildi"
                                    track-by="id"
                                    label="name"
                                    :custom-label="multiselectSearcher"
                                    :max="10"
                                    @search-change="getCustomers">
                                <span slot="noOptions">Yazmaya devam edin.</span>
                                <span slot="noResult">Sonuç bulunamadı.</span>
                            </multiselect>
                        </div>
                        <span class="text-danger" v-if="exception.customerId">{{exception.customerId}}</span>
                    </div>
                    <div class="col-md-12 col-lg-6 mb-3">
                        <label>Fındığın Bölgesi <span class="text-danger">*</span></label>
                        <div class="input-group" :class="invalidField(exception.regionId)">
                            <multiselect
                                    v-model="acceptanceForm.regionId"
                                    placeholder=""
                                    :options="regionList"
                                    :custom-label="multiselectSearcher"
                                    selectLabel="Seçmek için enter"
                                    deselectLabel="İptal için enter"
                                    selectedLabel="Seçildi"
                                    label="name"
                                    track-by="id"
                                    @search-change="getRegions">
                                <span slot="noOptions">Yazmaya devam edin.</span>
                                <span slot="noResult">Sonuç bulunamadı.</span>
                            </multiselect>
                        </div>
                        <span class="text-danger" v-if="exception.regionId">{{exception.regionId}}</span>
                    </div>
                    <div class="col-md-12 col-lg-6 mb-3">
                        <label>Alım Yeri (Depo) <span class="text-danger">*</span></label>
                        <div class="input-group" :class="invalidField(exception.warehouseId)">
                            <multiselect
                                    v-model="acceptanceForm.warehouseId"
                                    placeholder=""
                                    :options="warehouseList"
                                    :custom-label="multiselectSearcher"
                                    selectLabel="Seçmek için enter"
                                    deselectLabel="İptal için enter"
                                    noResult="Sonuç bulunamadı."
                                    selectedLabel="Seçildi"
                                    label="name"
                                    track-by="id"
                                    @search-change="getWarehouses">
                                <span slot="noOptions">Yazmaya devam edin.</span>
                                <span slot="noResult">Sonuç bulunamadı.</span>
                            </multiselect>
                        </div>
                        <span class="text-danger" v-if="exception.warehouseId">{{exception.warehouseId}}</span>
                    </div>
                    <div class="col-12">
                        <hr/>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Teslim Alınan KG <span class="text-danger">*</span>
                            <span class="text-muted"
                                  hidden>Teslim aldığınız veya tartıdan gelen kilogram bilgisini giriniz.</span></label>
                        <div class="input-group" :class="invalidField(exception.receivedWeight)">
                            <input type="number"
                                   step="1"
                                   min="1"
                                   class="form-control"
                                   ref="receivedWeight"
                                   v-model="acceptanceForm.receivedWeight"
                                   title="Teslim aldığınız/tartıdan gelen kg bilgisini giriniz"
                                   @keyup="calcYield"/>
                        </div>
                        <span class="text-danger" v-if="exception.receivedWeight">{{exception.receivedWeight}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Çuval Sayısı</label>
                        <div class="input-group" :class="invalidField(exception.sackQuantity)">
                            <input type="number"
                                   step="1"
                                   min="0"
                                   class="form-control"
                                   v-model="acceptanceForm.sackQuantity"/>
                        </div>
                        <span class="text-danger" v-if="exception.sackQuantity">{{exception.sackQuantity}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Araç Plakası</label>
                        <div class="input-group" :class="invalidField(exception.vehiclePlate)">
                            <input type="text"
                                   class="form-control"
                                   v-model="acceptanceForm.vehiclePlate">
                        </div>
                        <span class="text-danger" v-if="exception.vehiclePlate">{{exception.vehiclePlate}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>İrsaliye Numarası</label>
                        <div class="input-group" :class="invalidField(exception.waybillNumber)">
                            <input type="text"
                                   class="form-control"
                                   v-model="acceptanceForm.waybillNumber">
                        </div>
                        <span class="text-danger" v-if="exception.waybillNumber">{{exception.waybillNumber}}</span>
                    </div>
                    <div class="col-12">
                        <label>Açıklama</label>
                        <div class="input-group" :class="invalidField(exception.description)">
                            <textarea class="form-control" v-model="acceptanceForm.description" rows="3"></textarea>
                        </div>
                        <span class="text-danger" v-if="exception.description">{{exception.description}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="card p-4">
                <div class="row">
                    <div class="col-12 mb-3">
                        <h6>Randıman/Analiz Bilgisi</h6>
                    </div>
                    <div class="col-12 mb-3">
                        <label>Numune Gramajı</label>
                        <div class="input-group" :class="invalidField(exception.yieldSample)">
                            <input type="number"
                                   step="1"
                                   min="1"
                                   class="form-control"
                                   v-model="acceptanceForm.yieldSample"
                                   :disabled="acceptanceForm.receivedWeight<=0"
                                   @keyup="calcYield"/>
                        </div>
                        <span class="text-muted"
                              v-if="!exception.yieldSample">Yaygın olarak 250 gram kullanılır.</span>
                        <span class="text-danger" v-if="exception.yieldSample">{{exception.yieldSample}}</span>
                    </div>
                    <div class="col-12 mb-3">
                        <label>Sağlam Çıkan İç Fındık Gramajı</label>
                        <div class="input-group" :class="invalidField(exception.yieldSolid)">
                            <input type="number"
                                   step="1"
                                   min="1"
                                   class="form-control"
                                   v-model="acceptanceForm.yieldSolid"
                                   :disabled="acceptanceForm.receivedWeight<=0"
                                   @keyup="calcYield"/>
                        </div>
                        <span class="text-danger" v-if="exception.yieldSolid">{{exception.yieldSolid}}</span>
                    </div>
                    <div class="col-12 mb-3">
                        <label>Buruşuk Çıkan İç Fındık Gramajı</label>
                        <div class="input-group" :class="invalidField(exception.yieldWrinkled)">
                            <input type="number"
                                   step="1"
                                   min="1"
                                   class="form-control"
                                   v-model="acceptanceForm.yieldWrinkled"
                                   :disabled="acceptanceForm.receivedWeight<=0"
                                   @keyup="calcYield"/>
                        </div>
                        <span class="text-danger" v-if="exception.yieldWrinkled">{{exception.yieldWrinkled}}</span>
                    </div>
                    <div class="col-12 mb-3">
                        <label>Nem Oranı</label>
                        <div class="input-group" :class="invalidField(exception.yieldMoisture)">
                            <input type="number"
                                   step="1"
                                   min="1"
                                   class="form-control"
                                   v-model="acceptanceForm.yieldMoisture"
                                   :disabled="acceptanceForm.receivedWeight<=0"
                                   @keyup="calcYield"/>
                        </div>
                        <span class="text-muted"
                              v-if="!exception.yieldMoisture">Nem oranı standart %6'dır. +-%2 etkiler.</span>
                        <span class="text-danger" v-if="exception.yieldMoisture">{{exception.yieldMoisture}}</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Randıman <span class="text-muted">%</span></label>
                        <div class="input-group" :class="invalidField(exception.yieldRatio)">
                            <input
                                    type="number"
                                    step="1"
                                    min="35" max="65"
                                    maxlength="2"
                                    class="form-control"
                                    v-model="acceptanceForm.yieldRatio"
                                    :disabled="acceptanceForm.receivedWeight<=0"
                                    @keyup="calcFromYieldRatio"
                                    @change="calcFromYieldRatio"/>
                        </div>
                        <span class="text-muted"
                              v-if="!exception.yieldRatio">Standart randıman değeri %50'dir. +-%2 etkiler</span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Net Kilogram <span class="text-muted"></span></label>
                        <div class="input-group" :class="invalidField(exception.netWeight)">
                            <input type="number"
                                   min="1"
                                   class="form-control"
                                   v-model="acceptanceForm.netWeight"
                                   :disabled="acceptanceForm.receivedWeight<=0"
                                   @keyup="calcFromNetWeight"/>
                        </div>
                        <span class="text-muted" v-if="!exception.netWeight && !isNaN(acceptanceForm.yieldRatio)">{{`${acceptanceForm.yieldRatio}% randımanlı miktar`}}</span>
                    </div>
                    <div class="col-12 mb-3">
                        <div class="form-check">
                            <input type="checkbox" id="oldHazelnut" class="form-check-input"
                                   v-model="acceptanceForm.oldHazelnut"/>
                            <label class="form-check-label" for="oldHazelnut">
                                Eski Fındık
                            </label>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <div class="form-check">
                            <input type="checkbox" id="yieldAuto" v-model="acceptanceForm.yieldAuto"
                                   class="form-check-input" @change="yieldAutoFill"/>
                            <label class="form-check-label" for="yieldAuto">
                                50% Randıman (otomatik)
                            </label>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <div class="form-check">
                            <input type="checkbox" id="isReceiptPrinted" class="form-check-input"
                                   v-model="acceptanceForm.isReceiptPrinted"/>
                            <label class="form-check-label" for="isReceiptPrinted">
                                Alım Fişini Yazdır
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 my-3 text-right">
            <button class="btn btn-sm btn-light" :disabled="waitingResponse" @click="reset">Sıfırla</button>
            <button class="btn btn-sm btn-primary" :disabled="waitingResponse" @click="save">
                <div v-if="waitingResponse">
                    <div class="spinner-border text-light"></div>
                    Kaydediliyor..
                </div>
                <span v-if="success || !waitingResponse">Kaydet</span>
            </button>
        </div>
    </div>
</template>
<script>
    import {ipcRenderer} from "electron";
    import genericMethods from "../../mixins/genericMethods";
    import Multiselect from "vue-multiselect"
    import {mapGetters} from "vuex";

    export default {
        components: {Multiselect},
        data() {
            return {
                acceptanceForm: {
                    receivedWeight: "",
                    yieldSample: "",
                    yieldSolid: "",
                    yieldWrinkled: "",
                    yieldMoisture: "",
                    netWeight: "",
                    waybillNumber: "",
                    vehiclePlate: "",
                    description: "",
                    sackQuantity: ""
                },
                customerList: [],
                regionList: [],
                warehouseList: [],
                exception: {},
                waitingResponse: false,
                success: false,
            };
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        mounted() {
            this.acceptanceForm.userId = this.getSession.userDetails.id
            this.acceptanceForm.branchId = this.getSession.userDetails.branchId
            this.inputFocus()
        },
        methods: {
            calcFromNetWeight() {
                let receivedWeight = parseFloat(this.acceptanceForm.receivedWeight)
                let yieldMoisture = parseFloat(this.acceptanceForm.yieldMoisture)
                if (yieldMoisture <= 0 || isNaN(yieldMoisture)) {
                    yieldMoisture = 6
                }
                let netWeight = parseFloat(this.acceptanceForm.netWeight)
                let yieldMoistureDifference = receivedWeight * ((6 - yieldMoisture) * 2) / 100;
                let weightWithMoisture = receivedWeight + yieldMoistureDifference
                var yieldRatio = 50 + ((netWeight - weightWithMoisture) * 100 / weightWithMoisture / 2)
                if (receivedWeight > 0) {
                    let yieldWrinkled = 0
                    let yieldSolid = ((yieldRatio * 10) - yieldWrinkled) / 2 / 10;
                    let yieldSample = (((yieldSolid * 2) + yieldWrinkled) * 50) / yieldRatio;

                    this.acceptanceForm.yieldSample = yieldSample.toFixed(2)
                    this.acceptanceForm.yieldSolid = yieldSolid.toFixed(2)
                    this.acceptanceForm.yieldWrinkled = yieldWrinkled.toFixed(2)
                    this.acceptanceForm.yieldRatio = yieldRatio.toFixed(2)
                    this.acceptanceForm.yieldAuto = false
                }
            },
            calcFromYieldRatio() {
                let receivedWeight = parseFloat(this.acceptanceForm.receivedWeight)
                let yieldRatio = parseFloat(this.acceptanceForm.yieldRatio)
                let yieldMoisture = parseFloat(this.acceptanceForm.yieldMoisture)
                if (yieldMoisture <= 0 || isNaN(yieldMoisture)) {
                    yieldMoisture = 6;
                }
                let yieldMoistureDifference = receivedWeight * ((6 - yieldMoisture) * 2) / 100;
                let netWeight = receivedWeight + (receivedWeight / 100 * (yieldRatio - (50 * 1)) * 2) + yieldMoistureDifference;
                if (receivedWeight > 0 && yieldRatio > 0) {
                    this.acceptanceForm.netWeight = netWeight.toFixed(2)
                } else {
                    netWeight = receivedWeight + (yieldMoisture * receivedWeight / 100)
                }

                let yieldWrinkled = 0
                let yieldSolid = ((yieldRatio * 10) - yieldWrinkled) / 2 / 10;
                let yieldSample = (((yieldSolid * 2) + yieldWrinkled) * 50) / yieldRatio;
                this.acceptanceForm.yieldSample = yieldSample.toFixed(2)
                this.acceptanceForm.yieldSolid = yieldSolid.toFixed(2)
                this.acceptanceForm.yieldWrinkled = yieldWrinkled.toFixed(2)


                this.acceptanceForm.yieldMoisture = parseFloat(yieldMoisture)
                this.acceptanceForm.netWeight = parseFloat(netWeight.toFixed(2))
                this.acceptanceForm.yieldAuto = false
            },
            yieldAutoFill() {
                if (this.acceptanceForm.yieldAuto) {
                    if (this.acceptanceForm.receivedWeight <= 0) {
                        this.inputFocus()
                    }
                    this.acceptanceForm.yieldSample = 50
                    this.acceptanceForm.yieldSolid = 25
                    this.acceptanceForm.yieldWrinkled = 0
                } else {
                    this.acceptanceForm.yieldSample = ''
                    this.acceptanceForm.yieldSolid = ''
                    this.acceptanceForm.yieldWrinkled = ''
                    this.acceptanceForm.yieldRatio = ''
                }
                this.calcYield()
            },
            calcYield() {
                let receivedWeight = parseFloat(this.acceptanceForm.receivedWeight),
                    yieldSample = parseFloat(this.acceptanceForm.yieldSample),
                    yieldSolid = parseFloat(this.acceptanceForm.yieldSolid),
                    yieldWrinkled = parseFloat(this.acceptanceForm.yieldWrinkled),
                    yieldMoisture = parseFloat(this.acceptanceForm.yieldMoisture);

                if (isNaN(yieldMoisture) || yieldMoisture <= 0 || yieldMoisture == "") {
                    yieldMoisture = 6
                } //default moisture value is 6
                let yieldMoistureDifference = receivedWeight * (6 - yieldMoisture) * 2 / 100

                if (yieldSample > 0 && (yieldSolid > 0 || yieldWrinkled > 0)) {
                    let yieldRatio = ((((yieldSolid * 2) + yieldWrinkled) / (yieldSample * 0.002)) / 10).toFixed(2),
                        yieldNutShell = ((yieldSample - (yieldSolid + yieldWrinkled)) * receivedWeight / yieldSample).toFixed(2),
                        netWeight = ((receivedWeight + (receivedWeight / 100 * (yieldRatio - (50 * 1)) * 2)) + yieldMoistureDifference).toFixed(2);
                    this.acceptanceForm.yieldRatio = yieldRatio
                    this.acceptanceForm.netWeight = netWeight
                } else {
                    this.acceptanceForm.netWeight = this.acceptanceForm.receivedWeight
                }
                // if user fills yield details after checked yieldAuto, unchecks yieldAuto automaticly
                if ((yieldSample != 50 || yieldSolid != 25 || yieldWrinkled != 0) && this.acceptanceForm.yieldAuto == true) {
                    this.acceptanceForm.yieldAuto = false
                }
            },
            save() {
                this.waitingResponse = true
                let result = ipcRenderer.sendSync("/newAcceptance", this.acceptanceForm)
                this.waitingResponse = false

                if (!result.status) {
                    this.exception = result.exception;
                } else {
                    this.reset()
                    this.success = true
                    setTimeout(() => {
                        this.success = false
                    }, 3000);
                }
            },
            reset() {
                this.acceptanceForm = {
                    receivedWeight: "",
                    yieldSample: "",
                    yieldSolid: "",
                    yieldWrinkled: "",
                    yieldMoisture: "",
                    netWeight: "",
                    waybillNumber: "",
                    vehiclePlate: "",
                    description: "",
                    sackQuantity: ""
                }
                this.exception = {}
                this.inputFocus()
            },
            inputFocus() {
                this.$refs.receivedWeight.focus()
            }
        },
        mixins: [genericMethods],
    };
</script>