<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-col class="align-self-center">
        <h6 class="text-transparent mb-0 text-capitalize">
          Müşteriler \ Müşteri Listesi \ {{ customer.name }}
        </h6>
      </b-col>
    </b-col>
    <b-col cols="3">
      <b-card v-if="!loadingPage"
              img-src="https://picsum.photos/600/300/?image=25"
              :img-alt="customer.name"
              img-top
              class="mb-2">
        <h4 class="text-capitalize text-truncate" style="width: 100%" v-b-tooltip.leftbottom
            :title="customer.name">
          {{ customer.name }}
        </h4>
        <h5 class="text-capitalize" v-if="customer.authorizedPersonName">
          <b-icon-person-badge></b-icon-person-badge>
          {{ customer.authorizedPersonName }}
        </h5>
        <div>
          <span v-if="customer.gsm"><b-icon-phone></b-icon-phone> {{ customer.gsm }}</span>
          <span v-if="customer.phone"><b-icon-telephone></b-icon-telephone> {{ customer.phone }}</span>
        </div>
        <a v-if="customer.email" v-b-tooltip title="Eposta göndermek için tıklayınız"
           :href="['mailto:' + customer.email]">
          <b-icon-envelope></b-icon-envelope>
          {{ customer.email }}
        </a>
        <span v-if="customer.citizenIdentification" v-b-tooltip
              :title="['Kimlik Numarası: ' + customer.citizenIdentification]">
          {{ customer.citizenIdentification.substr(0, 5) }}******
        </span>
        <b-card-text>
          {{ customer.address }}
        </b-card-text>
        <b-button href="#" size="sm" variant="primary">
          <b-icon-pencil></b-icon-pencil>
          Düzenle
        </b-button>
      </b-card>
      <b-card no-body img-top class="mb-2 float-left" style="width:280px" v-if="loadingPage">
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
      <b-card header-tag="header" v-if="!loadingPage" class="tabs customer_tabs">
        <template #header>
          <b-nav tabs class="card-header-tabs">
            <b-nav-item v-b-tooltip title="Müşteri hesabına giren çıkan her şey burada gösterilir">
                <span class="nav-link cursor-pointer" :class="activeTab === 'summary' ? 'active' : ''"
                      @click="changeTab('summary')">
                    <b-icon-card-checklist></b-icon-card-checklist>
                     Hesap Hareketleri
                  </span>
            </b-nav-item>
            <b-nav-item v-if="plateList.length > 0" v-b-tooltip
                        title="Hangi Plakalı Aracın ne zaman ne aldığını gösterir">
              <b-dropdown variant="link" toggle-class="text-decoration-none">
                <template #button-content>
                 <span :class="activeTab === 'plateList' ? 'active' : ''">
                      <b-icon-truck></b-icon-truck>
                       Plakalar ({{ plateList.length }})
                    </span>
                </template>
                <b-dropdown-form>
                  <b-input v-model="plateSearchQuery" placeholder="Plaka yazın"></b-input>
                </b-dropdown-form>
                <b-dropdown-item @click="changeTab('plateList', item.id)"
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
                <b-dropdown-item @click="changeTab('driverList', item.id)"
                                 v-for="item in searchDriver" :key="item.id">
                  <b-icon-person></b-icon-person>
                  {{ item.name }}
                </b-dropdown-item>
              </b-dropdown>
            </b-nav-item>
          </b-nav>
        </template>
        <b-table-simple hover striped bordered small v-if="summaryList.length">
          <b-thead>
            <b-tr>
              <b-th>Id</b-th>
              <b-th>İşlem Yapan</b-th>
              <b-th>Tutar</b-th>
              <b-th>Bakiye</b-th>
              <b-th>Açıklama</b-th>
              <b-th>İşlem Zamanı</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="row in summaryList" :key="row.id">
              <b-td>{{ row.id }}</b-td>
              <b-td>
                <b-icon-person></b-icon-person>
                {{ row.name }}
              </b-td>
              <b-td :class="row.amount < 0 ? 'text-danger' : 'text-success'">{{
                  row.amount > 0 ? '+' : ''
                }}{{ row.amount }}
              </b-td>
              <b-td>{{ row.balance }}</b-td>
              <b-td>{{ row.description }}</b-td>
              <b-td>{{ moment(row.createDate).format('LL HH:mm') }}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
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
        <div class="float-left" v-else><small>Toplam {{ summaryInfo.rowCount }} kayıt {{ summaryInfo.queryTime }}
          saniyede okundu.</small></div>
        <b-pagination
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
        dataPerPage: 2,
        pageNumber: 0,
        queryTime: 0,
        pageCount: 0,
        rowCount: 0,
        loading: false
      },
      loadingPage: true,
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
      ipcRenderer.send('/getCustomerDetail', { id: this.$route.params.id })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerDetail', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customer = result.result
        this.getCustomerSummary(this.summaryInfo.pageNumber)
        this.getCustomerPlates()
        return false
      })
    },
    getCustomerSummary: function (newPageNumber) {
      this.summaryInfo.loading = true
      this.summaryInfo.pageNumber = newPageNumber
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
    changeTab (tabName, id) {
      this.activeTab = tabName
      if (tabName === 'summary') {
        this.summaryInfo.plateId = this.summaryInfo.driverId = 0
        this.getCustomerSummary(0)
        return false
      } else if (tabName === 'plateList') {
        this.summaryInfo.driverId = 0
        this.summaryInfo.plateId = id
        this.getCustomerSummary(0)
        return false
      } else if (tabName === 'driverList') {
        this.summaryInfo.plateId = 0
        this.summaryInfo.driverId = id
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
  padding-bottom: 4px !important;
}

.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
  border-color: rgba(0, 0, 0, 0) !important;
}

.btn-link {
  font-weight: 400 !important;
  color: #444 !important;
}
</style>
