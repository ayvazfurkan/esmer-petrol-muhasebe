<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent mb-0">Personeller \ Akaryakıt Satış Görevlileri</h6>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="12" class="mb-3">
      <b-card>
        <b-card-body>
          <b-table-simple bordered>
            <b-thead>
              <b-tr>
                <b-th>#</b-th>
                <b-th>Fotoğraf</b-th>
                <b-th>İsim</b-th>
                <b-th>Telefon</b-th>
                <b-th>Aksiyon</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr>
                <b-td>1</b-td>
                <b-td>Fotoğraf</b-td>
                <b-td>Ad Soyad</b-td>
                <b-td>05457426200</b-td>
                <b-td>
                  <b-button variant="outline-danger">
                    <b-icon-x></b-icon-x> Sil
                  </b-button>
                  <b-button variant="outline-primary">
                    <b-icon-arrow-right-short></b-icon-arrow-right-short> Düzenle
                  </b-button>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      salesofficers: []
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.get()
  },
  methods: {
    get () {
      ipcRenderer.send('/salesofficer/list', { branchId: this.getSession.userDetails.branchId })
      new Promise(function (resolve) {
        ipcRenderer.on('salesofficerList', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        if (response.length < 1) {
          this.errors.salesofficers = 'Kayıtlı personel bulunamadı.'
        }
        this.salesofficers = response
        setTimeout(() => {
          this.loading = false
        }, 750)
      })
    }
  }
}
</script>
