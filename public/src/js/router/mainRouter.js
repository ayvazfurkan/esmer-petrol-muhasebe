import VueRouter from "vue-router"
import Login from "../components/Login/Login.vue"
import DatabaseConnector from "../components/Database/Connector.vue"
import NewAcceptance from "../components/HazelnutIncome/NewAcceptance.vue";
import RegionList from "../components/HazelnutIncome/RegionList.vue";
import NewCustomer from "../components/Customer/CreateCustomer.vue"
import ListCustomer from "../components/Customer/ListCustomer.vue"
import ListSegment from "../components/Customer/ListSegment.vue"
import NewSegment from "../components/Customer/CreateSegment.vue"
import DetailCustomer from "../components/Customer/DetailCustomer.vue"
import DetailSegment from "../components/Customer/DetailSegment.vue"
import CashInFlow from "../components/Cash/InFlow.vue"
import CashOutFlow from "../components/Cash/OutFlow.vue"
import WarehouseList from "../components/Stock/WarehouseList.vue"
import ProductList from "../components/Stock/ProductList.vue"
import NewProduct from "../components/Stock/CreateProduct.vue"


const router = new VueRouter({
    routes: [
        {path: "/", component: Login},
        {path: "", component: Login},
        {path: "/DatabaseConnector", component: DatabaseConnector},
        {path: "/Login", component: Login},
        {path: "/NewAcceptance", component: NewAcceptance},
        {path: "/NewCustomer", component: NewCustomer},
        {path: "/ListCustomer", component: ListCustomer},
        {path: "/DetailCustomer/:id", component: DetailCustomer},
        {path: "/ListSegment", component: ListSegment},
        {path: "/NewSegment", component: NewSegment},
        {path: "/DetailSegment/:id", component: DetailSegment},
        {path: "/Cash/InFlow", component: CashInFlow},
        {path: "/Cash/OutFlow", component: CashOutFlow},
        {path: "/Warehouse/List", component: WarehouseList},
        {path: "/Warehouse/ProductList", component: ProductList},
        {path: "/NewProduct", component: NewProduct},
        {path: "/Region/List", component: RegionList}
    ]
})

export default router