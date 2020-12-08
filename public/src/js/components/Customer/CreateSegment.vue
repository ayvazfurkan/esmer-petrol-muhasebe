<template>
  <div class="row py-5">
    <div class="col-12 mt-3"></div>
    <div class="col-12 mb-3">
      <div class="row pb-3 pt-2">
        <div class="col align-self-center">
          <h6 class="text-transparent mb-0">Segmentler \ Yeni Segment Ekle</h6>
        </div>
      </div>
      <div class="card p-4">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Segment Adı</label>
            <div class="input-group" :class="invalidField(exception.name)">
              <input type="text"
                     class="form-control"
                     maxlength="50"
                     ref="name"
                     v-model="segmentInformation.name">
              <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="ri-group-2-line"></i>
                                </span>
              </div>
            </div>
            <span class="text-danger" v-if="exception.name">{{ exception.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 text-right">
      <button class="btn btn-sm btn-light" @click="reset">Sıfırla</button>
      <button class="btn btn-sm btn-primary" @click="save"
              :class="{'disabled': !segmentInformation.name || waitingResponse || success}"
              :disabled="!segmentInformation.name || waitingResponse || success">
        <span v-if="!waitingResponse && !Object.keys(exception).length && !success">Kaydet</span>
        <span v-if="!waitingResponse && Object.keys(exception).length">Yeniden Dene</span>
        <div v-if="waitingResponse">
          <div class="spinner-border"></div>
          i.
          Kaydediliyor
        </div>
        <span v-if="success">Başarılı</span>
      </button>
    </div>
  </div>
</template>
<script>
import genericMethods from '../../mixins/genericMethods'
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      exception: {},
      segmentInformation: {},
      waitingResponse: false,
      success: false
    }
  },
  mixins: [genericMethods],
  mounted () {
    this.segmentInformation.creatorId = this.getSession.userDetails.id
    this.segmentInformation.branchId = this.getSession.userDetails.branchId
    this.inputFocus()
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    save () {
      this.waitingResponse = true
      let result = ipcRenderer.sendSync('/newSegment', this.segmentInformation)

      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
        this.makeToast('danger', 'Hata!', 'Bir hata meydana geldi.')
      } else {
        this.exception = {}
        this.segmentInformation = {}
        this.success = true
        this.waitingResponse = false
        this.inputFocus()
        this.makeToast('success', 'Kaydedildi', 'Segment kaydedildi.')
        setTimeout(() => {
          this.success = false
        }, 2000)
      }
    },
    reset () {
      this.success = false
      this.waitingResponse = false
      this.exception = {}
      this.userInformation = {}
      this.userInformation.creatorId = this.getSession.userDetails.id
      this.userInformation.branchId = this.getSession.userDetails.branchId
    },
    inputFocus () {
      this.$refs.name.focus()
    }
  }
}
</script>
