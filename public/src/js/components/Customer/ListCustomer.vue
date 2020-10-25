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
    <b-col cols="12">
      <b-card>
        <b-card-body>
          <div class="table-responsive" v-if="customerList.length > 0">
            <table class="table table-hover table-bordered table-striped">
              <thead>
              <tr>
                <th>#</th>
                <th>İsim / Unvan</th>
                <th>Yetkili</th>
                <th>TRY Bakiyesi</th>
                <th>İşlem</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(customer,i) in customerList" :key="i">
                <th>{{ i + 1 }}</th>
                <td style="text-transform: capitalize">{{ customer.name }}</td>
                <td>{{ customer.authorizedPersonName }}</td>
                <td>0,00</td>
                <td>
                  <b-button-group size="sm">
                    <b-dropdown variant="outline-secondary" right text="İşlemler">
                      <b-dropdown-item variant="warning" @click="editCustomer(customer.id)"><i
                          class="ri-edit-2-fill"></i> Düzenle
                      </b-dropdown-item>
                      <b-dropdown-divider></b-dropdown-divider>
                      <b-dropdown-item variant="danger"><i class="ri-delete-bin-2-fill"></i> Sil</b-dropdown-item>
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
      this.$router.push('/DetailCustomer/' + customerId)
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
