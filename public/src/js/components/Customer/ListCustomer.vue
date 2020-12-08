<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent mb-0">Müşteriler \ Müşteri Listesi</h6>
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
                  v-on:keyup="getCustomers()"
                  placeholder="Hızlı Arama"></b-input>
              <b-input-group-text>
                <b-icon-search></b-icon-search>
              </b-input-group-text>
            </b-input-group>
          </b-col>
          <b-col md="3">
            <b-form-radio-group
                id="moneySituationButtons"
                v-model="moneySituation"
                :options="moneySituationOptions"
                buttons
                button-variant="outline-secondary"
                size=""
                name="radio-btn-outline"
                class="mt-1"
            ></b-form-radio-group>
          </b-col>
          <b-col md="6">
            <b-button class="float-right m-1" variant="outline-success" @click="newCustomer">
              <b-icon-person-plus></b-icon-person-plus>
              Yeni Müşteri Oluştur
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card>
        <b-overlay :show="loading" rounded="sm"
                   :style="customerList.length && loading ? 'min-height: 300px' : ''">
          <template #overlay>
            <div class="text-center">
              <b-spinner></b-spinner>
              <p id="cancel-label">Yükleniyor...</p>
            </div>
          </template>
          <b-table-simple hover bordered striped small responsive="true" v-if="customerList.length > 0">
            <b-thead>
              <b-tr>
                <b-th>#</b-th>
                <b-th>İsim / Unvan</b-th>
                <b-th>Yetkili</b-th>
                <b-th>TL Bakiyesi</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(customer,i) in customerList" :key="i" @click="detail (customer.customerOrgId)">
                <b-th><span v-if="listOptions.pageNumber">{{ (i + 1) + (listOptions.dataPerPage * (listOptions.pageNumber - 1)) }}</span></b-th>
                <b-td style="text-transform: capitalize"><span v-if="customer.oncreditDisabled" v-b-tooltip title="Veresiye Müşterisi Değil"><b-icon icon="exclamation-circle-fill" variant="danger"></b-icon></span> {{ customer.name }}</b-td>
                <b-td class="text-capitalize"><b-icon icon="person-check" v-if="customer.authorizedPersonName"></b-icon> {{ customer.authorizedPersonName }}</b-td>
                <b-td :class="{'text-success': customer.balance > 0, 'text-danger': customer.balance < 0}">{{ moneyFormat(customer.balance) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          <p class="text-center" v-if="!customerList.length && !loading"><b-icon icon="exclamation-circle-fill" variant="danger"></b-icon> Kayıt bulunamadı.</p>
        </b-overlay>
        <div class="float-left" v-if="!loading">
          <small v-if="customerList.length &&  !loading">Toplam {{ listOptions.rowCount }} kayıt
            {{ listOptions.queryTime }} saniyede
            okundu.</small></div>
        <b-pagination
            v-if="!loading && (listOptions.rowCount > listOptions.dataPerPage) && listOptions.pageNumber > 0"
            v-model="listOptions.pageNumber"
            :total-rows="listOptions.rowCount"
            :per-page="listOptions.dataPerPage"
            first-text="İlk"
            prev-text="Geri"
            next-text="İleri"
            last-text="Son"
            class="float-right"
            :class="loading === true ? 'disabled' : ''"
        ></b-pagination>
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
      customerList: {},
      listOptions: {
        dataPerPage: 10,
        pageNumber: 1,
        queryTime: 0,
        pageCount: 0,
        rowCount: 0
      },
      segmentList: [],
      quickSearch: '',
      moneySituation: 0,
      moneySituationOptions: [
        { text: 'Tümü', value: '0' },
        { text: 'Borçlular', value: '-1' },
        { text: 'Alacaklılar', value: '1' }
      ]
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.getCustomers()
  },
  watch: {
    'listOptions.pageNumber': function (newPage) {
      this.getCustomers(newPage)
    },
    'moneySituation': function (moneySituation) {
      this.getCustomers()
    }
  },
  methods: {
    getCustomers (newPage) {
      this.loading = true
      this.listOptions.pageNumber = newPage
      const form = {
        dataPerPage: this.listOptions.dataPerPage,
        pageNumber: this.listOptions.pageNumber,
        moneySituation: this.moneySituation
      }
      if (this.quickSearch.length > 1) {
        form.name = this.quickSearch
      }
      ipcRenderer.removeAllListeners('customerList')
      ipcRenderer.send('/customerList', form)
      new Promise(function (resolve) {
        ipcRenderer.on('customerList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customerList = result.result
        this.listOptions.pageCount = result.pageCount
        this.listOptions.pageNumber = result.pageNumber
        this.listOptions.rowCount = result.rowCount
        this.listOptions.queryTime = result.queryTime
        this.loading = false
      })
    },
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
            name: segment.name,
            status: false
          })
        }
      })
    },
    detail (customerId) {
      this.$router.push('/SummaryCustomer/' + customerId)
    },
    newCustomer () {
      this.$router.push('/NewCustomer')
    },
    editCustomer (customerId) {
      this.$router.push('/EditCustomer/' + customerId)
    }
  },
  mixins: [genericMethods]
}
</script>
