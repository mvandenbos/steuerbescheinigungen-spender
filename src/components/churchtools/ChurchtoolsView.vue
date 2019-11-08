<template>
  <v-card v-show="persons.length > 0" class="my-4">
    <v-card-title class="headline">
      {{title}}
      <v-spacer></v-spacer>
      <v-text-field 
        :append-icon="search?'close':'search'"
        @click:append="() => (search = '')"
        @keydown.native.esc="search=''"
        :label="$t('search')"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="persons"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-1"
      >
        <template slot="headerCell" slot-scope="props">
          <v-tooltip bottom>
            <span slot="activator">
              {{ props.header.text }}
            </span>
            <span>
              {{ props.header.text }}
            </span>
          </v-tooltip>
        </template>
        
        <template slot="items" slot-scope="props">
          <td>{{ props.item.optigem_nr }}</td>
          <td>{{ props.item.vorname }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.strasse }}</td>
          <td>{{ props.item.plz }}</td>
          <td>{{ props.item.ort }}</td>
          <td>{{ props.item.zusatz }}</td>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages" :total-visible="9" color="accent"></v-pagination>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ChurchtoolsView",
  props: {
    persons: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "Churchtools Personen"
    }
  },
  data: () => ({
    pagination: {
      rowsPerPage: 25
    },
    headers: [
      { text: "SpenderId", value: "optigem_nr" },
      { text: "Vorname", value: "vorname" }, 
      { text: "Name", value: "name" },
      { text: "Strasse", value: "strasse" },
      { text: "plz", value: "plz" },
      { text: "ort", value: "ort" },
      { text: "zusatz", value: "zusatz" }
    ],
    search: "",
   }),
   computed: {
    pages() {
      return this.pagination.rowsPerPage ? Math.ceil(this.persons.length / this.pagination.rowsPerPage) : 0;
    }
  },
}
</script>

<style scoped>
</style>