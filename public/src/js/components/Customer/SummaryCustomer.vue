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
          <b-col cols="12" class="mb-3">
            <h6 class="text-transparent">E-Posta</h6>
            <a v-if="customer.email" v-b-tooltip title="Eposta gönder."
               :href="['mailto:' + customer.email]">
              {{ customer.email }}
            </a>
          </b-col>
          <b-col cols="12">
            <h6 class="text-transparent">Adres</h6>
            <p>{{ customer.address }}</p>
          </b-col>
          <b-col cols="12" class="text-right">
            <b-button size="sm" variant="outline-primary">
              <b-icon-pencil-square></b-icon-pencil-square>
              Düzenle
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
        <b-table-simple hover striped bordered small v-if="summaryList.length">
          <b-thead>
            <b-tr>
              <b-th>Id</b-th>
              <b-th>İşlem Yapan</b-th>
              <b-th>₺ Tutar</b-th>
              <b-th>₺ Bakiye</b-th>
              <b-th>Açıklama</b-th>
              <b-th>İşlem Zamanı</b-th>
              <b-th></b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="row in summaryList" :key="row.id">
              <b-td>{{ row.id }}</b-td>
              <b-td>
                <span v-if="row.oncreditId" v-b-tooltip.lefttop title="Akaryakıt Satış Görevlisi">
                  <b-icon-file-earmark-person
                      :variant="row.amount < 0 ? 'danger' : 'success'"></b-icon-file-earmark-person>
                  Pompacının Adı
                </span>
                <span v-if="!row.oncreditId && row.creatorId" v-b-tooltip.lefttop title="Kullanıcı">
                  <b-icon-person variant="success"></b-icon-person>
                  {{ row.name }}
                </span>
              </b-td>
              <b-td :class="row.amount < 0 ? 'text-danger' : 'text-success'">{{
                  row.amount > 0 ? '+' : ''
                }}{{ row.amount }}
              </b-td>
              <b-td><b>{{ row.balance }}</b></b-td>
              <b-td>{{ row.description }}</b-td>
              <b-td>{{ moment(row.createDate).format('LL HH:mm') }}</b-td>
              <b-td class="text-center">
                <span v-b-tooltip.leftbottom title="Fiş Yazdır"><b-icon-printer class="mx-1" variant="success"></b-icon-printer></span>
                <span v-b-tooltip.leftbottom title="Düzenle"><b-icon-pencil-square class="mx-1" variant="primary" :disabled="row.oncreditId"></b-icon-pencil-square></span>
                <span v-b-tooltip.topright title="Sil"><b-icon-x-circle class="mx-1" variant="danger"></b-icon-x-circle></span>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <b-alert variant="danger" :show="!summaryList.length && !loadingPage">
          <b-icon-exclamation-circle></b-icon-exclamation-circle>
          Sonuç bulunamadı.
        </b-alert>
        <b-skeleton-table
            v-if="loadingPage"
            :rows="7"
            :columns="6"
            :table-props="{ bordered: true, striped: true }">
        </b-skeleton-table>
        <div class="float-left" v-if="summaryInfo.loading">
          <b-spinner></b-spinner>
          Yükleniyor..
        </div>
        <div class="float-left" v-else>
          <small>Toplam {{ summaryInfo.rowCount }} kayıt {{ summaryInfo.queryTime }} saniyede okundu.</small></div>
        <b-pagination
            v-if="!loadingPage && (summaryInfo.rowCount > summaryInfo.dataPerPage)"
            v-model="summaryInfo.pageNumber"
            :total-rows="summaryInfo.rowCount"
            :per-page="summaryInfo.dataPerPage"
            first-text="İlk"
            prev-text="Geri"
            next-text="İleri"
            last-text="Son"
            class="float-right"
            :class="summaryInfo.loading === true ? 'disabled' : ''"
            @input="getCustomerSummary(summaryInfo.pageNumber)"
        ></b-pagination>
      </b-card>
    </b-col>
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
        loading: false
      },
      loadingPage: false,
      activeTab: 'summary',
      customer: {},
      plateSearchQuery: null,
      driverSearchQuery: null,
      plateList: [],
      driverList: [],
      summaryList: []
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
  mounted () {
    this.getCustomer()
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
        this.customer = result.result
        this.getCustomerSummary(this.summaryInfo.pageNumber)
        this.getCustomerPlates()
        this.loadingPage = false
        return false
      })
    },
    getCustomerSummary: function (newPageNumber) {
      this.loadingPage = true
      this.summaryInfo.loading = true
      this.summaryInfo.pageNumber = newPageNumber
      this.summaryList = []
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
        this.loadingPage = false
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
      if (tabName === 'summary') {
        this.summaryInfo.plateId = this.summaryInfo.driverId = 0
        this.summaryInfo.plate = this.summaryInfo.driverName = false
        this.getCustomerSummary(0)
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
