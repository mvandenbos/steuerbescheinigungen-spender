<template>
  <v-card v-show="donors.length > 0" class="my-4">
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
        :items="donors"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-1 donor-table"
      >
        <template slot="headerCell" slot-scope="props">

          <v-tooltip bottom v-if="props.header.value!='download'">
            <span slot="activator">
              {{ props.header.text }}
            </span>
            <span>
              {{ props.header.text }}
            </span>
          </v-tooltip>
          <v-tooltip bottom v-if="!hidedownload && props.header.value=='download'">
            <span slot="activator">
              {{ props.header.text }}
            </span>
            <span>
              {{ props.header.text }}
            </span>
          </v-tooltip>
        </template>
        
        <template slot="items" slot-scope="props">
          <tr @click="toggle(props.item.optigem_nr)" class="clickable">
            <td>
              <v-icon v-if="opened.includes(props.item.optigem_nr)" color="primary">arrow_drop_up</v-icon>
              <v-icon v-else color="primary">arrow_drop_down</v-icon>
            </td>
            <td>{{ props.item.optigem_nr }}</td>
            <td>{{ props.item.anrede }}</td>
            <td>{{ props.item.vorname }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.strasse }}</td>
            <td>{{ props.item.plz }}</td>
            <td>{{ props.item.ort }}</td>
            <td>{{ props.item.zusatz }}</td>
            <td v-show="!hidedownload">
              <v-btn flat v-on:click.stop color="primary" primary title="Download PDF" @click="generatePDF(props.item.optigem_nr)">
                  <v-icon class="mr-2" color="primary" medium>cloud_download</v-icon>PDF
              </v-btn>
            </td>
          </tr>
          <tr v-if="opened.includes(props.item.optigem_nr)" :class="{ opened: opened.includes(props.item.optigem_nr) }">
            <td colspan="10">
              <table>
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Betrag</th>
                    <th>Art der Zuwendung</th>
                    <th>Verzicht auf die Erstattung von Aufwendungen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, i) in 39" v-bind:key="i">
                    <td v-if="props.item['datum_' + i.toString().padStart(2,0)]">{{ props.item["datum_" + i.toString().padStart(2,0)]}}</td>
                    <td v-if="props.item['spende_' + i.toString().padStart(2,0)]">{{ props.item["spende_" + i.toString().padStart(2,0)]}}</td>
                    <td v-if="props.item['artderzuwendung_' + i.toString().padStart(2,0)]">
                      <v-radio-group row v-model="props.item['artderzuwendung_' + i.toString().padStart(2,0)]" color="secondary" hide-details>
                        <v-radio color="secondary" label="Geldzuwendung" value="Geldzuwendung" hide-details></v-radio>
                        <v-radio color="secondary" label="Mitgliedsbeitrag" value="Mitgliedsbeitrag" hide-details></v-radio>
                      </v-radio-group>
                    </td>
                    <td v-if="props.item['verzichtauferstattung_' + i.toString().padStart(2,0)]">
                      <v-switch
                        v-model="props.item['verzichtauferstattung_' + i.toString().padStart(2,0)]"
                        :label="props.item['verzichtauferstattung_' + i.toString().padStart(2,0)]"
                        color="secondary"
                        true-value="ja"
                        false-value="nein"
                        hide-details
                        @click.native.stop
                      ></v-switch>
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
const { ipcRenderer } = require('electron');
export default {
  name: "DonorView",
  props: {
    donors: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "Donors"
    },
    hidedownload: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    opened: [],
    pagination: {
      rowsPerPage: 25
    },
    headers: [
      { text: "", value: 'blank'},
      { text: "SpenderId", value: "optigem_nr" },
      { text: "Anrede", value: "anrede" },
      { text: "Vorname", value: "vorname" }, 
      { text: "Name", value: "name" },
      { text: "Strasse", value: "strasse" },
      { text: "PLZ", value: "plz" },
      { text: "Ort", value: "ort" },
      { text: "Zusatz", value: "zusatz" },
      { text: "Download", value: "download" },
    ],
    search: "",
   }),
   computed: {
    pages() {
      return this.pagination.rowsPerPage ? Math.ceil(this.donors.length / this.pagination.rowsPerPage) : 0;
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
    generatePDF(id) {
      let self = this
      this.loadingPdf = true 

      let person = this.donors.filter(record => record.optigem_nr == id)

      ipcRenderer.send('start-generate-report', person)  
      ipcRenderer.on('generated-report-saved', (event, file_path) => {
        self.loadingPdf = false
      })
    }
  }
}
</script>

<style>
.opened {
  background-color: rgb(250, 250, 250);
}

.donor-table tbody > tr.clickable {
  cursor: pointer;
}
</style>