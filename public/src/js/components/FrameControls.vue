<template>
  <b-container fluid="true" class="px-0 m-0 frame-menu pr-0 bg-white w-100">
    <b-row class="mx-0">
      <b-col md="2" class="align-self-center py-2">
        <img src="../../img/logo-blx.png" alt="logo" height="50"/>
      </b-col>
      <b-col offset-md="5" md="5" class="text-right align-self-center">
        <!--        <b-button size="lg" variant="light" class="rounded-circle text-primary">-->
        <!--          <b-icon-bell class="text-primary"></b-icon-bell>-->
        <!--        </b-button>-->
        <!--        <b-button size="lg" variant="light" class="rounded-circle text-primary">-->
        <!--          <b-icon-gear class="text-primary"></b-icon-gear>-->
        <!--        </b-button>-->
        <!--        <b-dropdown size="lg" variant="light" right toggle-class="text-decoration-none text-primary rounded-circle mr-5"-->
        <!--                    no-caret>-->
        <!--          <template v-slot:button-content>-->
        <!--            <b-icon-person class="text-primary"></b-icon-person>-->
        <!--          </template>-->
        <!--          <b-dropdown-item href="#">-->
        <!--            <b-icon-person></b-icon-person> {{ getSession.userDetails.name }}-->
        <!--          </b-dropdown-item>-->
        <!--          <b-dropdown-item href="#" @click="logout">-->
        <!--            <b-icon-box-arrow-left></b-icon-box-arrow-left>-->
        <!--            Güvenli Çıkış-->
        <!--          </b-dropdown-item>-->
        <!--        </b-dropdown>-->
        <span class="mr-5 no-drag pointer" v-b-popover.hover.left="'Güvenli Çıkış'" @click="logout">
          <b-icon-person-circle></b-icon-person-circle>
          {{ getSession.userDetails.username }}
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
<style>
    .frame-menu {
        position: fixed;
        -webkit-app-region: drag;
        top: 0;
        right: 0;
        z-index: 999999999999999;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .frame-control {
        -webkit-app-region: no-drag;
        padding-top: .3rem;
        font-size: 1.25rem;
        cursor: pointer;
    }

    .frame-control:hover {
        color: rgba(0, 0, 0, .75)
    }

    .frame-control.exit:hover {
        color: red;
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
</style>
<script type="application/javascript">
    import {mapActions, mapGetters} from "vuex";
    import genericMethods from "../mixins/genericMethods";
    import Multiselect from "vue-multiselect"
    import {ipcRenderer} from "electron";

    export default {
        data() {
            return {
                currentWindow: "",
                fullScreen: false,
                quickSearch: [],
                searchResults: [],
            }
        },
        components: {Multiselect},
        mounted: function () {
            const {remote} = require('electron');
            this.currentWindow = remote.getCurrentWindow();
        },
        computed: {
            ...mapGetters(["getSession"])
        },
        methods: {
            ...mapActions(["destroySession"]),
            minimize() {
                this.currentWindow.minimize();
            },
            maximize() {
                if (this.currentWindow.isMaximized()) {
                    this.currentWindow.unmaximize();
                    this.fullScreen = false;
                } else {
                    this.currentWindow.maximize();
                    this.fullScreen = true;
                }
            },
            isMaximized() {
                return this.currentWindow.isMaximized();
            },
            close() {
                this.currentWindow.close();
            },
            logout() {
                this.destroySession();
                this.close();
            },
            search(name) {
                ipcRenderer.removeAllListeners("searchResults")
                this.searchResults = []
                if (name.length < 3) {
                    return false
                }
                ipcRenderer.send("/quickSearch", {name})
                new Promise(function (resolve) {
                    ipcRenderer.on('searchResults', (event, result) => {
                        resolve(result);
                    })
                }).then(result => {
                        this.searchResults = []
                        for (let item of result) {
                            this.searchResults.push({
                                id: item.id,
                                name: item.name + (item.surname && " " + item.surname || "")
                            })
                        }
                    }
                )
            },
            redirect() {
                this.$router.push("/DetailCustomer/" + this.quickSearch.id)
                this.quickSearch = []
            }
        },
        mixins: [genericMethods],
    }
</script>