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
          <b-col offset="3" cols="6" class="text-right">
            <b-button variant="outline-primary" @click="createModal">
              <b-icon-person-plus></b-icon-person-plus>
              Yeni Ekle
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12" class="mb-3">
      <b-card>
        <b-table-simple bordered striped v-if="!loading">
          <b-thead>
            <b-tr>
              <b-th>#</b-th>
              <b-th>Fotoğraf</b-th>
              <b-th>İsim</b-th>
              <b-th>Kullanıcı Adı</b-th>
              <b-th>Telefon</b-th>
              <b-th>Oluşturulma Tarihi</b-th>
              <b-th></b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(salesofficer, i) of salesofficers" :key="salesofficer.id">
              <b-td>{{ i + 1 }}</b-td>
              <b-td class="text-center">
                <b-avatar :src="salesofficer.img" height="32"></b-avatar>
              </b-td>
              <b-td>{{ salesofficer.name }}</b-td>
              <b-td>{{ salesofficer.username }}</b-td>
              <b-td>{{ salesofficer.phone }}</b-td>
              <b-td>{{ moment(salesofficer.insertDate).format('LL') }}</b-td>
              <b-td class="text-center">
                <span class="text-danger mx-1" @click="removeModal(i)" v-b-tooltip title="Sil">
                  <b-icon-x-circle></b-icon-x-circle>
                </span>
                <span class="text-primary mx-1" @click="detail(i)" v-b-tooltip title="Düzenle">
                  <b-icon-pencil-square></b-icon-pencil-square>
                </span>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <b-skeleton-table
            :rows="6"
            :columns="5"
            :table-props="{ bordered: true }"
            v-else
        ></b-skeleton-table>
        <b-alert variant="error" v-if="this.errors">
          <b-icon-exclamation-circle></b-icon-exclamation-circle>
          {{ this.errors.salesofficers }}
        </b-alert>
        <b-modal id="modal-detail" title="Personel Detayları" centered>
          <b-container fluid>
            <b-form-row>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Personel Adı <span class="text-danger">*</span></label>
                <b-skeleton width="20%" v-else></b-skeleton>
                <b-input-group v-if="!modalLoading">
                  <b-input class="text-capitalize" v-model="details.name"></b-input>
                  <b-input-group-text>
                    <b-icon-type></b-icon-type>
                  </b-input-group-text>
                </b-input-group>
                <b-skeleton type="input" v-else></b-skeleton>
                <span class="text-danger" v-if="errors.name">{{ errors.name }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Kullanıcı Adı <span class="text-danger">*</span></label>
                <b-skeleton width="20%" v-else></b-skeleton>
                <b-input-group v-if="!modalLoading">
                  <b-input v-model="details.username"></b-input>
                  <b-input-group-text>
                    <b-icon-person></b-icon-person>
                  </b-input-group-text>
                </b-input-group>
                <b-skeleton type="input" v-else></b-skeleton>
                <span class="text-danger" v-if="errors.username">{{ errors.username }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Telefon</label>
                <b-skeleton width="15%" v-else></b-skeleton>
                <b-input-group v-if="!modalLoading">
                  <b-input v-model="details.phone"></b-input>
                  <b-input-group-text>
                    <b-icon-phone></b-icon-phone>
                  </b-input-group-text>
                </b-input-group>
                <b-skeleton type="input" v-else></b-skeleton>
                <span class="text-danger" v-if="errors.phone">{{ errors.phone }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Fotoğraf <small class="text-muted">Değiştirmek için aygıt
                  seçiniz.</small></label>
                <b-skeleton width="15%" v-else></b-skeleton>
                <multiselect v-model="device"
                             placeholder="Aygıt Listesi"
                             label="name"
                             track-by="id"
                             :options="deviceList"
                             selectLabel="Seç"
                             deselectLabel=""
                             selectedLabel="Seçildi"
                             :searcable="false"></multiselect>
              </b-col>
              <b-col cols="12" :class="{'d-none': !device.id}">
                <web-cam height="300"
                         width="100%"
                         :resolution="{width:440,height:300}"
                         :device-id="device.id"
                         ref="webcam"
                         v-if="!modalLoading"></web-cam>
              </b-col>
              <b-col cols="12" class="text-right mb-3" v-if="device.id">
                <b-button variant="outline-primary" class="mt-1" size="sm" block :disabled="!device.id"
                          @click="captureUpdate()">
                  <b-icon-camera></b-icon-camera>
                  Çek
                </b-button>
              </b-col>
              <b-img :src="details.img" height="64" v-if="details.img && !modalLoading" class="ml-2"></b-img>
              <b-skeleton-img width="72px" height="64px" class="ml-2" v-if="modalLoading"></b-skeleton-img>
              <br v-if="details.img"/>
              <br v-if="details.img"/>
              <br v-if="errors.general"/>
              <span class="text-danger" v-if="errors.general">{{ errors.general }}</span>
            </b-form-row>
          </b-container>
          <template #modal-footer="{ cancel }">
            <b-button variant="outline-danger" v-if="!modalLoading" @click="cancel()">
              <b-icon-x></b-icon-x>
              Kapat
            </b-button>
            <b-skeleton type="button" v-else width="20%"></b-skeleton>
            <b-button variant="outline-primary" @click="update" v-if="!modalLoading"
                      :class="{'disabled': !details.name || modalLoading || success}"
                      :disabled="!details.name || modalLoading || success">
              <span v-if="!modalLoading && _.isEmpty(errors) && !success"><b-icon-pencil></b-icon-pencil> Düzenle</span>
              <span v-if="!modalLoading && !_.isEmpty(errors)"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
              <b-col v-if="modalLoading">
                <b-spinner></b-spinner>
                Kaydediliyor
              </b-col>
              <span v-if="success">Başarılı</span>
            </b-button>
            <b-skeleton type="button" width="20%" v-else></b-skeleton>
          </template>
        </b-modal>
        <b-modal id="modal-create" title="Yeni Personel Ekle" centered>
          <b-container fluid>
            <b-form-row>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Personel Adı <span class="text-danger">*</span></label>
                <b-skeleton width="20%" v-else></b-skeleton>
                <b-input-group v-if="!modalLoading">
                  <b-input class="text-capitalize" v-model="newOfficer.name"></b-input>
                  <b-input-group-text>
                    <b-icon-type></b-icon-type>
                  </b-input-group-text>
                </b-input-group>
                <b-skeleton type="input" v-else></b-skeleton>
                <span class="text-danger" v-if="errors.name">{{ errors.name }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Kullanıcı Adı <span class="text-danger">*</span></label>
                <b-skeleton width="25%" v-else></b-skeleton>
                <b-input-group v-if="!modalLoading">
                  <b-input v-model="newOfficer.username"></b-input>
                  <b-input-group-text>
                    <b-icon-person></b-icon-person>
                  </b-input-group-text>
                </b-input-group>
                <b-skeleton type="input" v-else></b-skeleton>
                <span class="text-danger" v-if="errors.username">{{ errors.username }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Telefon</label>
                <b-skeleton width="15%" v-else></b-skeleton>
                <b-input-group v-if="!modalLoading">
                  <b-input v-model="newOfficer.phone"></b-input>
                  <b-input-group-text>
                    <b-icon-phone></b-icon-phone>
                  </b-input-group-text>
                </b-input-group>
                <b-skeleton type="input" v-else></b-skeleton>
                <span class="text-danger" v-if="errors.phone">{{ errors.phone }}</span>
              </b-col>
              <b-col cols="12" class="mb-3">
                <label v-if="!modalLoading">Fotoğraf <small class="text-muted">Eklemek için aygıt
                  seçiniz.</small></label>
                <b-skeleton width="15%" v-else></b-skeleton>
                <multiselect v-model="device"
                             placeholder="Aygıt Listesi"
                             label="name"
                             track-by="id"
                             :options="deviceList"
                             selectLabel="Seç"
                             deselectLabel=""
                             selectedLabel="Seçildi"
                             :searcable="false"></multiselect>
              </b-col>
              <b-col cols="12" :class="{'d-none': !device.id}">
                <web-cam height="300"
                         width="100%"
                         :resolution="{width:440,height:300}"
                         :device-id="device.id"
                         ref="webcam"
                         v-if="!modalLoading"></web-cam>
              </b-col>
              <b-col cols="12" class="text-right mb-3" v-if="device.id">
                <b-button variant="outline-primary" class="mt-1" size="sm" block :disabled="!device.id"
                          @click="captureCreate()">
                  <b-icon-camera></b-icon-camera>
                  Çek
                </b-button>
              </b-col>
              <b-img :src="newOfficer.img" height="64" v-if="newOfficer.img" class="ml-2"></b-img>
              <br v-if="newOfficer.img"/>
              <br v-if="newOfficer.img"/>
              <br v-if="errors.general"/>
              <span class="text-danger" v-if="errors.general">{{ errors.general }}</span>
            </b-form-row>
          </b-container>
          <template #modal-footer="{ cancel }">
            <b-button variant="outline-danger" v-if="!modalLoading" @click="cancel()">
              <b-icon-x></b-icon-x>
              Kapat
            </b-button>
            <b-skeleton type="button" v-else width="20%"></b-skeleton>
            <b-button variant="outline-primary" @click="create" v-if="!modalLoading"
                      :class="{'disabled': (!newOfficer.name && !newOfficer.username && !newOfficer.phone) || modalLoading || success}"
                      :disabled="!newOfficer.name || modalLoading || success">
              <span v-if="!modalLoading && _.isEmpty(errors) && !success"><b-icon-plus></b-icon-plus> Ekle</span>
              <span v-if="!modalLoading && !_.isEmpty(errors)"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
              <b-col v-if="modalLoading">
                <b-spinner></b-spinner>
                Kaydediliyor
              </b-col>
              <span v-if="success">Başarılı</span>
            </b-button>
            <b-skeleton type="button" width="20%" v-else></b-skeleton>
          </template>
        </b-modal>
        <b-modal id="modal-remove" title="Personel Sil" centered>
          <b-container fluid>
            <b-row>
              <b-col cols="12">
                <div class="display-1 text-center">
                  <b-icon-person-x></b-icon-person-x>
                </div>
                {{ selectedOfficer.name }} adlı personel kalıcı olarak silinecektir. Onaylıyor musunuz?
                <br/>
                <b-form-checkbox switch size="lg" v-model="confirmation" class="mt-3"> Evet.</b-form-checkbox>
              </b-col>
            </b-row>
          </b-container>
          <template #modal-footer="{ cancel }">
            <b-button variant="outline-danger" v-if="!modalLoading" @click="cancel()">
              <b-icon-x></b-icon-x>
              Kapat
            </b-button>
            <b-skeleton type="button" v-else width="20%"></b-skeleton>
            <b-button variant="outline-primary" @click="remove" v-if="!modalLoading"
                      :class="{'disabled':!confirmation|| modalLoading || success}"
                      :disabled="modalLoading || success">
              <span v-if="!modalLoading && _.isEmpty(errors) && !success"><b-icon-trash></b-icon-trash> Sil</span>
              <span v-if="!modalLoading && !_.isEmpty(errors)"><b-icon-arrow-repeat></b-icon-arrow-repeat> Yeniden Dene</span>
              <b-col v-if="modalLoading">
                <b-spinner></b-spinner>
                Siliniyor
              </b-col>
              <span v-if="success">Başarılı</span>
            </b-button>
            <b-skeleton type="button" width="20%" v-else></b-skeleton>
          </template>
        </b-modal>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import genericMethods from '../../mixins/genericMethods'
import camera from '../../mixins/camera'
import { WebCam } from 'vue-web-cam'
import Multiselect from 'vue-multiselect'

export default {
  mixins: [genericMethods, camera],
  components: {
    WebCam,
    Multiselect
  },
  data () {
    return {
      salesofficers: [],
      soCache: [],
      newOfficer: { img: null },
      confirmation: false,
      selectedOfficer: {},
      details: {},
      modalLoading: false,
      quickSearch: ''
    }
  },
  watch: {
    quickSearch: function (param) {
      this.search(param)
    }
  },
  computed: {
    ...mapGetters(['getSession']),
    _ () {
      return _
    },
    moment () {
      return moment
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    get () {
      this.loading = true
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
        this.soCache = response
        setTimeout(() => {
          this.loading = false
        }, 750)
      })
    },
    detail (i) {
      this.modalLoading = true
      this.success = false
      this.details = {
        id: this.salesofficers[i].id,
        index: i,
        name: this.salesofficers[i].name,
        username: this.salesofficers[i].username,
        phone: this.salesofficers[i].phone,
        img: this.salesofficers[i].img
      }
      this.$bvModal.show('modal-detail')
      this.cameraList()
      setTimeout(() => {
        this.modalLoading = false
      }, 500)
    },
    update () {
      this.modalLoading = true
      this.errors = {}
      const form = {
        id: this.details.id,
        form: {
          name: this.details.name,
          username: this.details.username,
          phone: this.details.phone,
          img: this.details.img
        }
      }
      ipcRenderer.send('/salesofficer/update', form)
      new Promise(function (resolve) {
        ipcRenderer.on('salesofficerUpdate', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        this.modalLoading = false
        if (!_.isEmpty(response.errors)) {
          this.errors = response.errors
          return false
        }
        if (response.status) {
          this.success = true
          this.salesofficers[this.details.index] = {
            id: this.details.id,
            name: this.details.name,
            username: this.details.username,
            phone: this.details.phone,
            img: this.details.img
          }
          this.makeToast('success','Kaydedildi','Personel bilgileri kaydedildi!')
          setTimeout(() => {
            this.$bvModal.hide('modal-detail')
          }, 200)
        } else {
          this.makeToast('danger','Kritik hata!','Lütfen sistem yöneticisi ile irtibata geçin!')
        }
      })
    },
    createModal () {
      this.new = {}
      this.success = false
      this.cameraList()
      this.$bvModal.show('modal-create')
    },
    create () {
      this.modalLoading = true
      this.errors = {}
      this.newOfficer.branchId = this.getSession.userDetails.branchId
      ipcRenderer.send('/salesofficer/create', this.newOfficer)
      new Promise(function (resolve) {
        ipcRenderer.on('salesofficerCreate', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        this.modalLoading = false
        if (!_.isEmpty(response.errors)) {
          this.errors = response.errors
          return false
        }
        if (response.status) {
          this.success = true
          this.salesofficers.push({
            id: response.description,
            name: this.newOfficer.name,
            username: this.newOfficer.username,
            img: this.newOfficer.img,
            phone: this.newOfficer.phone
          })
          this.makeToast('success','Kaydedildi','Personel bilgileri kaydedildi!')

          this.newOfficer = { img: null }
          setTimeout(() => {
            this.$bvModal.hide('modal-create')
          }, 250)
        } else {
          this.makeToast('danger','Kritik hata!','Lütfen sistem yöneticisi ile irtibata geçin!')
        }
      })
    },
    removeModal (i) {
      this.confirmation = false
      this.selectedOfficer = this.salesofficers[i]
      this.selectedOfficer.index = i
      this.success = false
      this.$bvModal.show('modal-remove')
    },
    remove () {
      ipcRenderer.send('/salesofficer/remove', {
        id: this.selectedOfficer.id,
        isDeleted: '1'
      })
      new Promise(function (resolve) {
        ipcRenderer.on('salesofficerResult', (event, response) => {
          resolve(response)
        })
      }).then(response => {
        this.makeToast('success','Silindi!','Personel kalıcı olarak silindi!')
        this.salesofficers.splice(this.selectedOfficer.index, 1)
        this.$bvModal.hide('modal-remove')
      })
    },
    captureUpdate () {
      this.details.img = this.$refs.webcam.capture()
      this.details.imgChanged = true
    },
    captureCreate () {
      this.newOfficer.img = this.$refs.webcam.capture()
      this.newOfficer.imgChanged = true
    },
    search (param) {
      this.salesofficers = this.soCache
      this.salesofficers =
          _.filter(this.salesofficers, function (so) {
            return _.startsWith(so.name.toLowerCase(), param.toLowerCase())
          })
    }
  }
}
</script>
