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
            <b-button class="float-right m-1" variant="outline-primary">
              <b-icon-printer></b-icon-printer> İcmal Yazdır
            </b-button>
            <b-button class="float-right m-1" variant="outline-success" @click="newProduct()">
              <b-icon-cart-plus></b-icon-cart-plus> Yeni Ürün Oluştur
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card>
        <b-card-body>
          <div class="table-responsive" v-if="productList.length > 0">
            <table class="table table-hover table-bordered table-striped">
              <thead>
              <tr>
                <th>#</th>
                <th>Ürün Adı</th>
                <th>Satış Fiyatı</th>
                <th>Vadeli Satış Fiyatı</th>
                <th>Vade Yüzdesi</th>
                <th>İşlem</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(product,i) in productList" :key="i">
                <th>{{ i + 1 }}</th>
                <td style="text-transform: capitalize"><span v-if="product.salePrice <=0 || product.salePrice>product.forwardSalePrice"><b-icon-exclamation-circle-fill class="text-danger"></b-icon-exclamation-circle-fill></span> {{ product.name }}</td>
                <td><span v-if="product.salePrice <=0 "><b-icon-exclamation-circle-fill class="text-danger"></b-icon-exclamation-circle-fill></span> {{ product.salePrice }}</td>
                <td><span v-if="product.forwardSalePrice <=0 || product.salePrice>product.forwardSalePrice"><b-icon-exclamation-circle-fill class="text-danger"></b-icon-exclamation-circle-fill></span> {{ product.forwardSalePrice }}</td>
                <td>{{ (product.salePrice>0 && product.forwardSalePrice>0) ? (100-(product.salePrice*100/product.forwardSalePrice)).toFixed(2) : 0 }}%</td>
                <td>
                  <b-button-group size="sm">
                    <b-dropdown variant="outline-secondary" right text="İşlemler">
                      <b-dropdown-item variant="warning" @click="editProduct(product.id)"><i class="ri-edit-2-fill"></i>
                        Düzenle
                      </b-dropdown-item>
                      <b-dropdown-divider></b-dropdown-divider>
                      <b-dropdown-item variant="danger"><i class="ri-delete-bin-2-fill"></i> Sil</b-dropdown-item>
                      <b-dropdown-item variant="warning"><i class="ri-edit-2-fill"></i> Modal ile Aç</b-dropdown-item>
                    </b-dropdown>
                  </b-button-group>

                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <div class="text-primary"></div>
            <b-skeleton-table
                :rows="10"
                :columns="5"
                :table-props="{ bordered: true, striped: true }"
            ></b-skeleton-table>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
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
      quickSearch: ''
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
      ipcRenderer.send('/productList')
      new Promise(function (resolve) {
        ipcRenderer.on('productList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.productList = result.result
      })
    },
    detail (productId) {
      this.$router.push('/DetailProduct/' + productId)
    },
    newProduct () {
      this.$router.push('/NewProduct')
    },
    editProduct (productId) {
      this.$router.push('/EditProduct/' + productId)
    }
  },
  mixins: [genericMethods]
}
</script>
