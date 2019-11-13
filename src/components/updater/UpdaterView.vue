<template>
  <v-alert
    type="info"
    color="primary"
    dismissible
    value="true"
    dark
    class="v-alert--white-icons"
    v-show="newVersionAvailable"
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
        <h4>Downloading latest version</h4>
        <p>This may take some time depending on the speed of your internet connection, please be patient and wait for the download to finish.</p>
    </div>
    <div v-show="newVersionDownloaded"> 
      <h4>Download Complete</h4>
      Restart your application to complete the installation <v-btn small @click="restartAndInstallUpdate()">Restart Now</v-btn>
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
      ipcRenderer.send("check-for-updates");      
    },
    startUpdate: function() {      
      this.newVersionDownloading = true
      ipcRenderer.send("download-update"); 
    },
    restartAndInstallUpdate: function() {   
      ipcRenderer.send("quit-and-install"); 
    },
    setUpdaterEvents: function() {
      ipcRenderer.on("check-for-update", (sender) => {
        console.log("check-for-update")
      })
      ipcRenderer.on("checking-for-update", (sender) => {
        console.log("checking-for-update")
      })
      ipcRenderer.on("update-available", (sender, meta) => {
        this.setNewVersionData(sender, meta)
      })
      ipcRenderer.on("download-update", (sender) => {
        console.log("download-update")
      })
      ipcRenderer.on("update-downloading", (sender, meta) => {
        console.log("update-downloading")
      })
      ipcRenderer.on("update-downloaded", (sender, meta) => {
        console.log("update-downloaded")
        this.newVersionDownloading = false
        this.newVersionDownloaded = true
      })
      ipcRenderer.on("quit-and-install", (sender) => {
        console.log("quit-and-install")
      })
      ipcRenderer.on("error", (err) => {
        console.dir(err)
      })      
      this.checkForUpdate()
    }
  },
  beforeMount() {
    this.setUpdaterEvents()
  }
};
</script>

<style>
.v-alert--white-icons .v-icon.material-icons.theme--light.v-alert__icon,
.v-alert--white-icons .v-icon.v-icon--right.material-icons.theme--light {
  color: #FFFFFF !important;
}
</style>