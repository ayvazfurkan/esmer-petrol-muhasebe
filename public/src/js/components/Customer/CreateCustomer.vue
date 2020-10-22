<template>
    <b-row class="py-5">
        <b-col cols="12" class="mt-3"></b-col>
        <b-col cols="12" class="mb-3">
            <b-row pb="3" pt="2">
                <b-col class="align-self-center">
                    <h6 class="text-transparent mb-0">Müşteriler \ <span v-if="!userInformation.id">Yeni Müşteri Ekle</span><span v-if="userInformation.id">Müşteri Düzenle</span><span class="text-capitalize" v-if="userInformation.name"> \ {{userInformation.name}}</span></h6>
                </b-col>
            </b-row>
            <b-card class="p-4" mt="5">
                <b-row>
                    <b-col cols="md-6" mb="3">
                        <label>Müşteri Adı/Unvanı <span class="text-danger">*</span></label>
                        <b-input-group>
                          <b-input class="text-capitalize" v-model="userInformation.name"></b-input>
                          <b-input-group-text>
                            <i class="ri-user-2-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.name">{{exception.name}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>Yetkili Adı</label>
                        <b-input-group :class="invalidField(exception.authorizedPersonName)">
                          <b-input class="text-capitalize" v-model="userInformation.authorizedPersonName"></b-input>
                          <b-input-group-text>
                            <i class="ri-user-2-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.authorizedPersonName">{{exception.authorizedPersonName}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                      <label>Cep Telefonu <span class="text-danger">*</span></label>
                        <b-input-group :class="invalidField(exception.gsm)">
                          <b-input v-model="userInformation.gsm"></b-input>
                          <b-input-group-text>
                            <i class="ri-smartphone-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.gsm">{{exception.gsm}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>TC Kimlik Numarası</label>
                        <b-input-group :class="invalidField(exception.citizenIdentification)">
                            <b-input maxlength="11" minlength="11"
                                v-model="userInformation.citizenIdentification"
                            ></b-input>
                          <b-input-group-text>
                            <i class="ri-bank-card-2-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.citizenIdentification">{{exception.citizenIdentification}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>Doğum Tarihi</label>
                        <b-input-group :class="invalidField(exception.birthDate)">
                          <date-picker v-model="userInformation.birthDate" format="DD.MM.YYYY"
                                       input-class="form-control">
                            <i class="input-group-text ri-calendar-event-line ri-fw ml-1" slot="icon-calendar"></i>
                          </date-picker>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.birthDate">{{exception.birthDate}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                      <label>Vergi Kimlik Numarası</label>
                      <b-input-group :class="invalidField(exception.taxNumber)">
                        <b-input v-model="userInformation.taxNumber"></b-input>
                        <b-input-group-text>
                          <i class="ri-hand-coin-line"></i>
                        </b-input-group-text>
                      </b-input-group>
                      <span class="text-danger" v-if="exception.taxNumber">{{exception.taxNumber}}</span>
                    </b-col>

                    <b-col cols="md-3" mb="3">
                      <label>Vergi Dairesi</label>
                      <b-input-group :class="invalidField(exception.taxOffice)">
                        <b-input class="text-capitalize" v-model="userInformation.taxOffice"></b-input>
                        <b-input-group-text>
                          <i class="ri-building-4-line"></i>
                        </b-input-group-text>
                      </b-input-group>
                      <span class="text-danger" v-if="exception.taxOffice">{{exception.taxOffice}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>Vadeli Satış İndirim Oranı (Yüzde%)</label>
                        <b-input-group :class="invalidField(exception.forwardSalesDiscountRate)">
                          <b-input v-model="userInformation.forwardSalesDiscountRate"></b-input>
                          <b-input-group-text>
                            <i class="ri-building-4-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.forwardSalesDiscountRate">{{exception.forwardSalesDiscountRate}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>Max. Vadeli Satış Günü</label>
                        <b-input-group :class="invalidField(exception.maxSalesTerm)">
                          <b-input  min="1"
                                    max="1095"
                                    type="number"
                                    v-model="userInformation.maxSalesTerm">
                          </b-input>
                          <b-input-group-text>
                            <i class="ri-building-4-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.maxSalesTerm">{{exception.maxSalesTerm}}</span>
                    </b-col>
                    <b-col cols="6" mb="3">
                        <label>Segment</label>
                        <multiselect v-model="userInformation.segment" tag-placeholder=""
                                     placeholder="" label="name" track-by="id" :options="segmentList"
                                     selectLabel="Seç"
                                     deselectLabel="İptal Et"
                                     noResult="Sonuç bulunamadı."
                                     selectedLabel="Seçildi"
                                     :multiple="true" :taggable="true" @tag="addTag"></multiselect>
                    </b-col>

                    <b-col cols="12">
                        <hr/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="md-3" mb="3">
                        <label>İl</label>
                        <b-input-group :class="invalidField(exception.provinceId)">
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
                        </b-input-group>
                        <span class="text-danger" v-if="exception.provinceId">{{exception.provinceId}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>İlçe</label>
                        <b-input-group :class="invalidField(exception.districtId)">
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
                        </b-input-group>
                        <span class="text-danger" v-if="exception.districtId">{{exception.districtId}}</span>
                    </b-col>
                    <b-col cols="6" mb="3">
                        <label>Adres</label>
                        <b-input-group :class="invalidField(exception.address)">
                            <b-textarea v-model="userInformation.address"></b-textarea>
                          <b-input-group-text>
                            <i class="ri-map-pin-2-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.address">{{exception.address}}</span>
                    </b-col>

                    <b-col cols="md-6" mb="3">
                        <label>E-Mail Adresi</label>
                        <b-input-group :class="invalidField(exception.email)">
                            <b-input type="email"
                                     class="text-lowercase"
                                     v-model="userInformation.email">
                            </b-input>
                            <b-input-group-text>
                              <i class="ri-mail-line"></i>
                            </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.email">{{exception.email}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>İş Telefonu</label>
                        <b-input-group :class="invalidField(exception.phone)">
                            <b-input maxlength="12"
                                     v-model="userInformation.phone">
                            </b-input>
                          <b-input-group-text>
                            <i class="ri-phone-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.phone">{{exception.phone}}</span>
                    </b-col>
                    <b-col cols="md-3" mb="3">
                        <label>Fax Numarası</label>
                        <b-input-group :class="invalidField(exception.fax)">
                            <b-input type="text"
                                     maxlength="12"
                                     v-model="userInformation.fax">
                            </b-input>
                          <b-input-group-text>
                            <i class="ri-printer-line"></i>
                          </b-input-group-text>
                        </b-input-group>
                        <span class="text-danger" v-if="exception.fax">{{exception.fax}}</span>
                    </b-col>
                    <b-col cols="12">
                        <hr>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="md-6" mb="3">
                        <label>Gider Müşterisi mi?</label>
                        <b-input-group :class="invalidField(exception.expenseClient)">
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
                        </b-input-group>
                        <span class="text-danger" v-if="exception.expenseClient">{{exception.expenseClient}}</span>
                    </b-col>
                </b-row>
            </b-card>
        </b-col>
        <b-col cols="12" class="text-right">
            <b-button variant="light" @click="reset">Sıfırla</b-button>
            <b-button variant="primary" @click="save"
                    :class="{'disabled': !userInformation.name || waitingResponse || success}"
                    :disabled="!userInformation.name || waitingResponse || success">
                <span v-if="!waitingResponse && !Object.keys(exception).length && !success">Kaydet</span>
                <span v-if="!waitingResponse && Object.keys(exception).length">Yeniden Dene</span>
                <b-col v-if="waitingResponse">
                    <b-spinner></b-spinner>
                    Kaydediliyor
                </b-col>
                <span v-if="success">Başarılı</span>
            </b-button>
        </b-col>
    </b-row>
</template>
<script>
    import genericMethods from "../../mixins/genericMethods"
    import DatePicker from 'vue2-datepicker'
    import Multiselect from "vue-multiselect"
    import 'vue2-datepicker/index.css'
    import 'vue2-datepicker/locale/tr'
    import {ipcRenderer} from "electron"
    import {mapGetters} from "vuex"
    import _ from 'lodash'

    export default {
        data () {
            return {
                detail: {},
                exception: {},
                userInformation: {
                    expenseClient: { id: 0, name: "Hayır" }
                },
                yesNo: [
                    {id: 1, name: "Evet"},
                    {id: 0, name: "Hayır"},
                ],
                segmentList: [],
                segmentNames: [],
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
            this.getCustomer()
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
            },
            getCustomer() {
              if (this.$route.params.id>0){
                let result = ipcRenderer.sendSync("/getCustomerDetail", {id: this.$route.params.id})
                this.userInformation = result.result
                if(this.userInformation.expenseClient === '1'){
                  this.userInformation.expenseClient= {id: 1, name: "Evet"}
                }else{
                  this.userInformation.expenseClient= {id: 0, name: "Hayır"}
                }
                this.getCustomerSegment()
              }else{
                return false
              }
            },
            getCustomerSegment() {
              if (this.$route.params.id>0){
                let result = ipcRenderer.sendSync("/getCustomerSegment", {customerId: this.$route.params.id})
                if (!this.userInformation.segment) {
                  this.userInformation.segment = []
                }
                for (const segment of result.result) {
                  this.userInformation.segment.push({
                    id: segment.id,
                    name: this.getSegmentName(segment.id)
                  })
                }
              }else{
                return false
              }
            },
            getSegmentName(segmentId){
              let result = ipcRenderer.sendSync('/getSegmentName', {id: segmentId})
              console.log(result.result)
            }
        }
    }
</script>