<template>
    <div class="row py-5">
        <div class="col-12 mt-3"></div>
        <div class="col-12 pb-3 pt-2">
            <h6 class="text-transparent mb-0">Müşteriler \ Müşteri Listesi \ {{detail.name.concat(" ", detail.surname)}}</h6>
        </div>
        <div class="col-12">
            {{detail.name}}
        </div>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import genericMethods from '../../mixins/genericMethods'

export default {
  data () {
    return {
      detail: {}
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.getCustomer()
  },
  methods: {
    getCustomer () {
      const result = ipcRenderer.sendSync('/getCustomerDetail', { id: this.$route.params.id })
      this.detail = result.result
    }
  },
  mixins: [genericMethods]
}
</script>
