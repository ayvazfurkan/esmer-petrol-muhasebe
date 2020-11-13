<template>
  <b-container fluid="true" class="px-0 m-0 frame-menu pr-0 bg-white w-100">
    <b-row class="mx-0">
      <b-col md="2" class="align-self-center py-2">
        <img src="../../img/logo-blx.png" alt="logo" height="50"/>
      </b-col>
      <b-col md="6" class="align-self-center">
        <multiselect
            v-model="quickSearch"
            class="no-drag"
            placeholder="Müşteri aramak için yazınız."
            selectLabel="Seçmek için Enter"
            deselectLabel="İptal için Enter"
            noResult="Sonuç bulunamadı."
            selectedLabel="Seçildi"
            track-by="id"
            label="name"
            :options="searchResults"
            @search-change="search"
            @input="redirect">
          <span slot="noOptions">Yazmaya devam edin.</span>
          <span slot="noResult">Sonuç bulunamadı.</span>
          <span slot="caret" slot-scope="{ toggle }" @mousedown.prevent.stop="toggle" class="position-absolute caret"><b-icon-search></b-icon-search></span>
        </multiselect>
      </b-col>
      <b-col md="4" class="text-right align-self-center">
        <span class="mr-5 no-drag pointer" @click="logout">
          <b-icon-box-arrow-left></b-icon-box-arrow-left>
          Güvenli Çıkış
        </span>
        <b-button variant="light" class="rounded-circle no-drag" @click="minimize()">
          <b-icon-dash></b-icon-dash>
        </b-button>
        <b-button variant="light" class="rounded-circle no-drag" @click="maximize()">
          <b-icon-fullscreen v-if="!fullScreen"></b-icon-fullscreen>
          <b-icon-files v-else></b-icon-files>
        </b-button>
        <b-button variant="light" class="rounded-circle no-drag" @click="close()">
          <b-icon-x></b-icon-x>
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script type="application/javascript">
import { mapActions, mapGetters } from 'vuex'
import { ipcRenderer, remote } from 'electron'
import Multiselect from 'vue-multiselect'
import genericMethods from '../mixins/genericMethods'

export default {
  mixins: [genericMethods],
  data () {
    return {
      currentWindow: '',
      fullScreen: true,
      quickSearch: [],
      searchResults: []
    }
  },
  components: {
    Multiselect
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted: function () {
    this.currentWindow = remote.getCurrentWindow()
  },
  methods: {
    ...mapActions(['destroySession']),
    minimize () {
      this.currentWindow.minimize()
    },
    maximize () {
      if (this.currentWindow.isMaximized()) {
        this.currentWindow.unmaximize()
        this.fullScreen = false
      } else {
        this.currentWindow.maximize()
        this.fullScreen = true
      }
    },
    isMaximized () {
      return this.currentWindow.isMaximized()
    },
    close () {
      this.currentWindow.close()
    },
    logout () {
      this.destroySession()
      this.close()
    },
    search (name) {
      ipcRenderer.removeAllListeners('customerList')
      this.searchResults = []
      if (name.length < 3) {
        return false
      }
      ipcRenderer.send('/getCustomer', { name })
      new Promise(function (resolve) {
        ipcRenderer.on('customerList', (event, result) => {
          resolve(result)
        })
      }).then(result => {
        this.searchResults = []
        for (const item of result.result) {
          this.searchResults.push({
            id: item.id,
            name: item.name + ' - ' + item.authorizedPersonName
          })
        }
      }
      )
    },
    redirect () {
      this.$router.push('/SummaryCustomer/' + this.quickSearch.id)
      this.quickSearch = []
    }
  }
}
</script>
<style>
.frame-menu {
  position: fixed;
  -webkit-app-region: drag;
  top: 0;
  right: 0;
  z-index: 1040;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.app-name {
  letter-spacing: 4px;
  font-weight: 400;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.nav-buttons {
  font-size: 1rem;
  cursor: pointer;
}

.dropdown-menu {
  min-width: 18rem;
}

.dropdown-item-text, .dropdown-item {
  padding: 1rem 1.5rem
}

.btn {
  padding: 0.375rem 0.5rem;
}

.btn-lg, .btn-group-lg > .btn {
  padding: .5rem .7rem
}

.caret {
  right: 1rem;
  top: .5rem;
}

button i {
  font-weight: 500;
}
</style>
