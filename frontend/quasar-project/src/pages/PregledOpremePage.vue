<template>
  <div class="q-pa-md">
    <q-table
      title="IT Oprema"
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
      // Kolone koje odgovaraju strukturi tvoje baze
      columns: [
        { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'naziv', align: 'left', label: 'Naziv opreme', field: 'naziv', sortable: true },
        { name: 'serijski_broj', align: 'left', label: 'Serijski broj', field: 'serijski_broj', sortable: true },
        { name: 'god_proizvodnje', align: 'center', label: 'Godina proizvodnje', field: 'god_proizvodnje', sortable: true },
        { name: 'dobavljac', align: 'left', label: 'Dobavljač', field: 'dobavljac' }
      ],
      // Početni redovi s primjerima podataka
      rows: [
        {
          id: 1,
          naziv: 'Laptop',
          serijski_broj: 'LAP12345',
          god_proizvodnje: '2020',
          dobavljac: 'Dell'
        },
        {
          id: 2,
          naziv: 'Monitor',
          serijski_broj: 'MON67890',
          god_proizvodnje: '2022',
          dobavljac: 'LG'
        }
      ]
    }
  },
  methods: {
    async loadOprema () {
      // Asinkroni poziv API-ja za dohvaćanje podataka iz baze
      await axios
        .get('http://localhost:3001/api/oprema') // Prilagodi URL prema svom backendu
        .then((result) => {
          console.log('Podaci dohvaćeni s API-ja:', result.data)
          this.rows = result.data // Popunjavanje redova dohvaćenim podacima
        })
        .catch((error) => {
          console.error('Greška prilikom dohvaćanja podataka:', error) // Ispis greške
        })
    }
  },
  mounted () {
    this.loadOprema() // Pozivanje metode za dohvaćanje podataka prilikom učitavanja stranice
  }
}
</script>
