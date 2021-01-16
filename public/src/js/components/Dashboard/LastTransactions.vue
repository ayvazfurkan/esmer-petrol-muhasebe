<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card class="max-h-900">
          <b-form-row>
            <b-col cols="12">
              <h6>Günlük Veresiye Fişleri</h6>
            </b-col>
            <b-col cols="3">
              <b-form-datepicker
                  v-model="dateStart"
                  class="border"
                  locale="tr"
                  v-bind="calendarLabels"
                  :max="dateEnd"
                  :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"
                  @input="get">
                <template #button-content>
                  <b-icon-calendar4-week></b-icon-calendar4-week>
                </template>
              </b-form-datepicker>
            </b-col>
            <b-col cols="1" class="text-center" align-self="center">
              <b-icon-arrow-right></b-icon-arrow-right>
            </b-col>
            <b-col cols="3">
              <b-form-datepicker
                class="border"
                v-model="dateEnd"
                locale="tr"
                :min="dateStart"
                v-bind="calendarLabels"
                :max="moment().format('YYYY-MM-DD')"
                :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }"
                @input="get">
                <template #button-content>
                  <b-icon-calendar4-week></b-icon-calendar4-week>
                </template>
              </b-form-datepicker>
            </b-col>
            <b-col cols="4" align-self="center">
              arası sonuçlar gösteriliyor.
            </b-col>
          </b-form-row>
          <b-table-simple borderless striped v-if="!_.isEmpty(transactions) && !loading" class="mt-2">
            <b-tbody>
              <b-tr v-for="transaction of transactions" :key="transaction.id" @click="summaryCustomer(transaction.customerId)">
                <b-td class="text-capitalize">{{ transaction.customerName }}</b-td>
                <b-td>{{ transaction.plate }}</b-td>
                <b-td>₺{{ moneyFormat(transaction.totalPrice) }}</b-td>
                <b-td>{{
                  moment(transaction.createDate).format('DD MMM, HH:mm')
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
      dateStart: '',
      dateEnd: '',
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
    dateStart: function () {
      this.get()
    },
    dateEnd: function () {
      this.get()
    }
  },
  mounted () {
    this.dateStart = moment().format('YYYY-MM-DD')
    this.dateEnd = moment().format('YYYY-MM-DD')
    this.get()
  },
  methods: {
    get () {
      this.loading = true
      this.transactions = []
      ipcRenderer.send('/oncredit/list', {
        branchId: this.branchId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
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
.max-h-900 {
  max-height: 900px;
  overflow-y: auto;
}
</style>
