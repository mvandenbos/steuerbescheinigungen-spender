<template>
  <v-app v-cloak>
    <v-toolbar fixed app :clipped-left="true" primary color="primary">
      <!-- <v-avatar :size="40">
        <img src="./assets/fcg-logo.png" alt="fcg logo">
      </v-avatar> -->
      <v-toolbar-title class="title--caps white--text">{{ getChurchName() }}{{$t('title')}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <i class="flag-icon flag-icon-de" v-bind:class="{ active: activeLang=='de'  }" @click="setDE"></i>
        <i class="flag-icon flag-icon-us" v-bind:class="{ active: activeLang=='en'  }" @click="setEN"></i>
      </div>
      <v-btn fab small dark color="primary" @click="showSettingsModal = true"><v-icon>settings</v-icon></v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <index-view/>
      </v-container>
    </v-content>
    <v-dialog v-model="showSettingsModal" max-width="500px">
      <settings-view @close="closeSettings"></settings-view>
    </v-dialog>
  </v-app>
</template>

<script>
import IndexView from './components/IndexView'
import SettingsView from './components/settings/SettingsView'
import Vue from 'vue'
import { mapState } from 'vuex';
const path = require("path");
const fs = require('fs');
const filePath = path.join(__dirname, "", "settings/settings.json");
const ct = require('./churchtools/credentials').churchtools;

export default {
  name: 'App',
  components: {
    IndexView,
    SettingsView
  },
  data () {
    return {
      title: Vue.i18n.translate('title'),
      activeLang: 'de',
      showSettingsModal: false
    }
  },
  methods: {
    setEN: function() {
      Vue.i18n.set('en');
      this.activeLang = 'en'
    },    
    setDE: function() {
      Vue.i18n.set('de');
      this.activeLang = 'de'
    },
    loadData: function() {
      let rawdata = fs.readFileSync(filePath);  
      let _settings = JSON.parse(rawdata);
      ct.host = _settings.churchtoolshost
      this.$store.dispatch('UPDATE_SETTINGS', _settings)
    },
    closeSettings: function() {
      this.showSettingsModal = false
    },
    getChurchName: function() {
      if (this.settings.churchname) {
        return this.settings.churchname + " - "
      }
    },
  },
  beforeMount(){
    this.loadData()
  },
  computed: mapState([
    'settings'
  ])
}
</script>

<style scoped>
  .languages {
    background-color:rgba(255, 255, 255, 0.10);
  }
  
  [v-cloak] {
    background-color: #CCC;
  }

  .active {
    opacity: 1;
  }
  .v-icon {
    display: inline-flex !important;
    line-height: 1 !important;
  }
</style>