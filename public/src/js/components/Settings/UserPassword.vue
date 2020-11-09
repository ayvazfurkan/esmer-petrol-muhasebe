<template>
  <b-row class="py-5 mt-5">
    <b-col cols="12" class="mt-5"></b-col>
    <b-col offset="4" cols="4" class="mb-3">
      <h6 class="text-transparent py-2">Şifre Değiştirme</h6>
      <b-card>
          <b-form-row>
            <b-col cols="12" class="mb-3">
                <label>Mevcut Şifre</label>
              <b-input-group>
                <b-input :type="show.currentPassword ? 'text' : 'password'" v-model="user.currentPassword"></b-input>
                <b-input-group-text>
                  <b-icon-eye-slash v-if="!show.currentPassword" @click="show.currentPassword = !show.currentPassword"></b-icon-eye-slash>
                  <b-icon-eye v-if="show.currentPassword" @click="show.currentPassword = !show.currentPassword"></b-icon-eye>
                </b-input-group-text>
                <b-input-group-text>
                  <b-icon-key></b-icon-key>
                </b-input-group-text>
              </b-input-group>
              <span class="text-danger" v-if="errors.currentPassword">{{ errors.currentPassword }}</span>
            </b-col>
            <b-col cols="12" class="mb-3">
              <label>Yeni Şifre</label>
              <b-input-group>
                <b-input :type="show.newPassword ? 'text' : 'password'" v-model="user.newPassword"></b-input>
                <b-input-group-text>
                  <b-icon-eye-slash v-if="!show.newPassword" @click="show.newPassword = !show.newPassword"></b-icon-eye-slash>
                  <b-icon-eye v-if="show.newPassword" @click="show.newPassword = !show.newPassword"></b-icon-eye>
                </b-input-group-text>
                <b-input-group-text>
                  <b-icon-lock></b-icon-lock>
                </b-input-group-text>
              </b-input-group>
              <span class="text-danger" v-if="errors.newPassword">{{ errors.newPassword }}</span>
            </b-col>
            <b-col cols="12" class="mb-3">
              <label>Yeni Şifre (Tekrar)</label>
              <b-input-group>
                <b-input :type="show.newPassword ? 'text' : 'password'" v-model="user.newPasswordCheck"></b-input>
                <b-input-group-text>
                  <b-icon-lock-fill></b-icon-lock-fill>
                </b-input-group-text>
              </b-input-group>
              <span class="text-danger" v-if="errors.newPasswordCheck">{{ errors.newPasswordCheck }}</span>
            </b-col>
            <b-col cols="12" class="mt-3" v-if="errors.general">
              <b-alert variant="danger" show>
                <b-icon-exclamation-circle></b-icon-exclamation-circle> {{ errors.general }}
              </b-alert>
            </b-col>
            <b-col cols="12">
              <b-button variant="outline-primary" block @click="save" :disabled="success || loading">
                <span v-if="!success && _.isEmpty(errors)"><b-icon-pencil-square></b-icon-pencil-square> Değiştir</span>
                <span v-if="!success && !_.isEmpty(errors)"><b-icon-pencil-square></b-icon-pencil-square> Yeniden Dene</span>
                <span v-if="success && _.isEmpty(errors)"><b-icon-pencil-square></b-icon-pencil-square> Başarılı</span>
              </b-button>
            </b-col>
          </b-form-row>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import genericMethods from '../../mixins/genericMethods'
import { ipcRenderer, remote } from 'electron'
import _ from 'lodash'

export default {
  mixins: [genericMethods],
  data () {
    return {
      window: false,
      user: {
        userId: '',
        currentPassword: '',
        newPassword: '',
        newPasswordCheck: ''
      },
      show: {
        currentPassword: false,
        newPassword: false,
        newPasswordCheck: false
      }
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
    this.user.userId = this.getSession.userDetails.id
  },
  methods: {
    ...mapActions(['destroySession']),
    save () {
      this.loading = true
      this.errors = {}
      ipcRenderer.send('/settings/user/password', this.user)
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
