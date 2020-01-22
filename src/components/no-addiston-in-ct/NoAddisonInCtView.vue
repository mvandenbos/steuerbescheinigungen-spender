<template>
  <v-card v-show="spenderlist.length > 0" class="my-4">
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
        :items="spenderlist"
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
          <tr @click="toggle(props.item.spenderid)" class="clickable">
            <td style="width: 50px;">
              <v-icon v-if="opened.includes(props.item.spenderid)" color="primary">arrow_drop_up</v-icon>
              <v-icon v-else color="primary">arrow_drop_down</v-icon>
            </td>
            <td>{{ props.item.spenderid }}</td>
          </tr>
          <tr v-if="opened.includes(props.item.spenderid)" :class="{ opened: opened.includes(props.item.spenderid) }">
            <td colspan="2">
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subitem, i) in props.item.spenden" v-bind:key="i">
                    <td>{{ subitem["Belegnummer 2"]}}</td>
                    <td>{{ subitem.Buchungstext }}</td>
                    <td>{{ makeEuro(subitem.Betrag) }}</td>
                    <td>{{ subitem.Datum }}</td>
                    <td>{{ subitem.Konto }}</td>
                    <td>{{ subitem.Gegenkonto }}</td>
                    <td>{{ subitem["Kostenstelle 1"]}}</td>
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
  name: "NoAddisonInCtView",
  props: {
    spenderlist: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "No Addison Spender ID in Churchtools"
    }
  },
  data: () => ({
    opened: [],
    pagination: {
      rowsPerPage: 25,
      sortBy: "spenderid"
    },
    headers: [
      { text: "", value: 'blank'},
      { text: "Spender ID", value: "spenderid" },
    ],
    search: "",
   }),
   computed: {
    pages() {
      return this.pagination.rowsPerPage ? Math.ceil(this.spenderlist.length / this.pagination.rowsPerPage) : 0;
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