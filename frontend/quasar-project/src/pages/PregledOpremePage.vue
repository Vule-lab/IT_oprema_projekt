<template>
  <div class="q-pa-md">
    <q-table title="IT Oprema" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td align="right">
          <q-btn label="Prijavi Kvar" color="negative" dense @click="openKvarDialog(props.row)" />
          <q-btn label="Obriši" color="red" dense class="q-ml-sm" @click="deleteOprema(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog za prijavu kvara -->
    <q-dialog v-model="isKvarDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Prijavi Kvar</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="kvar.oprema_id" label="ID Opreme" outlined readonly />
          <q-input v-model="kvar.datum_kvara" label="Datum Kvara" type="date" outlined required />
          <q-input v-model="kvar.kvar_opis" label="Opis Kvara" type="text" outlined required />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="negative" @click="closeKvarDialog" />
          <q-btn flat label="Prijavi" color="positive" @click="submitKvar" />
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
        { name: 'id', label: 'ID', field: row => row.id, sortable: true },
        { name: 'naziv', label: 'Naziv opreme', field: row => row.naziv, sortable: true },
        { name: 'serijski_broj', label: 'Serijski broj', field: row => row.serijski_broj },
        { name: 'god_proizvodnje', label: 'Godina proizvodnje', field: row => row.god_proizvodnje },
        { name: 'dobavljac', label: 'Dobavljač', field: row => row.dobavljac },
        { name: 'actions', label: 'Akcije', field: 'actions' }
      ],
      isKvarDialogOpen: false,
      kvar: {
        oprema_id: '',
        datum_kvara: '',
        kvar_opis: ''
      }
    }
  },
  methods: {
    async loadOprema () {
      try {
        const response = await axios.get('http://localhost:3001/api/oprema')
        this.rows = response.data
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka o opremi:', error)
      }
    },
    openKvarDialog (row) {
      this.kvar.oprema_id = row.id
      this.kvar.datum_kvara = ''
      this.kvar.kvar_opis = ''
      this.isKvarDialogOpen = true
    },
    closeKvarDialog () {
      this.isKvarDialogOpen = false
      this.kvar = { oprema_id: '', datum_kvara: '', kvar_opis: '' } // Resetiranje forme
    },
    async submitKvar () {
      if (!this.kvar.datum_kvara || !this.kvar.kvar_opis) {
        alert('Molimo ispunite sva polja.')
        return
      }
      try {
        await axios.post('http://localhost:3001/api/povijest', this.kvar)
        alert('Kvar uspješno prijavljen!')
        this.closeKvarDialog()
        this.loadOprema()
      } catch (error) {
        console.error('Greška pri prijavi kvara:', error)
        alert('Dogodila se greška prilikom prijave kvara.')
      }
    },
    async deleteOprema (id) {
      if (confirm('Jeste li sigurni da želite obrisati ovu opremu?')) {
        try {
          await axios.delete(`http://localhost:3001/api/oprema/${id}`)
          alert('Oprema uspješno obrisana!')
          this.loadOprema()
        } catch (error) {
          console.error('Greška pri brisanju opreme:', error)
          alert('Dogodila se greška prilikom brisanja')
        }
      }
    }
  },
  mounted () {
    this.loadOprema()
  }
}
</script>
