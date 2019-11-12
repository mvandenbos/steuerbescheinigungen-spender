<template>
  <v-alert
    type="info"
    color="primary"
    dismissible
    value="true"
    dark
    class="v-alert--white-icons"
  >
    <div v-show="newVersionAvailable  && !newVersionDownloading && !newVersionDownloaded">
      Update Available: Version {{ newVersionNumber }} is now available
      <v-btn small @click="startUpdate()">Download Update</v-btn>
    </div>
    <div v-show="newVersionAvailable && newVersionDownloading">
        <v-progress-linear
          indeterminate
          color="info"
        ></v-progress-linear>        
        <h4>Downloading and installing latest version</h4>
        <p>This may take some time depending on the speed of your internet connection, please be patient and wait for the download to finish.</p>
    </div>
    <div v-show="newVersionDownloaded"> 
      <h4>Download Complete</h4>
      Restart your application to complete the installation <v-btn small>Restart Now</v-btn>
    </div>
  </v-alert>
</template>

<script>

const { ipcRenderer } = require('electron');

export default {
  name: "UpdaterView",
  data() {
    return {
      newVersionAvailable: false,
      newVersionNumber: null,
      newVersionReadMe: null,
      newVersionDownloading: false,
      newVersionDownloaded: false,
    }
  },
  methods: {
    setNewVersionData: function(sender, meta) {
      this.newVersionAvailable = true;
      this.newVersionNumber = meta.version;
      this.newVersionReadMe = meta.readme; 
    },
    checkForUpdate: function() {
      console.log('check-for-update-sent')
      ipcRenderer.send("check-for-updates");      
      ipcRenderer.on("update-available", (sender, meta) => {
        console.log('update-available')
        this.setNewVersionData(sender, meta)
      })
    },
    startUpdate: function() {      
      console.log('download-update')   
      this.newVersionDownloading = true
      ipcRenderer.send("download-update"); 
      ipcRenderer.on("update-downloaded", (sender, meta) => {
        console.log('update-downloaded')
        this.newVersionDownloading = false
        this.newVersionDownloaded = true
      })
    },
    finishDownload: function() {
        this.newVersionDownloading = false
        this.newVersionDownloaded = true
    },
    restartAndInstallUpdate: function() {      
      console.log('quit-and-install')
      ipcRenderer.send("quit-and-install"); 
    }
  },
  beforeMount() {
    this.checkForUpdate()
  }
};
</script>

<style>
.v-alert--white-icons .v-icon.material-icons.theme--light.v-alert__icon,
.v-alert--white-icons .v-icon.v-icon--right.material-icons.theme--light {
  color: #FFF !important;
}
</style>