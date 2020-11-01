<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent mb-0">Müşteriler \ <span v-if="!customerInformation.id">Yeni Müşteri Ekle</span><span
              v-if="customerInformation.id">Müşteri Düzenle</span><span class="text-capitalize" v-if="customerInformation.name"> \ {{
              customerInformation.name
            }}</span>
          </h6>
        </b-col>
      </b-row>
      <b-card class="p-4 mt-3">
        <b-form-row>
          <b-col md="6">
            <label>Müşteri Adı/Unvanı <span class="text-danger">*</span></label>
            <b-input-group class="mb-3">
              <b-input class="text-capitalize" v-model="customerInformation.name"></b-input>
              <b-input-group-text>
                <b-icon-person></b-icon-person>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.name">{{ exception.name }}</span>
          </b-col>
          <b-col md="3">
            <label>Yetkili Adı</label>
            <b-input-group class="mb-3">
              <b-input class="text-capitalize" v-model="customerInformation.authorizedPersonName"></b-input>
              <b-input-group-text>
                <b-icon-person-circle></b-icon-person-circle>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.authorizedPersonName">{{ exception.authorizedPersonName }}</span>
          </b-col>
          <b-col md="3">
            <label>Cep Telefonu <span class="text-danger">*</span></label>
            <b-input-group class="mb-3">
              <b-input v-model="customerInformation.gsm"></b-input>
              <b-input-group-text>
                <b-icon-phone></b-icon-phone>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.gsm">{{ exception.gsm }}</span>
          </b-col>
          <b-col md="3">
            <label>TC Kimlik Numarası</label>
            <b-input-group class="mb-3">
              <b-input maxlength="11" minlength="11"
                       v-model="customerInformation.citizenIdentification"
              ></b-input>
              <b-input-group-text>
                <b-icon-credit-card2-front></b-icon-credit-card2-front>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.citizenIdentification">{{ exception.citizenIdentification }}</span>
          </b-col>
          <b-col md="3">
            <label>Doğum Tarihi</label>
            <b-input-group class="mb-3">
              <date-picker v-model="customerInformation.birthDate" format="DD.MM.YYYY"
                           input-class="form-control">
                <b-icon-calendar class="input-group-text ml-1 mr-0 s32" slot="icon-calendar"></b-icon-calendar>
              </date-picker>
            </b-input-group>
            <span class="text-danger" v-if="exception.birthDate">{{ exception.birthDate }}</span>
          </b-col>
          <b-col md="3">
            <label>Vergi Kimlik Numarası</label>
            <b-input-group class="mb-3">
              <b-input v-model="customerInformation.taxNumber"></b-input>
              <b-input-group-text>
                <b-icon-card-text></b-icon-card-text>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.taxNumber">{{ exception.taxNumber }}</span>
          </b-col>
          <b-col md="3">
            <label>Vergi Dairesi</label>
            <b-input-group class="mb-3">
              <b-input class="text-capitalize" v-model="customerInformation.taxOffice"></b-input>
              <b-input-group-text>
                <b-icon-building></b-icon-building>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.taxOffice">{{ exception.taxOffice }}</span>
          </b-col>
          <b-col md="3">
            <label>Vadeli Satış İndirim Oranı (Yüzde%)</label>
            <b-input-group class="mb-3">
              <b-input v-model="customerInformation.forwardSalesDiscountRate"></b-input>
              <b-input-group-text>
                <b-icon-percent></b-icon-percent>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.forwardSalesDiscountRate">{{ exception.forwardSalesDiscountRate }}</span>
          </b-col>
          <b-col md="3">
            <label>Max. Vadeli Satış Günü</label>
            <b-input-group class="mb-3">
              <b-input min="1"
                       max="1095"
                       type="number"
                       v-model="customerInformation.maxSalesTerm">
              </b-input>
              <b-input-group-text>
                <b-icon-calendar2-plus></b-icon-calendar2-plus>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.maxSalesTerm">{{ exception.maxSalesTerm }}</span>
          </b-col>
          <b-col cols="6">
            <label>Segment</label>
            <multiselect v-model="customerInformation.segment" tag-placeholder=""
                         placeholder="" label="name" track-by="id" :options="segmentList"
                         selectLabel="Seç"
                         deselectLabel="İptal Et"
                         noResult="Sonuç bulunamadı."
                         selectedLabel="Seçildi"
                         :multiple="true" :taggable="true" @tag="addTag"></multiselect>
            <pre>{{ customerInformation.segment }}</pre>
          </b-col>
          <b-col cols="12">
            <hr/>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="3">
            <label>İl</label>
            <b-input-group class="mb-3">
              <multiselect
                  v-model="customerInformation.provinceId"
                  placeholder=""
                  :options="provinces"
                  selectLabel="Seçmek için Enter"
                  deselectLabel="İptal için Enter"
                  noResult="Sonuç bulunamadı."
                  selectedLabel="Seçildi"
                  track-by="id"
                  label="name"
                  :custom-label="multiselectSearcher"
                  @input="getDistricts(customerInformation.provinceId.id)">
                <span slot="noOptions">Yazmaya devam edin.</span>
                <span slot="noResult">Sonuç bulunamadı.</span>
              </multiselect>
            </b-input-group>
            <span class="text-danger" v-if="exception.provinceId">{{ exception.provinceId }}</span>
          </b-col>
          <b-col md="3">
            <label>İlçe</label>
            <b-input-group class="mb-3">
              <multiselect
                  v-model="customerInformation.districtId"
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
            <span class="text-danger" v-if="exception.districtId">{{ exception.districtId }}</span>
          </b-col>
          <b-col cols="6">
            <label>Adres</label>
            <b-input-group class="mb-3">
              <b-textarea v-model="customerInformation.address"></b-textarea>
              <b-input-group-text>
                <b-icon-geo-alt></b-icon-geo-alt>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.address">{{ exception.address }}</span>
          </b-col>

          <b-col md="6">
            <label>E-Mail Adresi</label>
            <b-input-group class="mb-3">
              <b-input type="email"
                       class="text-lowercase"
                       v-model="customerInformation.email">
              </b-input>
              <b-input-group-text>
                <b-icon-envelope></b-icon-envelope>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.email">{{ exception.email }}</span>
          </b-col>
          <b-col md="3">
            <label>İş Telefonu</label>
            <b-input-group class="mb-3">
              <b-input maxlength="12"
                       v-model="customerInformation.phone">
              </b-input>
              <b-input-group-text>
                <b-icon-telephone></b-icon-telephone>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.phone">{{ exception.phone }}</span>
          </b-col>
          <b-col md="3">
            <label>Fax Numarası</label>
            <b-input-group class="mb-3">
              <b-input type="text"
                       maxlength="12"
                       v-model="customerInformation.fax">
              </b-input>
              <b-input-group-text>
                <b-icon-printer></b-icon-printer>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.fax">{{ exception.fax }}</span>
          </b-col>
          <b-col cols="12">
            <hr>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <label>Gider Müşterisi mi?</label>
            <b-input-group class="mb-3">
              <multiselect
                  v-model="customerInformation.expenseClient"
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
            <span class="text-danger" v-if="exception.expenseClient">{{ exception.expenseClient }}</span>
          </b-col>
        </b-form-row>
      </b-card>
    </b-col>
    <b-col cols="12" class="text-right">
      <b-button variant="light" @click="reset">Sıfırla</b-button>
      <b-button variant="primary" @click="save"
                :class="{'disabled': !customerInformation.name || waitingResponse || success}"
                :disabled="!customerInformation.name || waitingResponse || success">
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
import genericMethods from '../../mixins/genericMethods'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/tr'
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      detail: {},
      exception: {},
      customerInformation: {
        expenseClient: {
          id: 0,
          name: 'Hayır'
        }
      },
      yesNo: [
        {
          id: 1,
          name: 'Evet'
        },
        {
          id: 0,
          name: 'Hayır'
        }
      ],
      segmentList: [],
      provinces: [],
      districts: [],
      waitingResponse: false,
      success: false
    }
  },
  components: {
    DatePicker,
    Multiselect
  },
  mixins: [genericMethods],
  mounted () {
    this.customerInformation.creatorId = this.getSession.userDetails.id
    this.customerInformation.branchId = this.getSession.userDetails.branchId
    this.setSegment()
    this.getProvinces()
    this.getCustomer()
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    setSegment () {
      ipcRenderer.send('/segmentList')
      new Promise(function (resolve) {
        ipcRenderer.on('segmentList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        for (const segment of result) {
          this.segmentList.push({
            id: segment.id,
            name: segment.name
          })
        }
      })
    },
    addTag (newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.options.push(tag)
      this.value.push(tag)
    },
    save () {
      this.waitingResponse = true
      const result = ipcRenderer.sendSync('/newCustomer', this.customerInformation)

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
    reset () {
      this.success = false
      this.waitingResponse = false
      this.exception = {}
      this.customerInformation = {}
      this.customerInformation.creatorId = this.getSession.userDetails.id
      this.customerInformation.branchId = this.getSession.userDetails.branchId
    },
    // we coded the functions (which names are getCustomer, getCustomerSegment and getSegmentName) below for the customer edit part
    getCustomer () {
      if (this.$route.params.id > 0) {
        ipcRenderer.send('/getCustomerDetail', { id: this.$route.params.id })
        new Promise(function (resolve) {
          ipcRenderer.on('getCustomerDetail', (event, response) => {
            resolve(response)
          })
        }).then(response => {
          this.customerInformation = response.result
          this.customerInformation.segment = []
          if (this.customerInformation.expenseClient === 1) {
            this.customerInformation.expenseClient = {
              id: 1,
              name: 'Evet'
            }
          } else {
            this.customerInformation.expenseClient = {
              id: 0,
              name: 'Hayır'
            }
          }
          this.customerInformation.forwardSalesDiscountRate = this.customerInformation.forwardSalesDiscountRate || ''
          this.customerInformation.maxSalesTerm = this.customerInformation.maxSalesTerm || ''
          this.getCustomerSegment()
        })
      } else {
        return false
      }
    },
    getCustomerSegment () {
      ipcRenderer.send('/getCustomerSegment', { customerId: this.$route.params.id })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerSegment', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        for (const segment of response.result) {
          this.customerInformation.segment.push({
            id: segment.id,
            name: segment.name
          })
        }
        console.log(this.customerInformation.segment)
      })
    }
  }
}
</script>
