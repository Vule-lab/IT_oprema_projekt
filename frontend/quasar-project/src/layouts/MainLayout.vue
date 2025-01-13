<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Početna',
    caption: 'Početna stranica',
    icon: 'school',
    link: '/'
  },
  {
    title: 'Pregled opreme',
    caption: 'Pregled svih podataka o opremi',
    icon: 'inventory',
    link: '#/pregled_opreme/'
  },
  {
    title: 'Unos opreme',
    caption: 'Dodavanje nove opreme',
    icon: 'add_circle',
    link: '#/unos_opreme/'
  },
  {
    title: 'Povijest opreme',
    caption: 'Prikaz povijesti opreme',
    icon: 'build',
    link: '#/povijest_opreme/'
  },
  {
    title: 'Status opreme',
    caption: 'Pregled statusa opreme',
    icon: 'info',
    link: '#/status_opreme/'
  }
]
const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
