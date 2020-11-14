<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class=" mt-2 mb-3">
      <h6 class="text-transparent mb-0 text-capitalize">
        Müşteriler \ Müşteri Listesi \ {{ customer.name }}
      </h6>
    </b-col>
    <b-col cols="3">
      <b-card v-if="!loadingPage" class="mb-2">
        <b-form-row>
          <b-col cols="12" class="text-center mb-4">
            <b-iconstack font-scale="5" class="my-4">
              <b-icon-square stacked></b-icon-square>
              <b-icon-person stacked></b-icon-person>
            </b-iconstack>
            <h5 class="text-capitalize text-truncate text-center" v-b-tooltip.leftbottom :title="customer.name">
              {{ customer.name }}
            </h5>
            <b-button :variant="customerBalance >= 0 ? 'success' : 'danger'" v-if="!customerBalanceLoading"
                      @click="this.getCustomerBalance()">₺
              {{ moneyFormat(customerBalance) }}
            </b-button>
            <b-button variant="secondary" v-else>
              <b-spinner></b-spinner>
              ₺
            </b-button>
            <hr>
          </b-col>
          <b-col cols="12" v-if="customer.authorizedPersonName">
            <h6 class="text-transparent">Yetkili Kişi</h6>
            <p class="text-capitalize mb-0">{{ customer.authorizedPersonName }}</p>
            <p v-if="customer.citizenIdentification" v-b-tooltip
               :title="['Kimlik Numarası: ' + customer.citizenIdentification]">
              {{ customer.citizenIdentification.substr(0, 5) }}******
            </p>
          </b-col>
          <b-col cols="6" v-if="customer.gsm">
            <h6 class="text-transparent">Mobil</h6>
            <p>{{ customer.gsm }}</p>
          </b-col>
          <b-col cols="6" v-if="customer.gsm">
            <h6 class="text-transparent">İkincil</h6>
            <p>{{ customer.phone }}</p>
          </b-col>
          <b-col cols="12" class="mb-3" v-if="customer.email">
            <h6 class="text-transparent">E-Posta</h6>
            <a v-if="customer.email" v-b-tooltip title="Eposta gönder."
               :href="['mailto:' + customer.email]">
              {{ customer.email }}
            </a>
          </b-col>
          <b-col cols="12" v-if="customer.address">
            <h6 class="text-transparent">Adres</h6>
            <p>{{ customer.address }}</p>
          </b-col>
          <b-col cols="12" class="text-center">
            <hr>
            <b-button variant="outline-success" size="sm"
                      @click="newMoneyFlow(-1,1, 0, '<b-icon-box-arrow-down></b-icon-box-arrow-down>')">
              <b-icon-box-arrow-down></b-icon-box-arrow-down>
              Tahsilat
            </b-button>
            <b-button variant="outline-danger" size="sm"
                      @click="newMoneyFlow(-1,-1, 0, '<b-icon-box-arrow-up></b-icon-box-arrow-up>')">
              <b-icon-box-arrow-up></b-icon-box-arrow-up>
              Ödeme
            </b-button>
            <b-button variant="outline-warning" size="sm"
                      @click="newMoneyFlow(-1,-1, 1, '<b-icon-capslock></b-icon-capslock>')">
              <b-icon-capslock></b-icon-capslock>
              Fiyat Farkı
            </b-button>
          </b-col>
        </b-form-row>
      </b-card>
      <b-card no-body img-top class="mb-2" v-if="loadingPage">
        <b-skeleton-img card-img="top" aspect="3:2"></b-skeleton-img>
        <b-card-body>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
          <b-skeleton></b-skeleton>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col cols="9">
      <b-card header-tag="header" class="tabs customer_tabs">
        <template #header>
          <b-nav tabs class="card-header-tabs" v-if="!loadingPage">
            <b-nav-item v-b-tooltip title="Müşteri hesabına giren çıkan her şey burada gösterilir">
              <b-button variant="link" class="nav-link" :class="activeTab === 'summary' ? 'active' : ''"
                        @click="changeTab('summary')">
                <b-icon-card-checklist></b-icon-card-checklist>
                Hesap Hareketleri
              </b-button>
            </b-nav-item>
            <b-nav-item v-if="plateList.length > 0" v-b-tooltip
                        title="Hangi Plakalı Aracın ne zaman ne aldığını gösterir">
              <b-dropdown variant="link">
                <template #button-content>
                 <span :class="activeTab === 'plateList' ? 'active' : ''">
                      <b-icon-truck></b-icon-truck>
                       Plakalar ({{ plateList.length }})
                    </span>
                </template>
                <b-dropdown-form>
                  <b-input v-model="plateSearchQuery" placeholder="Plaka yazın"></b-input>
                </b-dropdown-form>
                <b-dropdown-item @click="changeTab('plateList', { id: item.id, name: item.plate })"
                                 v-for="item in searchPlate" :key="item.id">
                  <b-icon-truck-flatbed></b-icon-truck-flatbed>
                  {{ item.plate }}
                </b-dropdown-item>
              </b-dropdown>
            </b-nav-item>
            <b-nav-item v-if="driverList.length > 0" v-b-tooltip
                        title="Hangi Şoförün ne zaman ne aldığını gösterir">
              <b-dropdown variant="link" toggle-class="text-decoration-none">
                <template #button-content>
                 <span :class="activeTab === 'driverList' ? 'active' : ''">
                       <b-icon-people></b-icon-people>
                       Şoförler ({{ driverList.length }})
                    </span>
                </template>
                <b-dropdown-form>
                  <b-input v-model="driverSearchQuery" placeholder="Şoför adı yazın"></b-input>
                </b-dropdown-form>
                <b-dropdown-item @click="changeTab('driverList', { id: item.id, name: item.name })"
                                 v-for="item in searchDriver" :key="item.id">
                  <b-icon-person></b-icon-person>
                  {{ item.name }}
                </b-dropdown-item>
              </b-dropdown>
            </b-nav-item>
          </b-nav>
        </template>
        <p v-if="summaryInfo.plate && activeTab === 'plateList' && !loadingPage">{{ summaryInfo.plate }} plakalı araç
          için sonuçlar gösteriliyor.</p>
        <p v-if="summaryInfo.driverName && activeTab === 'driverList' && !loadingPage">{{ summaryInfo.driverName }}
          isimli şoför için sonuçlar gösteriliyor.</p>
        <b-overlay :show="summaryInfo.loading" rounded="sm"
                   :style="summaryList.length && summaryInfo.loading ? 'min-height: 80px' : ''">
          <template #overlay>
            <div class="text-center">
              <b-spinner></b-spinner>
              <p id="cancel-label">Yükleniyor...</p>
            </div>
          </template>
          <b-table-simple hover striped bordered small v-if="summaryList.length">
            <b-thead>
              <b-tr>
                <b-th>Sıra</b-th>
                <b-th>İşlem Yapan</b-th>
                <b-th>₺ Tutar</b-th>
                <b-th>₺ Bakiye</b-th>
                <b-th>Açıklama</b-th>
                <b-th>İşlem Zamanı</b-th>
                <b-th></b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(row, i) in summaryList" :key="row.id"
                    :class="row.priceDifference === 1 ? 'table-warning' : ''">
                <b-td>{{ (i + 1) + (summaryInfo.dataPerPage * (summaryInfo.pageNumber - 1)) }}</b-td>
                <b-td>
                  <span v-if="row.oncreditId" v-b-tooltip.lefttop title="Akaryakıt Satış Görevlisi">
                    <b-icon-file-earmark-person
                        :variant="row.amount < 0 ? 'danger' : 'success'"></b-icon-file-earmark-person>
                    {{ row.salesofficerName }}
                  </span>
                  <span v-if="!row.oncreditId && row.creatorId" v-b-tooltip.lefttop title="Kullanıcı">
                    <b-icon-person variant="success"></b-icon-person>
                    {{ row.name }}
                  </span>
                </b-td>
                <b-td :class="row.amount < 0 ? 'text-danger' : 'text-success'" class="text-right">
                  {{
                    row.amount > 0 ? '+' : ''
                  }}{{ moneyFormat(row.amount) }}
                </b-td>
                <b-td class="text-right"><b>{{ moneyFormat(row.balance) }}</b></b-td>
                <b-td><span class="text-danger" v-if="row.priceDifference"><b-icon-capslock-fill></b-icon-capslock-fill>  </span>{{
                    row.description
                  }}
                </b-td>
                <b-td>{{ moment(row.createDate).format('DD.MM.YYYY HH.mm') }}</b-td>
                <b-td class="text-center">
                  <span v-b-tooltip.leftbottom :class="row.oncreditId > 0 ? '' : 'disabled'"
                        :title="row.oncreditId > 0 ? 'Veresiye Detayını Göster' : ''"
                        :variant="row.oncreditId > 0 ? '' : 'disabled'" @click="getOncreditProducts(row.oncreditId)">
                    <b-icon-file-text class="mx-1"
                                      :variant="row.oncreditId > 0 ? 'success' : 'secondary'"></b-icon-file-text>
                  </span>
                  <span v-b-tooltip.leftbottom :title="!row.oncreditId ? 'Düzenle' : ''"
                        :class="row.oncreditId ? 'disabled' : ''">
                    <b-icon-pencil-square class="mx-1" :variant="!row.oncreditId ? 'primary' : 'secondary'"
                                          :disabled="row.oncreditId"
                                          @click="newMoneyFlow(i, row.flowType, row.priceDifference)"></b-icon-pencil-square>
                  </span>
                  <span v-b-tooltip.rightbottom title="Sil" @click="deleteMoneyFlow(i)"><b-icon-x-circle class="mx-1"
                                                                                                         variant="danger"></b-icon-x-circle></span>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-overlay>
        <b-alert variant="danger" :show="!summaryList.length && !summaryInfo.loading">
          <b-icon-exclamation-circle></b-icon-exclamation-circle>
          Sonuç bulunamadı.
        </b-alert>
        <div class="float-left" v-if="!loadingPage">
          <small v-if="summaryList.length &&  !summaryInfo.loading">Toplam {{ summaryInfo.rowCount }} kayıt
            {{ summaryInfo.queryTime }} saniyede
            okundu.</small></div>
        <b-pagination
            v-if="!loadingPage && (summaryInfo.rowCount > summaryInfo.dataPerPage) && summaryInfo.pageNumber > 0"
            v-model="summaryInfo.pageNumber"
            :total-rows="summaryInfo.rowCount"
            :per-page="summaryInfo.dataPerPage"
            first-text="İlk"
            prev-text="Geri"
            next-text="İleri"
            last-text="Son"
            class="float-right"
            :class="summaryInfo.loading === true ? 'disabled' : ''"
        ></b-pagination>
      </b-card>
    </b-col>
    <b-modal
        id="customer-money-flow"
        centered
    >
      <template #modal-header="{ close }">
        <h5>{{ moneyFlow.id ? 'İşlem Düzenle:' : '' }} {{
            moneyFlow.flowType === 1 ? 'Tahsilat İşlemi' : (moneyFlow.priceDifference === 1 ? 'Fiyat Farkı Girişi' : 'Ödeme İşlemi')
          }}</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="mt-3">
            <label>{{
                moneyFlow.flowType === 1 ? 'Tahsilat' : (moneyFlow.priceDifference === 1 ? 'Fiyat Farkı' : 'Ödeme')
              }} Tutarı</label>
            <b-input-group>
              <b-input min="1"
                       max="5000"
                       type="number"
                       v-model="moneyFlow.amount"
              >
              </b-input>
              <b-input-group-text>
                <b-icon-credit-card></b-icon-credit-card>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.amount">{{ exception.amount }}</span>
          </b-col>
          <b-col class="mt-3">
            <label>Açıklama</label>
            <b-input-group>
              <b-textarea v-model="moneyFlow.description" style="min-height: 80px"
                          placeholder="Varsa işlem açıklaması"></b-textarea>
              <b-input-group-text>
                <b-icon-pencil-square></b-icon-pencil-square>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger"
                  v-if="exception.description">{{ exception.description }}</span>
          </b-col>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Kapat
        </b-button>
        <b-button variant="primary" @click="saveMoneyFlow()"
                  :class="{'disabled': !moneyFlow.amount || waitingResponse || success}"
                  :disabled="!moneyFlow.amount || waitingResponse || success">
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
        id="oncredit-product-list"
        centered
    >
      <template #modal-header="{ close }">
        <h5>Veresiye Ürün Listesi</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <div>
            <b-card no-body class="overflow-hidden" v-if="!oncreditProductListLoading">
              <b-row no-gutters>
                <b-col md="5">
                  <b-card-img :src="oncreditProductList[0].salesofficerImg" stlye="height: 100%"
                              :alt="oncreditProductList[0].salesofficerName" class="rounded-0"></b-card-img>
                </b-col>
                <b-col md="7">
                  <b-card-text class="pl-3 pt-2">
                    <h4>{{ oncreditProductList[0].salesofficerName }}</h4>
                    <p class="p-0">
                      Plaka: {{ oncreditProductList[0].plate }}<br>
                      Şoför: {{ oncreditProductList[0].driverName }}<br>
                      Açıklama: "{{ oncreditProductList[0].description || 'yok' }}"<br>
                      Tarih: {{ moment(oncreditProductList[0].createDate).format('DD.MM.YYYY HH.mm') }}
                    </p>
                  </b-card-text>
                </b-col>
              </b-row>
            </b-card>
            <b-card no-body img-left v-else>
              <b-skeleton-img card-img="left" width="225px"></b-skeleton-img>
              <b-card-body>
                <b-card>
                  <b-skeleton animation="wave" width="85%"></b-skeleton>
                  <b-skeleton animation="wave" width="55%"></b-skeleton>
                  <b-skeleton animation="wave" width="70%"></b-skeleton>
                  <b-skeleton animation="wave" width="65%"></b-skeleton>
                  <b-skeleton animation="wave" width="85%"></b-skeleton>
                </b-card>
              </b-card-body>
            </b-card>
          </div>
          <b-table-simple hover striped bordered small v-if="!oncreditProductListLoading" class="mt-2">
            <b-thead>
              <b-tr>
                <b-th>#</b-th>
                <b-th>Ürün</b-th>
                <b-th>Miktar</b-th>
                <b-th>Birim Fiyat</b-th>
                <b-th class="text-right">Tutar</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(ocp, i) in oncreditProductList">
                <b-td>{{ i + 1 }}</b-td>
                <b-td>{{ ocp.productName || 'Diğer' }}</b-td>
                <b-td>{{ moneyFormat(ocp.amount) }}</b-td>
                <b-td>{{ moneyFormat(ocp.price) }}</b-td>
                <b-td class="text-right">{{ moneyFormat(ocp.subTotal) }}</b-td>
              </b-tr>
              <b-tr class="table-info">
                <b-td>--</b-td>
                <b-td colspan="3">Genel Toplam</b-td>
                <b-td class="text-right">{{ moneyFormat(oncreditProductList[0].totalPrice) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          <div style="height: 20px" v-if="oncreditProductListLoading"></div>
          <b-skeleton-table v-if="oncreditProductListLoading"
                            :rows="3"
                            :columns="5"
                            :table-props="{ bordered: true, striped: true, small: true }"
          ></b-skeleton-table>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Kapat
        </b-button>
      </template>
    </b-modal>
    <b-modal
        id="money-flow-delete"
        centered
    >
      <template #modal-header="{ close }">
        <h5>{{ moneyFlowInformation.id ? 'Silme Onayı' : 'İşlem Bilgisi Alınamadı! Tekrar Deneyiniz' }}</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="mt-3 text-center">
            <b-icon-trash-fill style="width: 120px; height: 120px; color:red"></b-icon-trash-fill>
            <h4><b class="text-capitalize">{{ moneyFormat(this.moneyFlowInformation.amount) }} ₺</b> tutarındaki işlemi
              silmek istediğinizden emin misiniz?</h4>
            <p v-if="this.moneyFlowInformation.description">İşlem Açıklaması: "{{
                this.moneyFlowInformation.description
              }}"</p>
          </b-col>
          <b-col class="mt-3">
            <b-form-checkbox v-model="moneyFlowInformation.deleteValidate" switch size="lg">Silmek istediğimden eminim.
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
        <b-button variant="primary" @click="deleteMoneyFlowSave()"
                  :class="{'disabled': !moneyFlowInformation.deleteValidate || waitingResponse || success}"
                  :disabled="!moneyFlowInformation.deleteValidate || waitingResponse || success">
          <span v-if="!waitingResponse && !Object.keys(exception).length && !success"><b-icon-check2></b-icon-check2> İşlemi Sil</span>
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
<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import genericMethods from '../../mixins/genericMethods'
import moment from 'moment'

export default {
  data () {
    return {
      summaryInfo: {
        plateId: 0,
        driverId: 0,
        dataPerPage: 10,
        pageNumber: 0,
        queryTime: 0,
        pageCount: 0,
        rowCount: 0,
        loading: true
      },
      waitingResponse: false,
      success: false,
      loadingPage: false,
      customerBalanceLoading: true,
      customerBalance: 0,
      activeTab: 'summary',
      customer: {},
      plateSearchQuery: null,
      driverSearchQuery: null,
      plateList: [],
      driverList: [],
      summaryList: [],
      moneyFlow: [],
      exception: [],
      oncreditProductList: [],
      oncreditProductListLoading: true,
      moneyFlowInformation: []
    }
  },
  computed: {
    ...mapGetters(['getSession']),
    moment () {
      return moment
    },
    searchPlate () {
      if (this.plateSearchQuery) {
        return this.plateList.filter((item) => {
          return this.plateSearchQuery.toLowerCase().split(' ').every(v => item.plate.toLowerCase().includes(v))
        })
      } else {
        return this.plateList
      }
    },
    searchDriver () {
      if (this.driverSearchQuery) {
        return this.driverList.filter((item) => {
          return this.driverSearchQuery.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
        })
      } else {
        return this.driverList
      }
    }
  },
  watch: {
    'summaryInfo.pageNumber': function (newPage) {
      this.getCustomerSummary(newPage)
    }
  },
  mounted () {
    this.getCustomer()
    this.getCustomerBalance()
  },
  methods: {
    getCustomer () {
      this.loadingPage = true
      ipcRenderer.removeAllListeners('getCustomerDetail')
      ipcRenderer.send('/getCustomerDetail', { id: this.$route.params.id })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerDetail', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        console.log(result)
        this.customer = result.result
        this.getCustomerSummary(this.summaryInfo.pageNumber)
        this.getCustomerPlates()
        this.loadingPage = false
        return false
      })
    },
    getCustomerBalance: function () {
      this.customerBalanceLoading = true
      ipcRenderer.send('/getCustomerBalance', {
        customerId: this.$route.params.id
      })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerBalance', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customerBalanceLoading = false
        this.customerBalance = result.result
      })
    },
    getCustomerSummary: function (newPageNumber) {
      this.summaryInfo.loading = true
      this.summaryInfo.pageNumber = newPageNumber
      ipcRenderer.removeAllListeners('getCustomerSummary')
      ipcRenderer.send('/getCustomerSummary', {
        customerId: this.$route.params.id,
        plateId: this.summaryInfo.plateId,
        driverId: this.summaryInfo.driverId,
        dataPerPage: this.summaryInfo.dataPerPage,
        pageNumber: this.summaryInfo.pageNumber
      })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerSummary', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        console.log(result)
        this.summaryInfo.loading = false
        this.summaryList = result.result
        this.summaryInfo.loading = false
        this.summaryInfo.pageCount = result.pageCount
        this.summaryInfo.pageNumber = result.pageNumber
        this.summaryInfo.rowCount = result.rowCount
        this.summaryInfo.queryTime = result.queryTime
        return false
      })
    },
    getCustomerPlates () {
      ipcRenderer.removeAllListeners('getCustomerPlates')
      ipcRenderer.send('/getCustomerPlates', { customerId: this.$route.params.id })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerPlates', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.plateList = result.result
        this.getCustomerDrivers()
        return false
      })
    },
    getCustomerDrivers () {
      ipcRenderer.removeAllListeners('getCustomerDrivers')
      ipcRenderer.send('/getCustomerDrivers', { customerId: this.$route.params.id })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerDrivers', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.driverList = result.result
        this.loadingPage = false
        return false
      })
    },
    changeTab (tabName, data) {
      this.activeTab = tabName
      this.summaryList = []
      if (tabName === 'summary') {
        this.summaryInfo.plateId = this.summaryInfo.driverId = 0
        this.summaryInfo.plate = this.summaryInfo.driverName = false
        this.getCustomerSummary(0)
        this.getCustomerBalance()
        return false
      } else if (tabName === 'plateList') {
        this.summaryInfo.driverId = 0
        this.summaryInfo.plateId = data.id
        this.summaryInfo.plate = data.name
        this.getCustomerSummary(0)
        return false
      } else if (tabName === 'driverList') {
        this.summaryInfo.plateId = 0
        this.summaryInfo.driverId = data.id
        this.summaryInfo.driverName = data.name
        this.getCustomerSummary(0)
        return false
      }
    },
    newMoneyFlow (index, flowType, priceDifference) {
      let id
      let amount
      let description
      this.success = false
      if(index >= 0){
        id = this.summaryList[index].id
        amount = this.summaryList[index].amount
        description = this.summaryList[index].description
        priceDifference = this.summaryList[index].priceDifference
        if (amount < 0) {
          amount = amount * -1
          flowType = -1
        } else {
          flowType = 1
        }
      } else {
        id = 0
        amount = ''
      }
      this.moneyFlow = {
        id: id,
        flowType: flowType,
        priceDifference: priceDifference,
        customerId: this.$route.params.id,
        amount: amount,
        description: description
      }
      this.$bvModal.show('customer-money-flow')
    },
    deleteMoneyFlow (index) {
      this.moneyFlowInformation = {
        index: index,
        id: this.summaryList[index].id,
        amount: this.summaryList[index].amount,
        description: this.summaryList[index].description,
        deleteValidate: !!this.summaryList[index].deleteValidate
      }
      this.$bvModal.show('money-flow-delete')
      this.success = false
    },
    deleteMoneyFlowSave () {
      const index = this.moneyFlowInformation.index
      this.waitingResponse = true
      this.moneyFlowInformation.updaterId = this.getSession.userDetails.id
      this.moneyFlowInformation.branchId = this.getSession.userDetails.branchId
      const result = ipcRenderer.sendSync('/deleteMoneyFlow', this.moneyFlowInformation)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        this.exception = {}
        this.success = false
        this.waitingResponse = false
        this.$bvModal.hide('money-flow-delete')
        this.moneyFlowInformation = {}
        this.getCustomerSummary(this.summaryList.pageNumber)
        this.getCustomerBalance()
      }
    },
    saveMoneyFlow () {
      const index = this.moneyFlow.index
      this.waitingResponse = true
      this.moneyFlow.creatorId = this.getSession.userDetails.id
      this.moneyFlow.branchId = this.getSession.userDetails.branchId
      const result = ipcRenderer.sendSync('/newMoneyFlow', this.moneyFlow)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        if (!this.moneyFlow.id) {
          this.changeTab('summary')
        } else {
          this.getCustomerSummary(this.summaryInfo.pageNumber)
          this.getCustomerBalance()
        }
        this.exception = {}
        this.success = false
        this.waitingResponse = false
        this.$bvModal.hide('customer-money-flow')
        this.moneyFlow = {}
      }
    },
    getOncreditProducts (oncreditId) {
      this.oncreditProductListLoading = true
      this.oncreditProductList = []
      if (oncreditId > 0) {
        this.$bvModal.show('oncredit-product-list')
        ipcRenderer.removeAllListeners('getOncreditProducts')
        ipcRenderer.send('/getOncreditProducts', { oncreditId: oncreditId })
        new Promise(function (resolve) {
          ipcRenderer.on('getOncreditProducts', (e, result) => {
            resolve(result)
          })
        }).then(result => {
          this.oncreditProductList = result.result
          this.oncreditProductListLoading = false
          return false
        })
      } else {
        return false
      }
    }
  },
  mixins: [genericMethods]
}
</script>
<style>
.card-header {
  padding-bottom: 2px !important;
}

.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
  border-color: rgba(0, 0, 0, 0) !important;
}

.btn-link {
  font-weight: 400 !important;
  color: #444 !important;
}

.btn-link.active, .btn-link span.active {
  font-weight: 600 !important;
  color: #007bff !important;
}
</style>
