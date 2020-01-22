<template>
  <v-card v-show="mismatches.length > 0" class="my-4">
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
        :items="mismatches"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-1 donor-table"
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
          <tr @click="toggle(props.item.donorID)" class="clickable">
            <td style="width: 50px;">
              <v-icon v-if="opened.includes(props.item.donorID)" color="primary">arrow_drop_up</v-icon>
              <v-icon v-else color="primary">arrow_drop_down</v-icon>
            </td>
            <td style="width: 100px;">{{ props.item.donorID }}</td>
            <td flex>{{ props.item.donor }}</td>
            <td>
              <v-chip
                :color="getChipColor(props.item.probability)"
                text-color="white"
                small
              >
                {{ $t(props.item.probability) }}
              </v-chip>
            </td>
          </tr>
          <tr v-if="opened.includes(props.item.donorID)" :class="{ opened: opened.includes(props.item.donorID) }">
            <td colspan="4">
              <table style="width: 100%;">
                <thead style="text-align: left;">
                  <tr>
                    <th>Spender ID</th>
                    <th>Buchungstext</th>
                    <th>Betrag</th>
                    <th>Datum</th>
                    <th>Konto</th>
                    <th>Gegenkonto</th>
                    <th>Kostenstelle 1</th>
                    <th>Wahrscheinlichkeit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subitem, i) in props.item.donations" v-bind:key="i">
                    <td>{{ subitem.misMatchedRecord["Belegnummer 2"]}}</td>
                    <td>{{ subitem.misMatchedRecord.Buchungstext }}</td>
                    <td>{{ makeEuro(subitem.misMatchedRecord.Betrag) }}</td>
                    <td>{{ subitem.misMatchedRecord.Datum }}</td>
                    <td>{{ subitem.misMatchedRecord.Konto }}</td>
                    <td>{{ subitem.misMatchedRecord.Gegenkonto }}</td>
                    <td>{{ subitem.misMatchedRecord["Kostenstelle 1"]}}</td>
                    <td>
                      <v-chip
                        :color="getChipColor(subitem.probability)"
                        text-color="white"
                        small
                      >
                        {{ $t(subitem.probability) }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>          
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
  name: "MisMatchedView",
  props: {
    mismatches: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "MisMatched Personen"
    }
  },
  data: () => ({
    opened: [],
    pagination: {
      rowsPerPage: 25,
      sortBy: "donor"
    },
    headers: [
      { text: "", value: 'blank'},
      { text: "Spender ID", value: "donorID" },
      { text: "Spender", value: "donor" },
      { text: "Wahrscheinlichkeit", value: "probability" },
    ],
    search: "",
   }),
   computed: {
    pages() {
      return this.pagination.rowsPerPage ? Math.ceil(this.mismatches.length / this.pagination.rowsPerPage) : 0;
    }
  },
  methods: {
    toggle(id) {
      const index = this.opened.indexOf(id);
      this.opened = [];
      if (index == -1) {
        this.opened.push(id)
      }
    },
     makeEuro: function (amount) {
       return currencyFormater.formatEuro(amount)
     },
     getChipColor: function (value) {
       let color = (value == "high") ? "error" : (value == "medium") ? "primary" : "secondary"
       return color
     },
  }
}
</script>

<style scoped>
</style>