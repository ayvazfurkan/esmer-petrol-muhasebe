<template>
  <b-row class="py-5 mt-5">
    <b-col cols="12" class="mt-5"></b-col>
    <b-col offset="4" cols="4">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Şirket Bilgisi" active>
            <b-card-text>
              <b-form-row>
                <b-col class="mb-3">
                  <label>Şirket Adı</label>
                  <b-input-group>
                    <b-input v-model="branchDetail.name"></b-input>
                    <b-input-group-text>
                      <b-icon-signpost></b-icon-signpost>
                    </b-input-group-text>
                  </b-input-group>
                  <span class="text-danger" v-if="errors.name">{{ errors.name }}</span>
                </b-col>
                <b-col cols="12" class="mb-3">
                  <label>Telefon</label>
                  <b-input-group>
                    <b-input v-model="branchDetail.phone"></b-input>
                    <b-input-group-text>
                      <b-icon-phone></b-icon-phone>
                    </b-input-group-text>
                  </b-input-group>
                  <span class="text-danger" v-if="errors.phone">{{ errors.phone }}</span>
                </b-col>
                <b-col cols="12" class="mb-3">
                  <label>Adres</label>
                  <b-input-group>
                    <b-input v-model="branchDetail.address"></b-input>
                    <b-input-group-text>
                      <b-icon-signpost-split></b-icon-signpost-split>
                    </b-input-group-text>
                  </b-input-group>
                  <span class="text-danger" v-if="errors.address">{{ errors.address }}</span>
                </b-col>
                <b-col cols="12" class="mb-3">
                  <label>Vergi Numarası</label>
                  <b-input-group>
                    <b-input v-model="branchDetail.taxNumber"></b-input>
                    <b-input-group-text>
                      <b-icon-sort-numeric-down></b-icon-sort-numeric-down>
                    </b-input-group-text>
                  </b-input-group>
                  <span class="text-danger" v-if="errors.taxNumber">{{ errors.taxNumber }}</span>
                </b-col>
                <b-col cols="12">
                  <label>Vergi Dairesi</label>
                  <b-input-group>
                    <b-input v-model="branchDetail.taxOffice"></b-input>
                    <b-input-group-text>
                      <b-icon-house-door></b-icon-house-door>
                    </b-input-group-text>
                  </b-input-group>
                  <span class="text-danger" v-if="errors.taxOffice">{{ errors.taxOffice }}</span>
                </b-col>
              </b-form-row>
            </b-card-text>
          </b-tab>
          <b-tab title="Yazıcı Ayarları">
            <b-card-text>
              <b-col cols="12" class="mb-3">
                <label>Yazıcı Ip</label>
                <b-input-group>
                  <b-input v-model="branchDetail.pumpPrinterIP"></b-input>
                  <b-input-group-text>
                    <b-icon-printer></b-icon-printer>
                  </b-input-group-text>
                </b-input-group>
                <span class="text-danger" v-if="errors.pumpPrinterIP">{{ errors.pumpPrinterIP }}</span>
              </b-col>
              <b-col cols="6" class="mb-3">
                <label>Yazıcı Vid/Pid Değeri</label>
                <b-row>
                  <b-col>
                    <b-input-group>
                      <b-input v-model="branchDetail.pumpPrinterVid"></b-input>
                      <b-input-group-text>
                        <b-icon-gear-wide-connected></b-icon-gear-wide-connected>
                      </b-input-group-text>
                    </b-input-group>
                    <span class="text-danger" v-if="errors.pumpPrinterVid">{{ errors.pumpPrinterVid }}</span>
                  </b-col>
                  <b-col>
                    <b-input-group cols="6">
                      <b-input v-model="branchDetail.pumpPrinterPid"></b-input>
                      <b-input-group-text>
                        <b-icon-key></b-icon-key>
                      </b-input-group-text>
                    </b-input-group>
                    <span class="text-danger" v-if="errors.pumpPrinterPid">{{ errors.pumpPrinterPid }}</span>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label>Kopya Sayısı<br><small>Sadece satıştan sonraki otomatik yazdırma işlemi için</small></label>
                <b-input-group>
                  <b-input type="number" min="0" max="10" step="1" v-model="branchDetail.pumpPrinterCopy"></b-input>
                  <b-input-group-text>
                    <b-icon-back></b-icon-back>
                  </b-input-group-text>
                </b-input-group>
                <span class="text-danger" v-if="errors.pumpPrinterCopy">{{ errors.pumpPrinterCopy }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label>Fiş Yasal Metin</label>
                <b-input-group>
                  <b-form-textarea
                      v-model="branchDetail.receiptAgreement"
                      no-resize
                      rows="3"
                  ></b-form-textarea>
                  <b-input-group-text>
                    <b-icon-chat-right-text></b-icon-chat-right-text>
                  </b-input-group-text>
                </b-input-group>
                <span class="text-danger" v-if="errors.receiptAgreement">{{ errors.receiptAgreement }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <b-form-checkbox switch v-model ="branchDetail.pumpPrinterBeep" :checked="branchDetail.pumpPrinterBeep">{{ branchDetail.pumpPrinterBeep ? 'Yazdırınca sesli uyarı olsun' : 'Yazdırınca sesli uyarı olmasın' }}</b-form-checkbox>
                <span class="text-danger" v-if="errors.pumpPrinterBeep">{{ errors.pumpPrinterBeep }}</span>
              </b-col>
            </b-card-text>
          </b-tab>
        </b-tabs>
        <hr>
        <b-button variant="outline-primary mx-5 mb-3" @click="save" :disabled="success || loading">
          <span v-if="!success && _.isEmpty(errors)"><b-icon-check2></b-icon-check2> Kaydet</span>
          <span v-if="!success && !_.isEmpty(errors)"><b-icon-pencil-square></b-icon-pencil-square> Yeniden Dene</span>
          <span v-if="success && _.isEmpty(errors)"><b-icon-pencil-square></b-icon-pencil-square> Başarılı</span>
        </b-button>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from 'vuex'
import genericMethods from '../../mixins/genericMethods'
import { ipcRenderer, remote } from 'electron'
import _ from 'lodash'

export default {
  mixins: [genericMethods],
  data () {
    return {
      branchDetail: {},
      success: false,
      errors: {},
      loading: true,
    }
  },
  computed: {
    ...mapGetters(['getSession']),
    _ () {
      return _
    }
  },
  mounted: function () {
    this.window = remote.getCurrentWindow()
    this.getBranchDetail()
  },
  methods: {
    getBranchDetail () {
      let result = ipcRenderer.sendSync('/getBranchDetail', { id: this.getSession.userDetails.branchId })
      this.loading = false
      this.branchDetail = result.result
    },
    save () {
      this.loading = true
      this.errors = {}
      ipcRenderer.send('/settings/branch/password', this.branch)
      new Promise(function (resolve) {
        ipcRenderer.on('passwordChange', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        console.log(response)
        this.loading = false
        if (!_.isEmpty(response.errors)) {
          this.errors = response.errors
          return false
        }
        if (response.status) {
          this.success = true
          this.$bvToast.toast('Şifreniz başarıyla değiştirildi. Oturumunuz 4 saniye içerisinde sonlandırılacaktır.', {
            title: 'Uyarı',
            autoHideDelay: 4000,
            toaster: 'b-toaster-top-center',
            variant: 'warning',
            solid: true,
            toastClass: 'mt-6',
            noCloseButton: true,
            appendToast: true
          })
          setTimeout(() => {
            this.destroySession()
            this.window.close()
          }, 3000)
        } else {
          alert('Bir hata meydana geldi. Lütfen yönetici ile irtibata geçin.')
        }
      })
    }
  }
}
</script>
