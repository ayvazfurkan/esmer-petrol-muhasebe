<template>
    <div class="container-fluid">
        <div class="row">
            <div class="offset-md-2 col-md-8 offset-lg-4 col-lg-4 px-0">
                <login-form></login-form>
            </div>
            <div class="offset-md-2 col-md-8 offset-lg-4 col-lg-4 mt-2" hidden>
                <div class="row">
                    <div class="col">
                        <small class="text-transparent font-weight-bold">BLX.PETROL 2020</small>
                    </div>
                    <div class="col text-right">
                        <small class="text-transparent font-weight-bold">Her Hakkı Saklıdır.</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import LoginForm from "./LoginForm.vue";
    import {ipcRenderer, remote} from "electron"

    export default {
        components: {
            LoginForm
        },
        mounted() {
            this.dbChecker()
        },
        methods: {
            dbChecker() {
                let checkConnection = ipcRenderer.sendSync("/databaseChecker")
                if (checkConnection.status === false) {
                    this.$router.push("/DatabaseConnector")
                    remote.getCurrentWindow().maximize()
                    remote.getCurrentWindow().setMinimumSize(1200, 600);
                } else {
                    return false
                }
            }
        }
    };
</script>