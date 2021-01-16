<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent text-capitalize mb-0">
            {{ this.getSession.userDetails.companyName }}
            <b-icon-dot class="mx-3"></b-icon-dot>
            {{ this.getSession.userDetails.branchName }}
            <b-icon-dot class="mx-3"></b-icon-dot>
            {{ this.getSession.userDetails.username }}
          </h6>
        </b-col>
        <b-col class="text-right">
          <h6 class="text-transparent text-capitalize mb-0">
            {{ this.getSession.userDetails.name }}
          </h6>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="6">
      <b-row>
        <b-col class="mb-4" cols="6">
          <b-card>
            <h6>Müşteri Hacimleri</h6>
            <customer-volume :height="150"></customer-volume>
          </b-card>
        </b-col>
        <b-col class="mb-4" cols="6">
          <b-card>
            <h6>Segment Dağılımı</h6>
            <customer-segments :height="150"></customer-segments>
          </b-card>
        </b-col>
        <b-col class="mb-4" cols="12">
          <b-card>
            <h6>Ürün Dağılımı</h6>
            <product-diversity :height="100"></product-diversity>
          </b-card>
        </b-col>
        <b-col class="mb-4" cols="12">
          <b-card>
            <h6>Son 7 Gün</h6>
            <line-summary :height="100" ref="weeklySummary"></line-summary>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="6" class="px-0">
      <last-transactions></last-transactions>
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from 'vuex'
import LastTransactions from './LastTransactions.vue'
import CustomerVolume from './Charts/CustomerVolume.vue'
import ProductDiversity from './Charts/ProductDiversity.vue'
import LineSummary from './Charts/LineSummary.vue'
import CustomerSegments from './Charts/CustomerSegments.vue'

export default {
  components: {
    CustomerSegments,
    LastTransactions,
    CustomerVolume,
    ProductDiversity,
    LineSummary
  },
  computed: {
    ...mapGetters(['getSession'])
  }
}
</script>
