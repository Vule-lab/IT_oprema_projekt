<template>
  <div class="q-pa-md">
    <!-- Gumbi za filtriranje -->
    <div class="q-mb-md">
      <q-btn
        label="Prikaži servisiranu opremu"
        color="primary"
        @click="loadStatus('servisirana')"
      />
      <q-btn
        label="Prikaži opremu s kvarovima"
        color="negative"
        flat
        class="q-ml-sm"
        @click="loadStatus('kvar')"
      />
    </div>

    <!-- Tablica za prikaz statusa -->
    <q-table
      title="Status opreme"
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
      // Kolone koje odgovaraju strukturi baze
      columns: [
        { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'oprema_id', align: 'left', label: 'ID Opreme', field: 'oprema_id', sortable: true },
        { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
        { name: 'datum', align: 'left', label: 'Datum', field: 'datum', sortable: true },
        { name: 'opis', align: 'left', label: 'Opis', field: 'opis' }
      ],
      rows: [] // Početni redovi, prazni dok ne učitamo podatke
    }
  },
  methods: {
    async loadStatus (status) {
      try {
        // API poziv s filterom statusa
        const response = await axios.get(`http://localhost:3001/api/status_opreme?status=${status}`)
        this.rows = response.data // Ažuriranje podataka u tablici
      } catch (error) {
        console.error('Greška prilikom dohvaćanja podataka za status opreme:', error)
      }
    }
  },
  mounted () {
    // Početni prikaz je "servisirana oprema"
    this.loadStatus('servisirana')
  }
}
</script>
