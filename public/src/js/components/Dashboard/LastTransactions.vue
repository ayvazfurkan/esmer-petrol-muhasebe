<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col cols="4">
              <h6>Günlük Veresiye Fişleri</h6>
            </b-col>
            <b-col cols="8" class="text-right">
              <b-form-datepicker
                v-model="date"
                locale="tr"
                v-bind="calendarLabels"
                :max="moment().format('YYYY-MM-DD')"
                @input="get">
                <template #button-content></template>
              </b-form-datepicker>
            </b-col>
          </b-row>
          <b-table-simple borderless striped v-if="!_.isEmpty(transactions) && !loading" class="max-h-600">
            <b-tbody>
              <b-tr v-for="transaction of transactions" :key="transaction.id" @click="summaryCustomer(transaction.customerId)">
                <b-td class="text-capitalize">{{ transaction.customerName }}</b-td>
                <b-td>{{ transaction.plate }}</b-td>
                <b-td>₺{{ moneyFormat(transaction.totalPrice) }}</b-td>
                <b-td>{{
                  moment(transaction.createDate).format('HH:mm')
                }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          <b-skeleton-table
          v-if="loading"
            :rows="10"
            :columns="4"
            :table-props="{ bordered: false, striped: true }"
          ></b-skeleton-table>
          <p class="text-danger" v-if="_.isEmpty(transactions) && !loading">
            <b-icon-exclamation-circle class="mr-1"></b-icon-exclamation-circle>
            {{ moment(this.date).format("DD MMMM") }} tarihi için kayıtlı işlem
            bulunamadı.
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import genericMethods from '../../mixins/genericMethods'
import calendar from '../../mixins/calendar'

export default {
  mixins: [genericMethods, calendar],
  data () {
    return {
      date: '',
      transactions: []
    }
  },
  computed: {
    ...mapGetters(['getSession']),
    _ () {
      return _
    },
    moment () {
      return moment
    },
    branchId: function () {
      return this.getSession.userDetails.branchId
    }
  },
  watch: {
    date: function () {
      this.get()
    }
  },
  mounted () {
    this.date = moment().format('YYYY-MM-DD')
    this.get()
  },
  methods: {
    get () {
      this.loading = true
      this.transactions = []
      ipcRenderer.send('/oncredit/list', {
        branchId: this.branchId,
        date: this.date
      })
      new Promise(function (resolve) {
        ipcRenderer.on('oncreditList', (event, response) => {
          resolve(response)
        })
      }).then((response) => {
        this.loading = false
        this.transactions = response
      })
    },
    summaryCustomer (customerId) {
      this.$router.push('/SummaryCustomer/' + customerId)
    }
  }
}
</script>
<style>
.max-h-600 {
  max-height: 700px;
  overflow-y: auto;
}
</style>
