<template>
  <b-row class="py-5">
    <b-col cols="12" class="mt-3"></b-col>
    <b-col cols="12" class="mb-3">
      <b-row class="pt-3 pb-2">
        <b-col class="align-self-center">
          <h6 class="text-transparent mb-0">Müşteriler \ Segment Listesi</h6>
        </b-col>
      </b-row>
      <h6 class="text-transparent mb-0"></h6>
    </b-col>
    <b-col cols="12" class="mb-3">
      <b-card>
        <b-row>
          <b-col md="3">
            <b-input-group>
              <b-input
                  v-model="quickSearch"
                  placeholder="Hızlı Arama"></b-input>
              <b-input-group-text>
                <b-icon-search></b-icon-search>
              </b-input-group-text>
            </b-input-group>
          </b-col>
          <b-col md="9">
            <b-button class="float-right m-1" variant="outline-success" @click="newSegment">
              <b-icon-cart-plus></b-icon-cart-plus>
              Yeni Segment Oluştur
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card>
        <b-table-simple hover bordered striped small responsive="true" v-if="!_.isEmpty(segmentList)">
          <b-thead>
            <b-tr>
              <b-th>#</b-th>
              <b-th>Segment Adı</b-th>
              <b-th>Müşteri Sayısı</b-th>
              <b-th>Toplam Bakiyesi</b-th>
              <b-th></b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(segment,i) in segmentList" :key="i">
              <b-th>{{ i + 1 }}</b-th>
              <b-td style="text-transform: capitalize"><span
                  v-if="segment.salePrice <=0 || segment.salePrice>segment.forwardSalePrice"><b-icon-exclamation-circle-fill
                  class="text-danger"></b-icon-exclamation-circle-fill></span> {{ segment.name }}
              </b-td>
              <b-td>0</b-td>
              <b-td>0,00</b-td>
              <b-td class="text-center">
                <span v-b-tooltip.leftbottom title="Düzenle"><b-icon-pencil-square class="mx-1" variant="primary"  @click="getSegment(i)"></b-icon-pencil-square></span>
                <span v-b-tooltip.topright title="Sil"><b-icon-x-circle class="mx-1" variant="danger" @click="deleteSegment(i)"></b-icon-x-circle></span>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <div v-else>
          <div class="text-primary"></div>
          <b-skeleton-table
              :rows="10"
              :columns="5"
              :table-props="{ bordered: true, striped: true }"
          ></b-skeleton-table>
        </div>
      </b-card>
    </b-col>
    <b-modal
        id="segment-add-or-edit"
        centered
    >
      <template #modal-header="{ close }">
        <h5>{{ segmentInformation.id ? 'Segment Düzenle' : 'Yeni Segment Oluştur' }}</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="mt-3">
            <label>Segment Adı<span class="text-danger">*</span></label>
            <b-input-group>
              <b-input class="text-capitalize" v-model="segmentInformation.name" ref="name"
              ></b-input>
              <b-input-group-text>
                <b-icon-type></b-icon-type>
              </b-input-group-text>
            </b-input-group>
            <span class="text-danger" v-if="exception.name">{{ exception.name }}</span>
          </b-col>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Kapat
        </b-button>
        <b-button variant="primary" @click="saveSegment()"
                  :class="{'disabled': !segmentInformation.name || waitingResponse || success}"
                  :disabled="!segmentInformation.name || waitingResponse || success">
          <span v-if="!waitingResponse && !Object.keys(exception).length && !success"><b-icon-check2></b-icon-check2> Kaydet</span>
          <span v-if="!waitingResponse && Object.keys(exception).length"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
          <b-col v-if="waitingResponse">
            <b-spinner></b-spinner>
            Kaydediliyor
          </b-col>
          <span v-if="success">Başarılı</span>
        </b-button>
      </template>
    </b-modal>
    <b-modal
        id="segment-delete"
        centered
    >
      <template #modal-header="{ close }">
        <h5>{{ segmentInformation.id ? 'Silme Onayı' : 'Segment Bilgisi Alınamadı! Tekrar Deneyiniz' }}</h5>
        <b-button type="button" class="close" @click="close()">×</b-button>
      </template>
      <template>
        <div>
          <b-col class="mt-3 text-center">
            <b-icon-trash-fill style="width: 120px; height: 120px; color:red"></b-icon-trash-fill>
            <h4><b class="text-capitalize">'{{ this.segmentInformation.name }}'</b> segmentini silmek istediğinizden emin misiniz?</h4>
          </b-col>
          <b-col class="mt-3">
            <b-form-checkbox v-model="segmentInformation.deleteValidate" switch size="lg">Silmek istediğimden eminim.
            </b-form-checkbox>
            <span class="text-danger"
                  v-if="exception.deleteValidate">{{ exception.deleteValidate }}</span>
          </b-col>
        </div>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()">
          <b-icon-x></b-icon-x>
          Vazgeç
        </b-button>
        <b-button variant="primary" @click="deleteSave()"
                  :class="{'disabled': !segmentInformation.deleteValidate || waitingResponse || success}"
                  :disabled="!segmentInformation.deleteValidate || waitingResponse || success">
          <span v-if="!waitingResponse && !Object.keys(exception).length && !success"><b-icon-check2></b-icon-check2> Segmenti Sil</span>
          <span v-if="!waitingResponse && Object.keys(exception).length"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
          <b-col v-if="waitingResponse">
            <b-spinner></b-spinner>
            Siliniyor
          </b-col>
          <span v-if="success">Silindi</span>
        </b-button>
      </template>
    </b-modal>
  </b-row>
</template>
<style>
tr {
  cursor: pointer;
}
</style>
<script>
import { ipcRenderer } from 'electron'
import genericMethods from '../../mixins/genericMethods'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data () {
    return {
      segmentList: {},
      quickSearch: '',
      segmentInformation: {},
      fetchingSegment: false,
      exception: {},
      waitingResponse: false,
      success: false
    }
  },
  computed: {
    ...mapGetters(['getSession']),
    _ () {
      return _
    }
  },
  mounted () {
    this.getSegments()
  },
  methods: {
    getSegments () {
      ipcRenderer.send('/segmentList')
      new Promise(function (resolve) {
        ipcRenderer.on('segmentList', (e, result) => {
          resolve(result)
        })
      }).then(result => {
        this.segmentList = result
      })
    },
    newSegment () {
      this.segmentInformation = {}
      this.$bvModal.show('segment-add-or-edit')
    },
    getSegment (index) {
      this.segmentInformation = {
        index: index,
        id: this.segmentList[index].id,
        name: this.segmentList[index].name
      }
      this.$bvModal.show('segment-add-or-edit')
      this.success = false
    },
    deleteSegment (index) {
      this.segmentInformation = {
        index: index,
        id: this.segmentList[index].id,
        name: this.segmentList[index].name,
        deleteValidate: !!this.segmentList[index].deleteValidate
      }
      this.$bvModal.show('segment-delete')
      this.success = false
    },
    saveSegment () {
      const index = this.segmentInformation.index
      this.waitingResponse = true
      this.segmentInformation.creatorId = this.getSession.userDetails.id
      this.segmentInformation.branchId = this.getSession.userDetails.branchId
      const result = ipcRenderer.sendSync('/newSegment', this.segmentInformation)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        if (!this.segmentInformation.id) {
          this.segmentList.push({
            id: result.id,
            name: this.segmentInformation.name
          })
        } else {
          this.segmentList[index] = this.segmentInformation
        }
        this.exception = {}
        this.success = true
        this.waitingResponse = false
        this.$bvModal.hide('segment-add-or-edit')
        this.segmentInformation = {}
      }
    },
    deleteSave () {
      const index = this.segmentInformation.index
      this.waitingResponse = true
      this.segmentInformation.updaterId = this.getSession.userDetails.id
      this.segmentInformation.branchId = this.getSession.userDetails.branchId
      const result = ipcRenderer.sendSync('/deleteSegment', this.segmentInformation)
      if (!result.status) {
        this.exception = result.exception
        this.success = false
        this.waitingResponse = false
      } else {
        this.segmentList.splice(index, 1)
        this.exception = {}
        this.success = true
        this.waitingResponse = false
        this.$bvModal.hide('segment-delete')
        this.segmentInformation = {}
      }
    }
  },
  mixins: [genericMethods]
}
</script>
