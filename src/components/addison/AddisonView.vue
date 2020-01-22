<template>
  <v-card v-show="addisonData.length > 0" class="my-4">
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
        :items="addisonData"
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
          <td>{{ props.item["Belegnummer 2"]}}</td>
          <td>{{ props.item.Buchungstext }}</td>
          <td>{{ makeEuro(props.item.Betrag) }}</td>
          <td>{{ props.item.Datum }}</td>
          <td>{{ props.item.Konto }}</td>
          <td>{{ props.item.Gegenkonto }}</td>
          <td>{{ props.item["Kostenstelle 1"]}}</td>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages" :total-visible="9" color="accent"></v-pagination>
      </div>
    </v-card-text>
  </v-card>  
</template>

<script>
import currencyFormater from '../../utilities/currencyFormater'
export default {
  name: "AddisonView",
  props: {
    addisonData: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "Addison Data"
    }
  },
  data: () => ({
    pagination: {
      rowsPerPage: 25,
      sortBy: 'Buchungstext'
    },
    search: "",
    headers: [
      { text: "Spender ID", value: "Belegnummer 2"},
      { text: "Buchungstext", value: "Buchungstext" },
      { text: "Betrag", value: "Betrag"},
      { text: "Datum", value: "Datum"},
      { text: "Konto", value: "Konto"},
      { text: "Gegenkonto", value: "Gegenkonto"},
      { text: "Kostenstelle 1", value: "Kostenstelle 1"}
    ],
   }),
   methods: {
     makeEuro: function (amount) {
       return currencyFormater.formatEuro(amount)
     }
   },
   computed: {
    pages() {
      return this.pagination.rowsPerPage ? Math.ceil(this.addisonData.length / this.pagination.rowsPerPage) : 0;
    }
  },
}
</script>

<style scoped>
</style>