<template>
  <div class="row py-5">
    <div class="col-12 mt-3"></div>
    <div class="col-12 pb-3 pt-2">
      <h6 class="text-transparent mb-0">Kasa İşlemleri \ Kasa Tahsilatı</h6>
    </div>
    <div class="col-md-12">
      <div class="card p-4">
        <div class="row">
          <div class="col-12 mb-3">
            <h6>Kasa Tahsilatı</h6>
          </div>
          <div class="col-md-12 col-lg-12 mb-3">
            <label>Müşteri <span class="text-danger">*</span></label>
            <div class="input-group" :class="invalidField(exception.customerId)">
              <multiselect
                  v-model="inFlowForm.customerId"
                  placeholder=""
                  noOptions="Aramak için yazmaya başlayın"
                  noResult="Sonuç bulunamadı"
                  :options="customerList"
                  selectLabel="Seçmek için Enter"
                  deselectLabel="İptal için Enter"
                  selectedLabel="Seçildi"
                  track-by="id"
                  label="name"
                  :custom-label="multiselectSearcher"
                  :max="10"
                  @search-change="getCustomers">
              </multiselect>
            </div>
            <span class="text-danger" v-if="exception.customerId">{{ exception.customerId }}</span>
          </div>
          <div class="col-md-6 mb-3">
            <label>Tutar</label>
            <div class="input-group" :class="invalidField(exception.amount)">
              <input type="number"
                     step="1"
                     min="0"
                     class="form-control"
                     v-model="inFlowForm.amount"
                    />
            </div>
            <span class="text-danger" v-if="exception.amount">{{ exception.amount }}</span>
          </div>
          <div class="col-md-6 mb-3">
            <label>Para Birimi</label>
            <div class="input-group" :class="invalidField(exception.currencyId)">
              <multiselect
                  v-model="inFlowForm.currencyId"
                  placeholder=""
                  :options="currencies"
                  selectLabel="Seçmek için Enter"
                  deselectLabel="İptal için Enter"
                  noResult="Sonuç bulunamadı."
                  selectedLabel="Seçildi"
                  track-by="id"
                  label="name"
                  :disabled="true"
                  :custom-label="multiselectSearcher">
              </multiselect>
            </div>
            <span class="text-danger" v-if="exception.currencyId">{{ exception.currencyId }}</span>
          </div>
          <div class="col-12">
            <label>Açıklama</label>
            <div class="input-group" :class="invalidField(exception.description)">
              <textarea class="form-control" v-model="inFlowForm.description" rows="3"></textarea>
            </div>
            <span class="text-danger" v-if="exception.description">{{ exception.description }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 my-3 text-right">
      <button class="btn btn-sm btn-light" :disabled="waitingResponse" @click="reset">Sıfırla</button>
      <button class="btn btn-sm btn-primary" @click="save"
              :class="{'disabled': !inFlowForm.creatorId || !inFlowForm.currencyId || !inFlowForm.amount || waitingResponse || success}"
              :disabled="!inFlowForm.creatorId || !inFlowForm.currencyId || !inFlowForm.amount || waitingResponse || success">
        <span v-if="!waitingResponse && !Object.keys(exception).length && !success">Kaydet</span>
        <span v-if="!waitingResponse && Object.keys(exception).length">Yeniden Dene</span>
        <div v-if="waitingResponse">
          <div class="spinner-border"></div>
          Kaydediliyor
        </div>
        <span v-if="success">Başarılı</span>
      </button>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import formMethods from '../../mixins/genericMethods'
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
  components: { Multiselect },
  data () {
    return {
      inFlowForm: {
        currencyId: {
          id: 1,
          name: 'Türk Lirası'
        }
      },
      customerList: [],
      currencies: [],
      exception: {},
      waitingResponse: false,
      success: false
    }
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    this.inFlowForm.creatorId = this.getSession.userDetails.id
    this.inFlowForm.branchId = this.getSession.userDetails.branchId
  },
  methods: {
    save () {
      this.waitingResponse = true
      const result = ipcRenderer.sendSync('/cash/inFlow', this.inFlowForm)
      this.waitingResponse = false

      if (!result.status) {
        this.exception = result.exception
      } else {
        this.reset()
        this.success = true
        setTimeout(() => {
          this.success = false
        }, 3000)
      }
    },
    reset () {
      this.inFlowForm = {}
      this.exception = {}
      this.inputFocus()
    }
  },
  mixins: [formMethods]
}
</script>
