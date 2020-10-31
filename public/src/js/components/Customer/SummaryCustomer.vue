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
      <b-card
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
      <div class="float-left ml-3 col-9">
        <b-card no-body>
          <b-tabs card class="customer_tabs">
            <b-tab active>
              <template #title>
                <b-icon-wallet2></b-icon-wallet2>
                Hesap Hareketleri
              </template>
              <p>Hesap hareketleri buraya getirilecek</p>
            </b-tab>
            <b-tab v-if="plates.length <= 3 && plates.length > 0" v-for="plate in plates" :key="plate.id">
              <template #title>
                <b-icon-truck></b-icon-truck>
                {{ plate.plate }}
              </template>
              <p>{{ plate.plate }} plakalı aracın aldığı veresiye hesap hareketleri buraya gelecek</p>
            </b-tab>
            <b-tab v-if="plates.length > 3">
              <template #title>
                <b-icon-truck-flatbed></b-icon-truck-flatbed>
                Plakalar ({{ plates.length }} adet)
              </template>
              <p>plakalar için toplu yer</p>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </b-col>
  </b-row>
</template>
<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import genericMethods from '../../mixins/genericMethods'

export default {
  data () {
    return {
      customer: {},
      plates: [
        {
          id: 1,
          plate: '52BS507'
        },
        {
          id: 2,
          plate: '61KJ4545'
        },
        {
          id: 3,
          plate: '61LS123'
        },
        {
          id: 4,
          plate: '61LS123'
        },
        {
          id: 5,
          plate: '61LS123'
        },
        {
          id: 6,
          plate: '61LS123'
        },
        {
          id: 7,
          plate: '61LS123'
        },
        {
          id: 8,
          plate: '61LS123'
        }
      ]
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
      ipcRenderer.send('/getCustomerDetail', { id: this.$route.params.id })
      new Promise(function (resolve) {
        ipcRenderer.on('getCustomerDetail', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.customer = result.result
      })
    }
  },
  mixins: [genericMethods]
}
</script>
