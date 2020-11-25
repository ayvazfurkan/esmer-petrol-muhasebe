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
              <b-th></b-th>
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
              <b-td class="text-center">
                <span v-b-tooltip.left title="Müşterilere özel fiyatlar"><b-icon-people class="mx-1" variant="success"
                                                                                        @click="getCustomerPrices(product.id)"></b-icon-people></span>
                <span v-b-tooltip.leftbottom title="Düzenle"><b-icon-pencil-square class="mx-1" variant="primary"
                                                                                   @click="getProduct(i)"></b-icon-pencil-square></span>
                <span v-b-tooltip.right title="Sil"><b-icon-x-circle class="mx-1" variant="danger"
                                                                     @click="deleteProduct(i)"></b-icon-x-circle></span>
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
            <h4><b class="text-capitalize">'{{ this.productInformation.name }}'</b> ürününü silmek istediğinizden emin
              misiniz?</h4>
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
    <b-modal
        id="customer-prices"
        centered
        size="lg"
    >
      <template #modal-header="{ close }">
        <h5>
          <b-skeleton v-if="customerPricesLoading" width="390px"></b-skeleton>
          <span v-else class="text-capitalize">{{ customerPricesProduct.name }} İçin Müşterilere Özel Fiyatlar | Güncel Satış Fiyatı: ₺ {{
              customerPricesProduct.salePrice
            }} </span></h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="my-3">
            <multiselect
                v-model="customerPricesQuickSearch"
                class="no-drag"
                placeholder="Müşteri eklemek için yazınız."
                selectLabel="Eklemek için Enter"
                deselectLabel="İptal için Enter"
                noResult="Sonuç bulunamadı."
                selectedLabel="Seçildi"
                track-by="id"
                label="name"
                :options="customerPricesSearchResults"
                @search-change="search"
                @input="addtoList">
              <span slot="noOptions">Yazmaya devam edin.</span>
              <span slot="noResult">Sonuç bulunamadı.</span>
              <span slot="caret" slot-scope="{ toggle }" @mousedown.prevent.stop="toggle"
                    class="position-absolute caret"><b-icon-search></b-icon-search></span>
            </multiselect>
          </b-col>
          <b-col>
            <b-table-simple hover bordered striped small responsive="true" v-if="customerPricesList.length > 0">
              <b-thead>
                <b-tr>
                  <b-th>#</b-th>
                  <b-th>Müşteri Adı</b-th>
                  <b-th>Özel Fiyat</b-th>
                  <b-th></b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="(list,i) in customerPricesList" v-if="!list.deleted" :key="i">
                  <b-td> {{ i + 1 }}</b-td>
                  <b-td> {{ list.customerName }}</b-td>
                  <b-td>
                    <b-input placeholder="Özel fiyat" type="number" min="0" step="0.01" v-model="list.salePrice"
                    ></b-input>
                    <span class="text-danger"
                          v-if="exception[0]">{{ exception[0].salePrice }}</span>
                  </b-td>
                  <b-td class="text-center">
                    <span v-b-tooltip.right title="Sil"><b-icon-x-circle class="mx-1"
                                                                         variant="danger" @click="removeCustomerPriceList(i)"></b-icon-x-circle></span>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            </b-col>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Kapat
        </b-button>
        <button class="btn btn-primary" @click="saveCustomerPrices"
                :class="{ 'disabled': !customerPricesList.length || waitingResponse || success }"
                :disabled="!customerPricesList.length || waitingResponse || success">
          <span v-if="!waitingResponse && !Object.keys(exception).length && !success"><b-icon-check2></b-icon-check2> Kaydet</span>
          <span v-if="!waitingResponse && Object.keys(exception).length"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
          <div v-if="waitingResponse">
            <div class="spinner-border"></div>
            Kaydediliyor
          </div>
          <span v-if="success">Başarılı</span>
        </button>
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
import Multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
  data () {
    return {
      productList: {},
      quickSearch: '',
      productInformation: {},
      customerPricesList: [],
      customerPricesSearchResults: [],
      customerPricesQuickSearch: false,
      customerPricesProduct: {},
      fetchingProduct: false,
      customerPricesLoading: false,
      exception: {},
      waitingResponse: false,
      success: false,
    }
  },
  components: {
    Multiselect
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.getProducts()
  },
  methods: {
    addtoList (selectedCustomer) {
      if (this.customerPricesList.length > 0) {
        const isExist = _.find(this.customerPricesList, function (cp) {
          return (cp.customerId === selectedCustomer.id) && !cp.deleted
        })
        if (isExist) {
          this.makeToast('danger', 'Hata!', 'Aynı müşteriyi tekrar ekleyemezsiniz!')
          return false
        }
      }
      this.customerPricesList.push({
        id: 0,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        salePrice: this.customerPricesProduct.salePrice
      })
    },
    removeCustomerPriceList (i) {
      if (this.customerPricesList[i].id === 0) {
        this.customerPricesList.splice(i)
      } else {
        this.customerPricesList[i].deleted = true
      }
      this.customerPricesQuickSearch = {}
      this.customerPricesSearchResults = []
    },
    getCustomerPrices (productId) {
      this.customerPricesProduct = []
      this.customerPricesList = []
      this.customerPricesQuickSearch = false
      this.customerPricesSearchResults = []
      this.exception = {}
      this.customerPricesLoading = true
      ipcRenderer.removeAllListeners('getProductDetail')
      ipcRenderer.send('/getProductDetail', { id: productId })
      new Promise(function (resolve) {
        ipcRenderer.on('getProductDetail', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customerPricesProduct = result.result
        ipcRenderer.removeAllListeners('getCustomerProductPrice')
        ipcRenderer.send('/getCustomerProductPrice', { productId: productId, branchId: this.getSession.userDetails.branchId })
        new Promise(function (resolve) {
          ipcRenderer.on('getCustomerProductPrice', (e, result) => {
            resolve(result)
          })
        }).then(result => {
          this.customerPricesList = result.result
          this.customerPricesLoading = false
        })
      })
      this.$bvModal.show('customer-prices')
    },
    search (name) {
      ipcRenderer.removeAllListeners('customerList')
      this.customerPricesSearchResults = []
      if (name.length < 3) {
        return false
      }
      ipcRenderer.send('/getCustomer', { name })
      new Promise(function (resolve) {
        ipcRenderer.on('customerList', (event, result) => {
          resolve(result)
        })
      }).then(result => {
            this.customerPricesSearchResults = []
            console.log(result.result)
            for (const customer of result.result) {
             if (this.customerPricesList.length > 0) {
               const isExist = _.find(this.customerPricesList, function (cp) {
                 return (cp.customerId === customer.id) && !cp.deleted
               })
               if (isExist) {
                 continue
               }
             }
              this.customerPricesSearchResults.push({
                id: customer.id,
                name: customer.name + ' - ' + customer.authorizedPersonName
              })
            }
          }
      )
    },
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
      ipcRenderer.send('/newProduct', this.productInformation)
      new Promise(function (resolve) {
        ipcRenderer.on('newProduct', (e, result) => {
          resolve(result)
        })
      }).then(result => {
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
            this.makeToast('success', 'Kaydedildi!', 'Yeni ürün kaydedildi!')
          } else {
            this.productList[index] = this.productInformation
            this.makeToast('success', 'Güncellendi!', 'Ürün bilgileri güncellendi!')
          }
          this.exception = {}
          this.success = false
          this.waitingResponse = false
          this.$bvModal.hide('product-add-or-edit')
          this.productInformation = {}
        }
      })
    },
    saveCustomerPrices () {
      this.waitingResponse = true
      const form = {
        list: this.customerPricesList,
        productId: this.customerPricesProduct.id,
        userId: this.getSession.userDetails.id,
        branchId: this.getSession.userDetails.branchId
      }
      ipcRenderer.send('/saveCustomerPrices', form)
      new Promise(function (resolve) {
        ipcRenderer.on('saveCustomerPrices', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        console.log(result)
        if (!result.status) {
          this.exception = result.exception
          this.success = false
          this.waitingResponse = false
        } else {
          this.makeToast('success', 'Kaydedildi!', 'Müşterilere özel fiyatlar kaydedildi!')
          this.customerPricesList = []
          this.customerPricesQuickSearch = false
          this.customerPricesSearchResults = []
          this.exception = {}
          this.success = false
          this.waitingResponse = false
          this.$bvModal.hide('customer-prices')
          this.customerPricesList = []
        }
      })
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
        this.makeToast('danger', 'Hata!', 'Bir hata geldi ve ürün silinemedi!')
      } else {
        this.productList.splice(index, 1)
        this.exception = {}
        this.success = true
        this.waitingResponse = false
        this.$bvModal.hide('product-delete')
        this.productInformation = {}
        this.makeToast('success', 'Silindi!', 'Ürün silme işlemi başarılı!')
      }
    }
  },
  mixins: [genericMethods],
}
</script>
