<template>
  <sidebar-menu :menu="menu" :collapsed="true" theme="white-theme" class="no-drag">
    <span slot="toggle-icon"><b-icon-command></b-icon-command></span>
    <span slot="dropdown-icon"><b-icon-arrow-right-short></b-icon-arrow-right-short></span>
  </sidebar-menu>
</template>
<script>
import { mapGetters } from 'vuex'
import { SidebarMenu } from 'vue-sidebar-menu'

export default {
  data () {
    return {
      menu: [
        {
          title: '',
          hiddenOnCollapse: true
        },
        {
          href: { path: '/Dashboard' },
          title: 'Gösterge Paneli',
          icon: {
            element: 'b-icon-house'
          }
        },
        {
          href: '',
          title: 'Müşteriler',
          icon: {
            element: 'b-icon-people'
          },
          child: [
            {
              href: { path: '/NewCustomer' },
              title: 'Yeni Müşteri Ekle',
              icon: {
                element: 'b-icon-person-plus'
              }
            },
            {
              href: { path: '/ListCustomer' },
              title: 'Müşteri Listesi',
              icon: {
                element: 'b-icon-person'
              }
            },
            {
              href: { path: '/ListSegment' },
              title: 'Segment Listesi',
              icon: {
                element: 'b-icon-person-badge'
              }
            }
          ]
        },
        {
          href: '',
          title: 'Personeller',
          icon: {
            element: 'b-icon-diagram3'
          },
          child: [
            {
              href: { path: '/Salesofficer' },
              title: 'Akaryakıt Satış Görevlileri',
              icon: {
                element: 'b-icon-person'
              }
            }
          ]
        },
        {
          href: '',
          title: 'Pompa Ürünleri',
          icon: {
            element: 'b-icon-droplet'
          },
          child: [
            {
              href: { path: '/ListProduct' },
              title: 'Ürün Listesi',
              icon: {
                element: 'b-icon-droplet-half'
              }
            }
          ]
        },
        {
          href: '',
          title: 'Ayarlar',
          icon: {
            element: 'b-icon-gear'
          },
          child: [
            {
              href: { path: '/Settings/BranchInfo' },
              title: 'Genel Ayarlar',
              icon: {
                element: 'b-icon-house'
              }
            },
            {
              href: { path: '/Settings/UserPassword' },
              title: 'Şifre Değiştir',
              icon: {
                element: 'b-icon-lock'
              }
            }
          ]
        }
      ]
    }
  },
  components: { SidebarMenu },
  computed: {
    ...mapGetters(['getSession'])
  }
}
</script>
<style>
.v-sidebar-menu * {
  outline: none;
}

.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background: none !important;
  font-size: 22px;
  height: 22px;
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
