<template>
  <v-card>  
    <v-toolbar secondary color="secondary" dark :clipped-left="true">
        <h2 class="title">{{ $t('title') }}</h2>
        <v-spacer></v-spacer>
        <span class="text-xs-right">Version {{ getAppVersion() }}</span>
    </v-toolbar>
    <v-card-text>
      <h2 class="py-2">{{ $t('settings') }}</h2>
      <v-text-field :label="$t('chuchname')" type="text" v-model="settings.churchname" required></v-text-field>
      <v-text-field :label="$t('churchtoolsURL')" type="text" v-model="settings.churchtoolshost" required></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" flat @click="close">Close</v-btn>
      <v-btn color="accent" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const {app} = require('electron').remote
import { mapState } from 'vuex'
const path = require("path");
const fs = require('fs');
const filePath = path.join(__dirname, "..", "../settings/settings.json");
const ct = require('../../churchtools/credentials').churchtools;

export default {
  name: "SettingsView",
  methods: {
    close() {
      this.$emit('close');
    },
    save: function() {
      let data = JSON.stringify(this.settings)
      ct.host = this.settings.churchtoolshost
      this.$store.dispatch('UPDATE_SETTINGS', this.settings)
      this.$emit('close', data)
      fs.writeFile(filePath, data , function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });
    },
    getAppVersion: function() {
      return app.getVersion()
    }
  },
  computed: mapState([
    'settings'
  ])
}
</script>