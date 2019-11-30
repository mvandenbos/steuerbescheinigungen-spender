<template>
  <v-card>  
    <v-toolbar secondary color="secondary" dark :clipped-left="true">
        <h2 class="title">{{ $t('title') }}</h2>
        <v-spacer></v-spacer>
        <span class="text-xs-right">Version {{ getAppVersion() }}</span>
        <v-menu bottom left style="z-index:999;">
          <v-btn slot="activator" icon dark>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <!-- <v-list-tile  @click="importSettings()">
              <v-list-tile-avatar>
                <v-icon primary >import_export</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{$t('import')}}</v-list-tile-title>
            </v-list-tile> -->
            <v-list-tile  @click="exportSettings()">
              <v-list-tile-avatar>
                <v-icon primary fab>get_app</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{$t('export')}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>   
    <v-card-text>
      <h2 class="py-2">
        {{ $t('settings') }}
        <v-btn flat small color="error" @click="resetLocalSettings">{{ $t('resetToDefault') }}</v-btn>
      </h2>
      <v-text-field :label="$t('chuchname')" type="text" v-model="settings.churchname" required></v-text-field>
      <v-text-field :label="$t('churchtoolsURL')" type="text" v-model="settings.churchtoolshost" required></v-text-field>
      <h3 class="py-2">
        Logo
        <v-btn v-show="getChurchLogoSrc() != ''" flat small color="error" @click="removeLogo">{{ $t('logoRemove') }}</v-btn>
      </h3>
      <div v-if="getChurchLogoSrc() != ''">
        <img :src="getChurchLogoSrc()" :alt="getChurchLogoAlt()" class="logo mb-2"/>
        <v-text-field :label="$t('logoDescription')" type="text" v-model="settings.churchlogo.description" ></v-text-field>
      </div>
      <div v-else>
        <label>{{ $t('logoNone') }}</label>
        <uploader-view filetypes="image/png, image/jpeg, image/gif" @file-change="processFileChange" class="my-2">
        </uploader-view>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" flat @click="close">{{ $t('cancel') }}</v-btn>
      <v-btn color="accent" @click="save">{{ $t('save') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const {app} = require('electron').remote
import { mapState } from 'vuex'
import UploaderView from '../utilities/UploaderView';
import keys from '../../config/LocalForageKeys'
import localFileManager from '../../utilities/localFileManager'

const path = require("path");
const fs = require('fs');
const filePath = path.join(__dirname, "..", "../settings/settings.json");
const logoPath = path.join(__dirname, "..", "../assets/logo/");
const ct = require('../../churchtools/credentials').churchtools;

export default {
  name: "SettingsView",
  components: { UploaderView },
  data() {
    return {
      file: null,
    }
  },
  computed: mapState([
    'settings'
  ]),
  methods: {
    close() {
      this.$emit('close');
    },
    save: function() {
      ct.host = this.settings.churchtoolshost
      localFileManager.save(localStore, keys.SETTINGS, this.settings)      
      this.$store.dispatch('UPDATE_SETTINGS', this.settings)
      this.$emit('close')      
    },
    getAppVersion: function() {
      return app.getVersion()
    },
    processFileChange(e) {
      if (e.target.files.length > 0) {
        this.file = e.target.files[0]        
        let rawdata = fs.readFileSync(this.file.path)
        let base64data = rawdata.toString('base64');
        let base64Path = "data:" + this.file.type + ";base64," + base64data 
        this.settings.churchlogo.src = base64Path
      }
    },
    removeLogo() {
      this.settings.churchlogo.src = ""
      this.settings.churchlogo.description = ""
    },
    getChurchLogoSrc: function () {
      if (this.settings && this.settings.churchlogo) {
        return this.settings.churchlogo.src
      }
    },
    getChurchLogoAlt: function () {
      if (this.settings  && this.settings.churchlogo) {
        return this.settings.churchlogo.description
      }
    },
    updateChurchlogoAlt: function (e) {
      if (this.settings  && this.settings.churchlogo) {
        console.dir(e)
        console.log(this.settings.churchlogo.description)
      }
    },
    resetLocalSettings: function () {
      localFileManager.resetItem(localStore, keys.SETTINGS, this.$store, 'UPDATE_SETTINGS')
    },
    importSettings: function () {

    },
    exportSettings: function () {
      localFileManager.exportJSONFile(localStore, keys.SETTINGS);
    },
  }
}
</script>

<style scoped>
  .logo {
    max-width: 300px;
    max-height: 300px; 
    display: block;
  }
</style>