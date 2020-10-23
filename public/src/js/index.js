import Vue from 'vue'
import Vuex, { mapActions, mapGetters } from 'vuex'
import VueRouter from 'vue-router'
import createPersistedState from 'vuex-persistedstate'
import router from './router/mainRouter'
import Session from './stores/Session'
import 'bootstrap'
import 'bootstrap/scss/bootstrap.scss'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'remixicon/fonts/remixicon.css'
import '../scss/checboxRadio.scss'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'typeface-inter'
import VueSidebarMenu from 'vue-sidebar-menu'
import '../scss/sidebarVariables.scss'
import 'vue-sidebar-menu/src/scss/vue-sidebar-menu.scss'
import FrameControls from './components/FrameControls.vue'
import Sidebar from './components/Sidebar.vue'
import VueCurrencyInput from 'vue-currency-input'
import VModal from 'vue-js-modal'
import moment from 'moment'

const currencyOptions = { globalOptions: { currency: 'TRY' } }

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueCurrencyInput, currencyOptions)
Vue.use(VueSidebarMenu)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VModal, { dialog: true })
Vue.prototype.moment = moment
moment.locale('tr')

const store = new Vuex.Store({
  modules: { Session },
  plugins: [createPersistedState()]
})

const components = {
  FrameControls,
  Sidebar
}
const app = new Vue({
  el: '#app',
  components,
  router,
  store,
  computed: {
    ...mapGetters(['getSession'])
  },
  mounted () {
    window.setInterval(function () {
      const sessionLockTimeout = window.setTimeout(this.deleteSession, 300000)
      window.addEventListener('click keypress mousemove', function () {
        window.clearTimeout(sessionLockTimeout)
      }, true)
    }, 300001)
  },
  methods: {
    ...mapActions(['deleteSession'])
  }
})

export default app
