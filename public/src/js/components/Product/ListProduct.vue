<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent mb-0">Akaryakıt Ürünleri \ Ürün Listesi</h6>
        </b-col>
      </b-row>
      <h6 class="text-transparent mb-0"></h6>
    </b-col>
    <b-col cols="12" class="mb-3">
      <b-card>
        <b-row>
          <b-col md="3">
            <b-input-group>
              <b-input
                  v-model="quickSearch"
                  v-on:keyup="getProducts()"
                  placeholder="Hızlı Arama"></b-input>
              <b-input-group-text>
                <b-icon-search></b-icon-search>
              </b-input-group-text>
            </b-input-group>
          </b-col>
          <b-col md="9">
            <b-button class="float-right m-1" variant="outline-success" @click="newProduct">
              <b-icon-cart-plus></b-icon-cart-plus>
              Yeni Ürün Oluştur
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card>
          <b-table-simple hover bordered striped small responsive="true" v-if="productList.length > 0">
            <b-thead>
            <b-tr>
              <b-th>#</b-th>
              <b-th>Ürün Adı</b-th>
              <b-th>Satış Fiyatı</b-th>
              <b-th>Vadeli Satış Fiyatı</b-th>
              <b-th>Vade Yüzdesi</b-th>
              <b-th>İşlem</b-th>
            </b-tr>
            </b-thead>
            <b-tbody>
            <b-tr v-for="(product,i) in productList" :key="i">
              <b-th>{{ i + 1 }}</b-th>
              <b-td style="text-transform: capitalize"><span
                  v-if="product.salePrice <=0 || product.salePrice>product.forwardSalePrice"><b-icon-exclamation-circle-fill
                  class="text-danger"></b-icon-exclamation-circle-fill></span> {{ product.name }}
              </b-td>
              <b-td><span v-if="product.salePrice <=0 "><b-icon-exclamation-circle-fill
                  class="text-danger"></b-icon-exclamation-circle-fill></span> {{ product.salePrice }}
              </b-td>
              <b-td><span v-if="product.forwardSalePrice <=0 || product.salePrice>product.forwardSalePrice"><b-icon-exclamation-circle-fill
                  class="text-danger"></b-icon-exclamation-circle-fill></span> {{ product.forwardSalePrice }}
              </b-td>
              <b-td>{{
                  (product.salePrice > 0 && product.forwardSalePrice > 0) ? (100 - (product.salePrice * 100 / product.forwardSalePrice)).toFixed(2) : 0
                }}%
              </b-td>
              <b-td>
                <b-button-group size="sm">
                  <b-button variant="outline-warning" @click="getProduct(i)">Dzn</b-button>
                  <b-button variant="outline-danger" @click="deleteProduct(i)">Sil</b-button>
                </b-button-group>
              </b-td>
            </b-tr>
            </b-tbody>
          </b-table-simple>
          <div v-else>
            <div class="text-primary"></div>
            <b-skeleton-table
                :rows="10"
                :columns="5"
                :table-props="{ bordered: true, striped: true }"
            ></b-skeleton-table>
          </div>
      </b-card>
    </b-col>
    <b-modal
        id="product-add-or-edit"
        centered
    >
      <template #modal-header="{ close }">
        <h5>{{ productInformation.id ? 'Ürün Düzenle' : 'Yeni Ürün Oluştur' }}</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="mt-3">
            <label>Ürün Adı<span class="text-danger">*</span></label>
            <b-input-group>
              <b-input class="text-capitalize" v-model="productInformation.name" ref="name"
              ></b-input>
              <b-input-group-text>
                <b-icon-type></b-icon-type>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.name">{{ exception.name }}</span>
          </b-col>
          <b-col class="mt-3">
            <label>Satış Fiyatı</label>
            <b-input-group>
              <b-input min="1"
                       max="5000"
                       type="number"
                       v-model="productInformation.salePrice"
              >
              </b-input>
              <b-input-group-text>
                <b-icon-credit-card></b-icon-credit-card>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.salePrice">{{ exception.salePrice }}</span>
          </b-col>
          <b-col class="mt-3">
            <label>Vadeli Satış Fiyatı</label>
            <b-input-group>
              <b-input min="1"
                       max="5000"
                       type="number"
                       v-model="productInformation.forwardSalePrice"
              >
              </b-input>
              <b-input-group-text>
                <b-icon-credit-card></b-icon-credit-card>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.forwardSalePrice">{{ exception.forwardSalePrice }}</span>
          </b-col>
          <b-col class="mt-3">
            <b-form-checkbox v-model="productInformation.onCredit" switch>Pompa
              Satış Ekranında Gösterilsin
            </b-form-checkbox>
          </b-col>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Kapat
        </b-button>
        <b-button variant="primary" @click="save()"
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
      </template>
    </b-modal>
    <b-modal
        id="product-delete"
        centered
    >
      <template #modal-header="{ close }">
        <h5>{{ productInformation.id ? 'Silme Onayı' : 'Ürün Bilgisi Alınamadı! Tekrar Deneyiniz' }}</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="mt-3 text-center">
            <b-icon-trash-fill style="width: 120px; height: 120px; color:red"></b-icon-trash-fill>
            <h4><b class="text-capitalize">'{{ this.productInformation.name }}'</b> ürününü silmek istediğinizden emin misiniz?</h4>
          </b-col>
          <b-col class="mt-3">
            <b-form-checkbox v-model="productInformation.deleteValidate" switch size="lg">Silmek istediğimden eminim.
            </b-form-checkbox>
            <span class="text-danger"
                  v-if="exception.deleteValidate">{{ exception.deleteValidate }}</span>
          </b-col>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Vazgeç
        </b-button>
        <b-button variant="primary" @click="deleteSave()"
                  :class="{'disabled': !productInformation.deleteValidate || waitingResponse || success}"
                  :disabled="!productInformation.deleteValidate || waitingResponse || success">
          <span v-if="!waitingResponse && !Object.keys(exception).length && !success"><b-icon-check2></b-icon-check2> Ürünü Sil</span>
          <span v-if="!waitingResponse && Object.keys(exception).length"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
          <b-col v-if="waitingResponse">
            <b-spinner></b-spinner>
            Siliniyor
          </b-col>
          <span v-if="success">Silindi</span>
        </b-button>
      </template>
    </b-modal>
  </b-row>
</template>
<style>
tr {
  cursor: pointer;
}
</style>
<script>
import { ipcRenderer } from 'electron'
import genericMethods from '../../mixins/genericMethods'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      productList: {},
      quickSearch: '',
      productInformation: {},
      fetchingProduct: false,
      exception: {},
      waitingResponse: false,
      success: false
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.getProducts()
  },
  methods: {
    getProducts () {
      ipcRenderer.removeAllListeners('productList')
      ipcRenderer.send('/productList', { name: this.quickSearch })
      new Promise(function (resolve) {
        ipcRenderer.on('productList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.productList = result.result
      })
    },
    newProduct () {
      this.productInformation = {}
      this.$bvModal.show('product-add-or-edit')
    },
    getProduct (index) {
      this.productInformation = {
        index: index,
        id: this.productList[index].id,
        name: this.productList[index].name,
        salePrice: this.productList[index].salePrice,
        forwardSalePrice: this.productList[index].forwardSalePrice,
        onCredit: !!this.productList[index].onCredit
      }
      this.$bvModal.show('product-add-or-edit')
      this.success = false
    },
    deleteProduct (index) {
      this.productInformation = {
        index: index,
        id: this.productList[index].id,
        name: this.productList[index].name,
        deleteValidate: !!this.productList[index].deleteValidate
      }
      this.$bvModal.show('product-delete')
      this.success = false
    },
    save () {
      const index = this.productInformation.index
      this.waitingResponse = true
      this.productInformation.creatorId = this.getSession.userDetails.id
      this.productInformation.branchId = this.getSession.userDetails.branchId
      const result = ipcRenderer.sendSync('/newProduct', this.productInformation)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        if (!this.productInformation.id) {
          this.productList.push({
            id: result.id,
            name: this.productInformation.name,
            salePrice: this.productInformation.salePrice,
            forwardSalePrice: this.productInformation.forwardSalePrice
          })
        } else {
          this.productList[index] = this.productInformation
        }
        this.exception = {}
        this.success = true
        this.waitingResponse = false
        this.$bvModal.hide('product-add-or-edit')
        this.productInformation = {}
      }
    },
    deleteSave () {
      const index = this.productInformation.index
      this.waitingResponse = true
      this.productInformation.updaterId = this.getSession.userDetails.id
      this.productInformation.branchId = this.getSession.userDetails.branchId
      const result = ipcRenderer.sendSync('/deleteProduct', this.productInformation)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        this.productList.splice(index, 1)
        this.exception = {}
        this.success = true
        this.waitingResponse = false
        this.$bvModal.hide('product-delete')
        this.productInformation = {}
      }
    }
  },
  mixins: [genericMethods]
}
</script>
