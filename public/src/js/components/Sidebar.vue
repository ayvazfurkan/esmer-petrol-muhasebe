<template>
    <sidebar-menu :menu="menu" :collapsed="true" theme="white-theme" class="no-drag">
        <span slot="toggle-icon"><i class="ri-apps-line"></i></span>
        <span slot="dropdown-icon"><i class="ri-arrow-right-s-line"></i></span>
    </sidebar-menu>
</template>
<style>
    .v-sidebar-menu * {
        outline: none;
    }

    .v-sidebar-menu .vsm--link_level-1 .vsm--icon {
        background: none !important;
        font-size: 1.6rem;
    }

    .v-sidebar-menu .vsm--link_level-1 .vsm--icon:hover {
        background: rgba(0, 123, 255, 0.1);
        color: #007bff;
    }

    .v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon:hover {
        background: rgba(0, 123, 255, 0.1);
        color: #007bff;
    }

    .v-sidebar-menu .vsm--link_exact-active, .v-sidebar-menu .vsm--link_active {
        font-weight: inherit;
    }

    .v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
        background: none;
    }

    .v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon:hover {
        background: rgba(0, 123, 255, 0.1);
        color: #007bff;
    }

    .v-sidebar-menu .vsm--link_exact-active, .v-sidebar-menu .vsm--link_active {
        font-weight: inherit;
    }

    .v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
        background: none;
    }

    .v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1,
    .v-sidebar-menu.vsm_white-theme.vsm_expanded .vsm--item_open .vsm--link_level-1 {
        color: #007bff;
        background: rgba(0, 123, 255, 0.1);
        outline: none;
    }

    .v-sidebar-menu.vsm_collapsed .vsm--item_open .vsm--link_level-1,
    .v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--item_open .vsm--link_level-1 {
        color: #007bff;
        background: rgba(0, 123, 255, 0.1);
        outline: none;
    }

    .v-sidebar-menu {
        padding-top: 4.5rem;
        background: rgba(255, 255, 255, 0.75) !important;
        box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);
        color: black;
        z-index: 1;
    }

    .v-sidebar-menu.vsm_expanded {
        backdrop-filter: blur(3px) saturate(150%) !important;
    }

    .v-sidebar-menu .vsm--link {
        font-size: 14px;
        color: black
    }

    .vsm_expanded .vsm--dropdown {
        padding-left: 2rem;
    }

    .v-sidebar-menu .vsm--dropdown > .vsm--list {
        background: rgba(255, 255, 255, 0.75);
    }

    .v-sidebar-menu.vsm_expanded .vsm--dropdown > .vsm--list {
        background: none;
    }

    .v-sidebar-menu .vsm--toggle-btn {
        outline: none;
    }

    .v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_exact-active .vsm--icon, .v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active .vsm--icon {
        color: #007bff;
    }

    .v-sidebar-menu.vsm_collapsed .vsm--dropdown {
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.5);
        backdrop-filter: blur(3px) saturate(150%);
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }

    .v-sidebar-menu.vsm_collapsed .vsm--dropdown .vsm--list {
        background: none;

    }

    .v-sidebar-menu.vsm_white-theme .vsm--mobile-bg {
        color: #007bff !important;
        box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.5);
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(3px) saturate(150%);
        border-top-right-radius: 6px;
    }

    .v-sidebar-menu.vsm_white-theme .vsm--link_mobile-item {
        color: #007bff !important;
    }

    .v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon, .v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
        color: #007bff !important;
    }


    .v-sidebar-menu .slide-animation-enter-active {
        -webkit-animation: slide-animation 0.1s;
        animation: slide-animation 0s
    }

</style>
<script>
    import {mapGetters} from "vuex"
    import {SidebarMenu} from "vue-sidebar-menu"

    export default {
        data() {
            return {
                menu: [
                    {
                        title: "",
                        hiddenOnCollapse: true
                    },
                    {
                        href: "",
                        title: "Müşteriler",
                        icon: "ri-user-3-line",
                        child: [
                            {
                                href: {path: "/NewCustomer"},
                                title: "Yeni Müşteri Ekle",
                                icon: "ri-user-add-line"
                            },
                            {
                                href: {path: "/ListCustomer"},
                                title: "Müşteri Listesi",
                                icon: "ri-group-line"
                            },
                            {
                                href: {path: "/ListSegment"},
                                title: "Müşteri Segmentleri",
                                icon: "ri-group-2-line"
                            },
                        ]
                    },
                    {
                        href: "",
                        title: "Fındık İşlemleri",
                        icon: "ri-leaf-line",
                        child: [
                            {
                                href: {path: "/NewAcceptance"},
                                title: "Kabuklu Fındık Alımı",
                                icon: "ri-luggage-cart-line"
                            },
                            {
                                href: {path: "/Region/List"},
                                title: "Ürün Bölgeleri",
                                icon: "ri-map-2-line"
                            }
                        ]
                    },
                    {
                        href: "",
                        title: "Kasa İşlemleri",
                        icon: "ri-safe-line",
                        child: [
                            {
                                href: {path: "/Cash/InFlow"},
                                title: "Tahsilat İşlemi",
                                icon: "ri-refund-line"
                            },
                            {
                                href: {path: "/Cash/OutFlow"},
                                title: "Tediye İşlemi",
                                icon: "ri-coupon-3-line"
                            },
                            // {
                            //     href: {path: "/Cashseni
                            //     /OutFlow"},
                            //     title: "Döviz Alış/Satış",
                            //     icon: "ri-exchange-dollar-line"
                            // }
                        ]
                    },
                    {
                        href: "",
                        title: "Stok",
                        icon: "ri-stack-line",
                        child: [
                            {
                                href: {path: "/Warehouse/List"},
                                title: "Depolar",
                                icon: "ri-home-6-line"
                            },
                            {
                                href: {path: "/Warehouse/ProductList"},
                                title: "Ürünler",
                                icon: "ri-home-6-line"
                            }
                        ]
                    },
                ]
            }
        },
        components: {SidebarMenu},
        computed: {
            ...mapGetters(["getSession"])
        }
    };
</script>