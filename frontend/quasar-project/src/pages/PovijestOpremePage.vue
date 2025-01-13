<template>
  <div class="q-pa-md">
    <q-table
      title="Povijest opreme"
      :rows="rows"
      :columns="columns"
      row-key="id"
    />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      rows: [], // Podaci iz backend-a
      columns: [
        { name: 'id', label: 'ID', field: 'id', sortable: true },
        { name: 'oprema_id', label: 'ID Opreme', field: 'oprema_id', sortable: true },
        { name: 'oprema_naziv', label: 'Naziv opreme', field: 'oprema_naziv', sortable: true },
        { name: 'datum_kvara', label: 'Datum kvara', field: 'datum_kvara', sortable: true },
        { name: 'kvar_opis', label: 'Opis kvara', field: 'kvar_opis' },
        { name: 'datum_servisa', label: 'Datum servisa', field: 'datum_servisa' },
        { name: 'servis_opis', label: 'Opis servisa', field: 'servis_opis' }
      ]
    }
  },
  methods: {
    async loadPovijest () {
      try {
        const response = await axios.get('http://localhost:3001/api/povijest')
        this.rows = response.data // Popunjavanje tablice podacima
      } catch (error) {
        console.error('Greška pri dohvaćanju povijesti opreme:', error)
      }
    }
  },
  mounted () {
    this.loadPovijest() // Dohvati podatke prilikom učitavanja stranice
  }
}
</script>
