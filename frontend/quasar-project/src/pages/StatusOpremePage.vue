<template>
  <div class="q-pa-md">
    <div class="q-mb-md">
      <q-btn label="Prikaži servisiranu opremu" color="primary" @click="loadStatus('servisirana')" />
      <q-btn label="Prikaži opremu s kvarovima" color="negative" flat class="q-ml-sm" @click="loadStatus('kvar')" />
    </div>

    <q-table title="Status Opreme" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td align="right">
          <q-btn v-if="props.row.status === 'kvar'" label="Unos Servisa" color="primary" @click="openServisDialog(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog za unos servisa -->
    <q-dialog v-model="isServisDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Unos Servisa</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="servis.oprema_id" label="ID Opreme" outlined readonly />
          <q-input v-model="servis.datum_servisa" label="Datum Servisa" type="date" outlined required />
          <q-input v-model="servis.servis_opis" label="Opis Servisa" type="text" outlined required />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="negative" @click="isServisDialogOpen = false" />
          <q-btn flat label="Dodaj" color="positive" @click="submitServis" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      rows: [],
      columns: [
        { name: 'id', label: 'ID', field: 'id', sortable: true },
        { name: 'oprema_naziv', label: 'Naziv Opreme', field: 'oprema_naziv', sortable: true },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'datum', label: 'Datum', field: 'datum' },
        { name: 'opis', label: 'Opis', field: 'opis' },
        { name: 'actions', label: 'Akcije', field: 'actions' }
      ],
      isServisDialogOpen: false,
      servis: {
        oprema_id: '',
        datum_servisa: '',
        servis_opis: ''
      }
    }
  },
  methods: {
    async loadStatus (status) {
      try {
        const response = await axios.get(`http://localhost:3001/api/status_opreme?status=${status}`)
        this.rows = response.data
      } catch (error) {
        console.error('Greška pri dohvaćanju statusa opreme:', error)
        alert('Dogodila se greška pri dohvaćanju podataka.')
      }
    },
    openServisDialog (row) {
      this.servis.oprema_id = row.oprema_id
      this.servis.datum_servisa = ''
      this.servis.servis_opis = ''
      this.isServisDialogOpen = true
    },
    async submitServis () {
      try {
        // Formatiranje datuma u dd-mm-yyyy
        const [year, month, day] = this.servis.datum_servisa.split('-')
        this.servis.datum_servisa = `${day}-${month}-${year}`

        await axios.post('http://localhost:3001/api/servis', this.servis)
        alert('Servis uspješno dodan!')

        // Reset forme
        this.servis = { oprema_id: '', datum_servisa: '', servis_opis: '' }
        this.isServisDialogOpen = false

        // Osvježi podatke
        await this.loadStatus('kvar')
        await this.loadStatus('servisirana')
      } catch (error) {
        console.error('Greška pri unosu servisa:', error)
        alert('Dogodila se greška prilikom unosa servisa.')
      }
    }
  },
  mounted () {
    this.loadStatus('kvar')
  }
}
</script>
