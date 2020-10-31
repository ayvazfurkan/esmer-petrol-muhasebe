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
          <b-col md="9">
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
            <b-tr v-for="(customer,i) in customerList" :key="i" @click="detail (customer.id)">
              <b-th>{{ i + 1 }}</b-th>
              <b-td style="text-transform: capitalize">{{ customer.name }}</b-td>
              <b-td>{{ customer.authorizedPersonName }}</b-td>
              <b-td>0,00</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
          <div v-else>
            <div class="text-primary"></div>
            <b-skeleton-table
                :rows="10"
                :columns="4"
                :table-props="{ bordered: true, striped: true }"
            ></b-skeleton-table>
          </div>
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
      segmentList: [],
      quickSearch: ''
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.getCustomers()
    this.setSegment()
  },
  methods: {
    getCustomers () {
      ipcRenderer.send('/customerList')
      new Promise(function (resolve) {
        ipcRenderer.on('customerList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customerList = result.result
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
    selectSegment (i) {
      this.segmentList[i].status = !this.segmentList[i].status
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
