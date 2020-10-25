<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent mb-0">Akaryakıt Ürünleri \ <span v-if="!productInformation.id">Yeni Ürün Oluştur</span><span
              v-if="productInformation.id">Ürün Düzenle</span><span class="text-capitalize" v-if="productInformation.name"> \ {{
              productInformation.name
            }}</span>
          </h6>
        </b-col>
      </b-row>
      <b-card class="p-4 mt-3">
        <b-form-row>
          <b-col md="6">
            <label>Ürün Adı<span class="text-danger">*</span></label>
            <b-input-group class="mb-3">
              <b-input class="text-capitalize" v-model="productInformation.name"></b-input>
              <b-input-group-text>
                <b-icon-person></b-icon-person>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.name">{{ exception.name }}</span>
          </b-col>
          <b-col md="3">
            <label>Satış Fiyatı</label>
            <b-input-group class="mb-3">
              <b-input min="1"
                       max="5000"
                       type="number"
                       v-model="productInformation.salePrice">
              </b-input>
              <b-input-group-text>
                <b-icon-credit-card></b-icon-credit-card>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.salePrice">{{ exception.salePrice }}</span>
          </b-col>
          <b-col md="3">
            <label>Vadeli Satış Fiyatı</label>
            <b-input-group class="mb-3">
              <b-input min="1"
                       max="5000"
                       type="number"
                       v-model="productInformation.forwardSalePrice">
              </b-input>
              <b-input-group-text>
                <b-icon-credit-card></b-icon-credit-card>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.forwardSalePrice">{{ exception.forwardSalePrice }}</span>
          </b-col>
          <b-col md="3">
            <b-form-checkbox class="pl-2" v-model="productInformation.onCredit" :checked="productInformation.onCredit" switch>Pompa Satış Ekranında Gösterilsin</b-form-checkbox>
          </b-col>
        </b-form-row>
      </b-card>
    </b-col>
    <b-col cols="12" class="text-right">
      <b-button variant="light" @click="reset">Sıfırla</b-button>
      <b-button variant="primary" @click="save"
                :class="{'disabled': !productInformation.name || waitingResponse || success}"
                :disabled="!productInformation.name || waitingResponse || success">
        <span v-if="!waitingResponse && !Object.keys(exception).length && !success"><b-icon-check2></b-icon-check2> Kaydet</span>
        <span v-if="!waitingResponse && Object.keys(exception).length"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
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
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/tr'
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import router from '../../router/mainRouter'

export default {
  data () {
    return {
      detail: {},
      exception: {},
      productInformation: {},
      waitingResponse: false,
      success: false
    }
  },
  mixins: [genericMethods],
  mounted () {
    this.productInformation.creatorId = this.getSession.userDetails.id
    this.productInformation.branchId = this.getSession.userDetails.branchId
    this.getProduct()
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    save () {
      this.waitingResponse = true
      const result = ipcRenderer.sendSync('/newProduct', this.productInformation)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        this.exception = {}
        this.success = true
        this.waitingResponse = false
        this.$router.push('/ListProduct')
      }
    },
    reset () {
      this.success = false
      this.waitingResponse = false
      this.exception = {}
      this.productInformation = {}
      this.productInformation.creatorId = this.getSession.userDetails.id
      this.productInformation.branchId = this.getSession.userDetails.branchId
    },
    // we coded the functions (which name is getProduct) below for the product edit part
    getProduct () {
      if (this.$route.params.id > 0) {
        ipcRenderer.send('/getProductDetail', { id: this.$route.params.id })
        new Promise(function (resolve) {
          ipcRenderer.on('getProductDetail', (event, response) => {
            resolve(response)
          })
        }).then(response => {
          this.productInformation = response.result
          this.productInformation.salePrice = this.productInformation.salePrice || ''
          this.productInformation.forwardSalePrice = this.productInformation.forwardSalePrice || ''
        })
      } else {
        return false
      }
    }
  }
}
</script>
