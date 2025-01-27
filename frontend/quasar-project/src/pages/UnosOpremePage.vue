<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form class="q-gutter-md">
      <!-- Polje za naziv opreme -->
      <q-input
        filled
        v-model="naziv"
        label="Naziv opreme *"
        hint="Unesite naziv opreme"
      />
      <!-- Polje za serijski broj -->
      <q-input
        filled
        v-model="serijskiBroj"
        label="Serijski broj *"
        hint="Unesite serijski broj"
      />
      <!-- Polje za godinu proizvodnje -->
      <q-input
        filled
        v-model="godinaProizvodnje"
        label="Godina proizvodnje *"
        hint="Unesite godinu proizvodnje"
        type="number"
      />
      <!-- Polje za dobavljača -->
      <q-input
        filled
        v-model="dobavljac"
        label="Dobavljač *"
        hint="Unesite ime dobavljača"
      />
      <!-- Gumbi za potvrdu i resetiranje -->
      <div>
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          @click="onSubmit"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="secondary"
          flat
          class="q-ml-sm"
          @click="onReset()"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  setup () {
    // Reaktivne varijable za unos podataka
    const naziv = ref(null)
    const serijskiBroj = ref(null)
    const godinaProizvodnje = ref(null)
    const dobavljac = ref(null)

    return {
      naziv,
      serijskiBroj,
      godinaProizvodnje,
      dobavljac
    }
  },
  methods: {
    async onSubmit () {
      // Priprema podataka za slanje API-ju
      const formData = {
        naziv: this.naziv,
        serijski_broj: this.serijskiBroj,
        god_proizvodnje: this.godinaProizvodnje,
        dobavljac: this.dobavljac
      }
      // Poziv API-ja za unos podataka
      try {
        const result = await axios.post('http://localhost:3001/api/oprema', formData)
        console.log('Rezultat POST zahtjeva:', result)
        alert('Oprema uspješno dodana!')
      } catch (error) {
        console.error('Pogreška prilikom unosa opreme:', error)
        alert('Dogodila se pogreška. Pokušajte ponovno.')
      }
    }
  },
  onReset () {
    // Resetiranje svih polja
    this.naziv = null
    this.serijskiBroj = null
    this.godinaProizvodnje = null
    this.dobavljac = null
  }
}

</script>
