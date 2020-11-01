<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-col class="align-self-center">
        <h6 class="text-transparent mb-0 text-capitalize">
          Müşteriler \ Müşteri Listesi \
          {{ customer.name }}
        </h6>
      </b-col>
    </b-col>
    <b-col cols="12" class="ml-3">
      <b-card v-if="!loadingPage"
          img-src="https://picsum.photos/600/300/?image=25"
          :img-alt="customer.name"
          img-top
          style="max-width: 20rem;"
          class="mb-2 float-left"
      >
        <h4 class="text-capitalize text-truncate" style="width: 100%" v-b-tooltip
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
      <div class="float-left ml-3 col-9" v-if="!loadingPage">
        <div class="card">
          <div class="tabs customer_tabs">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="ml-1 mr-1" v-b-tooltip title="Müşteri hesabına giren çıkan her şey burada gösterilir">
                  <span class="nav-link cursor-pointer" :class="activeTab === 'summary' ? 'active' : ''"
                        @click="changeTab('summary')">
                    <b-icon-card-checklist></b-icon-card-checklist>
                     Hesap Hareketleri
                  </span>
                </li>
                <li class="ml-1 mr-1" v-if="plateList.length > 0" v-b-tooltip
                    title="Hangi Plakalı Aracın ne zaman ne aldığını gösterir">
                  <div class="btn-group">
                    <span id="plateListGroupDrop" class="nav-link cursor-pointer dropdown-toggle"
                          :class="activeTab === 'plateList' ? 'active' : ''" data-toggle="dropdown" aria-haspopup="true"
                          aria-expanded="false">
                      <b-icon-truck></b-icon-truck>
                       Plakalar ({{ plateList.length }})
                    </span>
                    <div class="dropdown-menu" aria-labelledby="plateListGroupDrop">
                      <div>
                        <label>
                          <input type="text" class="form-control" v-model="plateSearchQuery"
                                 placeholder="Plaka yazın"
                          />
                        </label>
                      </div>
                      <div class="dropdown-items">
                        <a class="dropdown-item cursor-pointer" @click="changeTab('plateList', item.id)"
                           v-for="item in searchPlate">
                          <b-icon-truck-flatbed></b-icon-truck-flatbed>
                          {{ item.plate }}
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="ml-1 mr-1" v-if="driverList.length > 0" v-b-tooltip
                    title="Hangi Şoförün ne zaman ne aldığını gösterir">
                  <div class="btn-group" role="group">
                    <span id="driverListGroupDrop" class="nav-link cursor-pointer dropdown-toggle"
                          :class="activeTab === 'driverList' ? 'active' : ''" data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                      <b-icon-people></b-icon-people>
                       Şoförler ({{ driverList.length }})
                    </span>
                    <div class="dropdown-menu" aria-labelledby="driverListGroupDrop">
                      <div>
                        <label>
                          <input type="text" class="form-control" v-model="driverSearchQuery"
                                 placeholder="Şoför adı yazın"
                          />
                        </label>
                      </div>
                      <div class="dropdown-items">
                        <a class="dropdown-item cursor-pointer" @click="changeTab('driverList', item.id)"
                           v-for="item in searchDriver">
                          <b-icon-person></b-icon-person>
                          {{ item.name }}
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="tab-content p-3">
              <template>
                <div v-if="summaryList.length">
                  <table class="table table-hover table-striped table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>İşlem Yapan</th>
                        <th>Tutar</th>
                        <th>Bakiye</th>
                        <th>Açıklama</th>
                        <th>İşlem Zamanı</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in summaryList">
                        <td>{{ row.id }}</td>
                        <td><b-icon-person></b-icon-person> {{ row.name }}</td>
                        <td :class="row.amount < 0 ? 'text-danger' : 'text-success'">{{ row.amount > 0 ? '+' : '' }}{{ row.amount }}</td>
                        <td><b>{{ totalAmount }}</b></td>
                        <td>{{ row.description }}</td>
                        <td>{{ moment(row.createDate).format('LL HH:mm') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="float-left ml-3 col-9" v-if="loadingPage">
        <b-skeleton-table
            :rows="7"
            :columns="6"
            :table-props="{ bordered: true, striped: true }"
        ></b-skeleton-table>
      </div>
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
        dataPerPage: 10,
        pageNumber: 0
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
    totalAmount: 0,
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
        this.getCustomerSummary()
        this.getCustomerPlates()
        return false
      })
    },
    getCustomerSummary () {
      ipcRenderer.send('/getCustomerSummary', {
        customerId: this.$route.params.id,
        dataPerPage: this.summaryInfo.dataPerPage,
        pageNumber: this.summaryInfo.pageNumber
      })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerSummary', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.summaryList = result.result
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
    }
  },
  mixins: [genericMethods]
}
</script>
