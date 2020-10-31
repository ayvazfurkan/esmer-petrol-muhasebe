import VueRouter from 'vue-router'
import Login from '../components/Login/Login.vue'
import DatabaseConnector from '../components/Database/Connector.vue'
import NewCustomer from '../components/Customer/CreateCustomer.vue'
import ListCustomer from '../components/Customer/ListCustomer.vue'
import ListSegment from '../components/Customer/ListSegment.vue'
import NewSegment from '../components/Customer/CreateSegment.vue'
import SummaryCustomer from '../components/Customer/SummaryCustomer.vue'
import DetailSegment from '../components/Customer/DetailSegment.vue'
import CashInFlow from '../components/Cash/InFlow.vue'
import CashOutFlow from '../components/Cash/OutFlow.vue'
import ListProduct from '../components/Product/ListProduct.vue'
import Salesofficer from '../components/Staff/Salesofficer.vue'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '',
      component: Login
    },
    {
      path: '/DatabaseConnector',
      component: DatabaseConnector
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/NewCustomer',
      component: NewCustomer
    },
    {
      path: '/EditCustomer/:id',
      component: NewCustomer
    },
    {
      path: '/ListCustomer',
      component: ListCustomer
    },
    {
      path: '/SummaryCustomer/:id',
      component: SummaryCustomer
    },
    {
      path: '/ListSegment',
      component: ListSegment
    },
    {
      path: '/NewSegment',
      component: NewSegment
    },
    {
      path: '/DetailSegment/:id',
      component: DetailSegment
    },
    {
      path: '/Cash/InFlow',
      component: CashInFlow
    },
    {
      path: '/Cash/OutFlow',
      component: CashOutFlow
    },
    {
      path: '/ListProduct',
      component: ListProduct
    },
    {
      path: '/Salesofficer',
      component: Salesofficer
    }
  ]
})

export default router
