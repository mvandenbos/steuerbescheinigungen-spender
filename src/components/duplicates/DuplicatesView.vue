<template>
  <v-card v-show="duplicates.length > 0" class="my-4">
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
        :items="duplicates"
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
          <tr @click="toggle(props.item.duplicateID)" class="clickable">
            <td style="width: 50px;">
              <v-icon v-if="opened.includes(props.item.duplicateID)" color="primary">arrow_drop_up</v-icon>
              <v-icon v-else color="primary">arrow_drop_down</v-icon>
            </td>
            <td>{{ props.item.duplicateID }}</td>
          </tr>
          <tr v-if="opened.includes(props.item.duplicateID)" :class="{ opened: opened.includes(props.item.duplicateID) }">
            <td colspan="4">
              <table>
                <thead>
                  <tr>
                    <th>Spender Id</th>
                    <th>ChurchTool ID</th>
                    <th>Vorname</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subitem, i) in props.item.duplicates" v-bind:key="i">
                    <td>{{ subitem.optigem_nr }}</td>
                    <td>{{ subitem.id }}</td>
                    <td>{{ subitem.vorname }}</td>
                    <td>{{ subitem.name }}</td>
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
export default {
  name: "DuplicatesView",
  props: {
    duplicates: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "Duplizierten Personen"
    }
  },
  data: () => ({
    opened: [],
    pagination: {
      rowsPerPage: 25
    },
    headers: [
      { text: "", value: 'blank'},
      { text: "SpenderId", value: "duplicateID" },
    ],
    search: "",
   }),
   computed: {
    pages() {
      return this.pagination.rowsPerPage ? Math.ceil(this.duplicates.length / this.pagination.rowsPerPage) : 0;
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
  }
}
</script>

<style scoped>
</style>