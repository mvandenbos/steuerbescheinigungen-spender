<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="slide-down">    
        <template-view v-on:close="toggleTemplateDialog"></template-view>
    </v-dialog>
    <v-flex xs12>
      <updater-view class="mb-2"></updater-view>
      <v-progress-linear v-show="loading" color="accent" :indeterminate="true"></v-progress-linear>
      <v-stepper v-model="activeStep">
        <v-stepper-header>
          <v-stepper-step :complete="activeStep > 1" step="1" color="accent">{{ $t('stepperTitle1') }}</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="activeStep > 2" step="2" color="accent">{{ $t('stepperTitle2') }}</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="activeStep > 3" step="3" color="accent">{{ $t('stepperTitle3') }}</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="activeStep > 4" step="4" color="accent">{{ $t('stepperTitle4') }}</v-stepper-step>
          <v-divider></v-divider>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat>
              <v-card-title class="headline">
                {{ $t('title1') }}
                <v-subheader>{{ $t('subtitle1') }}</v-subheader>
              </v-card-title>
              <v-card-text>
                <v-flex xs12 sm6>
                  <v-form>
                    <v-text-field
                      v-model="user"
                      :rules="userRules"
                      :label="$t('user')"
                      :placeholder="$t('userPlaceholder')"
                      color="secondary"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      :label="$t('password')"
                      type="password"
                      :placeholder="$t('passwordPlaceholder')"
                      required
                      v-on:keyup.enter="loginUser"
                    ></v-text-field>
                  </v-form>
                </v-flex>
              </v-card-text>
              <v-card-actions>
                <v-btn class="mx-4" color="primary" primary @click="loginUser">{{ $t('loginButtonText') }}</v-btn>
              </v-card-actions>
            </v-card>     
            <v-flex class="ma-4"  v-show="!showExistingErrors">
              <v-alert :type="getCtPerson.alertType" color="red darken-4" outline v-model="getCtPerson.alertValue" transition="fade-transition" :dismissible="getCtPerson.isDismisable">{{getCtPerson.alertText}}</v-alert>
            </v-flex>
            
            <v-divider class="ma-4"></v-divider>
   
            <v-card flat class="my-4" v-show="activeStep == 1">
              <v-card-title class="headline">
                {{ $t('existingTitleText') }}
                <v-subheader>
                  {{ $t('existingSubTitleText') }}
                </v-subheader>
              </v-card-title>
              <v-card-text>
                <uploader-view @file-change="processReportFileChange"  filetypes="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></uploader-view>
              </v-card-text>        
              <v-card-actions>
                <v-btn class="mx-4 mt-4" color="primary" primary @click="uploadPreviousReport">{{ $t('uploadButtonText') }}</v-btn>
              </v-card-actions>
              <v-flex class="ma-4" v-show="showExistingErrors">
                <v-alert :type="getCtPerson.alertType" color="red darken-4" outline v-model="getCtPerson.alertValue" transition="fade-transition" :dismissible="getCtPerson.isDismisable">{{getCtPerson.alertText}}</v-alert>
              </v-flex>
            </v-card> 
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card>
              <v-card-title class="headline">
                {{ $t('stepperSubtitle2') }}
              </v-card-title>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card flat>
              <v-card-title class="headline">
                  {{ $t('stepperTitle3') }}
              </v-card-title>
              <v-card-text>
                <uploader-view @file-change="processExcelUploadFileChange" filetypes=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></uploader-view>
              </v-card-text>        
              <v-card-actions>
                <v-btn class="mx-4 mt-4" color="primary" primary @click="upload">{{ $t('uploadButtonText') }}</v-btn>
              </v-card-actions>
            </v-card>            
            <v-flex class="ma-4">
              <v-alert :type="getCtPerson.alertType" color="red darken-4" outline v-model="getCtPerson.alertValue" transition="fade-transition" :dismissible="getCtPerson.isDismisable">{{getCtPerson.alertText}}</v-alert>
            </v-flex>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-toolbar dense color="transparent" class="toolbar--midpage">
              <v-toolbar-title class="headline">{{ $t('stepperTitle4') }}</v-toolbar-title>              
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn flat class="link-btn" @click="activeStep = 3" v-show="loggedIn == true">
                  <v-icon class="mr-1" medium>navigate_before</v-icon>{{ $t('backToAddisonButton') }}
                </v-btn>
                <v-btn flat secondary class="link-btn" @click="reparseChurchToolsAddisonData" :loading="refreshPersons" :disabled="refreshPersons" v-show="loggedIn == true">
                    <v-icon class="mr-1" medium>refresh</v-icon>{{ $t('refreshData') }}
                    <span slot="loader">Refreshing...</span>
                </v-btn>
                <v-btn flat class="link-btn" @click="toggleTemplateDialog">
                  <v-icon class="mr-1" medium>description</v-icon>{{ $t('editTemplate') }}
                </v-btn>
                <v-btn flat secondary class="link-btn" @click="restart">
                  <v-icon class="mr-1" medium>power_settings_new</v-icon>{{ $t('restartButtonText') }}
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card flat>
              <v-card-title class="title pb-0">
                Downloads
              </v-card-title>
              <v-card-text>                
                {{ $t('stepperSubtitle4') }}
              </v-card-text>
              <v-card-actions class="px-4">
                <v-btn flat large color="green darken-4 white--text" title="Download Excel" @click="generateExcel" :loading="loadingExcel" :disabled="loadingExcel">
                    <v-icon class="mr-2" medium>cloud_download</v-icon>Excel
                    <span slot="loader">Generating...</span>
                </v-btn>
                <v-btn flat large color="primary white--text" title="Download PDF" @click="generatePDF" :loading="loadingPdf" :disabled="loadingPdf">
                    <v-icon class="mr-2" medium>cloud_download</v-icon>PDF
                    <span slot="loader">Generating...</span>
                </v-btn>
              </v-card-actions>              
              <v-progress-linear :indeterminate="true" v-show="loadingPdf" color="primary"></v-progress-linear>
              <v-progress-linear :indeterminate="true" v-show="loadingExcel" color="green darken-4"></v-progress-linear>
              <v-flex class="ma-4">
                <v-alert :type="getCtPerson.alertType" outline v-model="getCtPerson.alertValue" transition="fade-transition" :dismissible="getCtPerson.isDismisable">{{getCtPerson.alertText}}</v-alert>
              </v-flex>
            </v-card>
            <v-card flat>
              <v-card-title class="title">
                {{ $t('reviewTitle') }}
              </v-card-title>
              <v-card-text>
                <v-tabs
                  color="transparent"
                  icons-and-text                  
                  slider-color="accent"
                  grow
                  class="tab--border-bottom"
                >
                  <v-tab href="#tab-1" active-class="tabs__item--active initial-slider--line" style="max-width: 250px;">
                    {{ $t('donorTab') }}
                    <v-icon color="green">check_circle</v-icon>
                  </v-tab>
                  <v-tab href="#tab-2" >
                    {{ $t('reviewRecordsTab') }} 
                    <v-icon color="red">error</v-icon>                  
                  </v-tab>
                  <v-tab href="#tab-3" v-show="noMatchingAddisonSpenderIdInChurchtools.length > 0">
                    {{ $t('churchtoolNotInAddisonTab') }}
                    <v-icon color="light-blue">info</v-icon>
                  </v-tab>
                  <v-tab href="#tab-4" v-show="persons.length > 0">
                    {{ $t('churchtoolTab') }}
                    <v-icon>people</v-icon>
                  </v-tab>
                  <v-tab href="#tab-5" v-show="addisonData.length > 0">
                    {{ $t('addisonTab') }}
                    <v-icon>account_balance</v-icon>
                  </v-tab>
                <v-tabs-items>
                  <v-tab-item value="tab-1">
                    <v-card flat>
                      <v-card-text>                    
                        <donor-view :title="$t('donorTabTitle')" :donors="[...donationReportData]"></donor-view>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item value="tab-2">
                    <v-card flat>                      
                      <v-tabs                      
                        color="transparent"
                        icons-and-text                  
                        slider-color="accent"
                        grow
                        class="tab--border-bottom"
                      >                          
                        <v-tab href="#tab-verification-01" v-show="noAddisonSpenderIdInChurchtoolsIdList.length > 0" active-class="tabs__item--active initial-slider--line">
                          {{ $t('addistonNotInChurchtoolsTab') }}
                          <v-icon color="red">error</v-icon>
                        </v-tab>               
                        <v-tab href="#tab-verification-02" v-show="misMatchedSpenderIDsInAddison.length > 0" active-class="tabs__item--active initial-slider--line">
                          {{ $t('misMatchedTab') }}
                          <v-icon color="red">error</v-icon>
                        </v-tab>
                        <v-tab href="#tab-verification-03" v-show="duplicateDonorSpenderIDs.length > 0" active-class="tabs__item--active initial-slider--line">
                          {{ $t('duplicatesDonorTab') }}
                          <v-icon color="red">error</v-icon>
                        </v-tab>
                        <v-tab href="#tab-verification-04" v-show="duplicateCTSpenderIDs.length > 0" active-class="tabs__item--active initial-slider--line">
                          {{ $t('duplicatesTab') }}
                          <v-icon color="red">error</v-icon>
                        </v-tab>
                        <v-tabs-items>
                          <v-tab-item value="tab-verification-01">
                            <v-card flat>
                              <v-card-text>
                                <no-addison-in-ct-view :title="$t('addistonNotInChurchtoolsTab')" :spenderlist="[...noAddisonSpenderIdInChurchtools]"></no-addison-in-ct-view>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item value="tab-verification-02">
                            <v-card flat>
                              <v-card-text><mis-matched-view :title="$t('misMatchedTab')" :mismatches="[...misMatchedSpenderIDsInAddison]"></mis-matched-view></v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item value="tab-verification-03">
                            <v-card flat>
                              <v-card-text><duplicates-view :title="$t('duplicatesDonorTabTitle')" :duplicates="[...duplicateDonorSpenderIDs]"></duplicates-view></v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item value="tab-verification-04">
                            <v-card flat>
                              <v-card-text><duplicates-view :title="$t('duplicatesTabTitle')" :duplicates="[...duplicateCTSpenderIDs]"></duplicates-view></v-card-text>
                            </v-card>
                          </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item value="tab-3">
                    <v-card flat>
                      <v-card-text><churchtools-view :title="$t('churchtoolNotInAddisonTabTitle')" :persons="[...noMatchingAddisonSpenderIdInChurchtools]"></churchtools-view></v-card-text>                    </v-card>
                  </v-tab-item>
                  <v-tab-item value="tab-4">
                    <v-card flat>
                      <v-card-text><churchtools-view :title="$t('churchtoolTab')" :persons="[...persons]"></churchtools-view></v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item value="tab-5">
                    <v-card flat>
                      <v-card-text><addison-view :title="$t('addisonTab')" :addison-data="[...addisonData]"></addison-view></v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
                </v-tabs>
              </v-card-text>
            </v-card>            
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-flex> 
  </v-layout>
</template>

<script>
const { ipcRenderer } = require('electron');
const ct = require('../churchtools/credentials');
import { mapState } from 'vuex';
import {getExportSpenderPersonDataQ, loginQ} from '../churchtools/churchtools';
import UploaderView from './utilities/UploaderView';
import AddisonView from './addison/AddisonView';
import ChurchtoolsView from './churchtools/ChurchtoolsView';
import DonorView from './donors/DonorView';
import DuplicatesView from './duplicates/DuplicatesView';
import MisMatchedView from './mismatched/MisMatchedView';
import NoAddisonInCtView from './no-addiston-in-ct/NoAddisonInCtView';
import TemplateView from "./template/TemplateView";
import UpdaterView from "./updater/UpdaterView";
import errors from '../config/errors';

export default {
  name: "index",
  components: { UploaderView, AddisonView, ChurchtoolsView, DonorView, DuplicatesView, TemplateView, UpdaterView, MisMatchedView, NoAddisonInCtView },
  data: () => ({
    dialog: false,
    notifications: false,
    sound: true,
    widgets: false,
    activeStep: 1,
    loading: false,
    loadingPdf: false,
    loadingExcel: false,
    refreshPersons: false,
    user: "",
    userRules: [v => !!v || "Name is required"],
    password: "",
    passwordRules: [v => !!v || "Password is required"],
    getCtPerson: {
      alertValue: false,
      alertType: "success",
      alertText: "All Data received",
      isDismisable: false
    },
    showExistingErrors: false,
    loggedIn: false,
    file: null,
    reportFile: null
  }),
  methods: {
    setAlert: function(visible, message = "", type = "error", dismissible = true) {      
      this.getCtPerson.alertValue = visible
      this.getCtPerson.alertType = type
      this.getCtPerson.isDismisable = dismissible
      if (errors[message]) {
        this.getCtPerson.alertText = this.$parent.$i18n.translate(errors[message]);
      }
      else {
        this.getCtPerson.alertText = message
      }
    },
    setErrorWatch: function() {
      ipcRenderer.on('display-error', (event, err) => {
        this.setAlert(true, err.message, "error", true )
        this.loading = false
        this.loadingPdf = false
        this.loadingExcel = false
      })
    },
    loginUser: function() {
      let self = this
      self.loading = true;
      self.showExistingErrors = false;
      ct.churchtools.user = self.user;
      ct.churchtools.password = self.password;
      loginQ().then(result => {
        if (result.status == "success") {
          self.loggedIn = true;
          self.password = null;
          self.activeStep = 2;
          self.setAlert(false);
          self.getExportSpenderPersonData();
        } else {
          self.loggedIn = false;
          self.password = null;
          self.loading = false;
          self.setAlert(true, result.message);
        }
      })
      .fail(err => {
        let msg = (err.message == undefined) ? this.$parent.$i18n.translate('unknownURL') : err.message
        self.setAlert(true, msg);
        self.loading = false;
      });
    },
    getExportSpenderPersonData: function() {
      var self = this;
      getExportSpenderPersonDataQ().then(result => {
          self.$store.dispatch('UPDATE_PERSONS', Object.values(result.data))
          self.setAlert(false);
          self.activeStep = 3;
          self.loading = false;
        })
        .fail(err => {
          self.setAlert(true, err.message);
          self.loading = false;
        });
    },    
    upload: function() {
      if(this.file == null) {
        this.setAlert(true, this.$parent.$i18n.translate(errors.E006))
        return
      }   
      this.loading = true;
      let self = this
      ipcRenderer.send('start-parse-addison-data', this.file.path)
      ipcRenderer.on('parsed-addison-data-saved', (event, data) => {
        self.$store.dispatch('UPDATE_ADDISON_DATA', data)
        this.getChurchToolsAddisonData();
      })
    },
    reparseChurchToolsAddisonData: function() {    
      var self = this;
      self.loading = true;
      this.refreshPersons = true;
      getExportSpenderPersonDataQ().then(result => {
          self.$store.dispatch('UPDATE_PERSONS', Object.values(result.data))
          this.refreshChurchToolsAddisonData();
        })
        .fail(err => {
          self.setAlert(true, err.message);
          self.loading = false;
          self.refreshPersons = false;
        });
    },
    uploadPreviousReport: function() {
      this.showExistingErrors = true;
      if(this.reportFile == null) {
        this.setAlert(true, this.$parent.$i18n.translate(errors.E006))
        return
      }   
      let self = this
      self.loading = true;
      ipcRenderer.send('start-parse-existing-report', this.reportFile.path)
      ipcRenderer.on('parsed-existing-report-saved', (event, data) => {
        self.$store.dispatch('UPDATE_DONATIONREPORT_DATA', data)
        self.loading = false;         
        self.activeStep = 4;
        self.setAlert(false);
      })
    },
    getChurchToolsAddisonData: function () {     
      var self = this;

      let data = {
        addisonData: self.addisonData,
        ctPersons: self.persons
      }

      ipcRenderer.send('start-parse-donor-data', data)
      ipcRenderer.on('parsed-donor-data-saved', (event, data) => {
        self.$store.dispatch('UPDATE_MATCHINGADDISONIDS_DATA', data.matchingAddisonSpenderIdInChurchtools)
        self.$store.dispatch('UPDATE_NOMATCHINGADDISONIDS_DATA', data.noMatchingAddisonSpenderIdInChurchtools)
        self.$store.dispatch('UPDATE_NOADDISONIDSINCT_DATA', data.noAddisonSpenderIdInChurchtools)
        self.$store.dispatch('UPDATE_NOADDISONIDSINCTLIST_DATA', data.noAddisonSpenderIdInChurchtoolsIdList)
        self.$store.dispatch('UPDATE_DUPLICATECTSPENDERID_DATA', data.duplicateCTSpenderIDs)
        self.$store.dispatch('UPDATE_DUPLICATEDONORSPENDERID_DATA', data.duplicateDonorSpenderIDs)
        self.$store.dispatch('UPDATE_MISMATCHEDSPENDERIDSINADDISON_DATA', data.misMatchedSpenderIDsInAddison)
        self.$store.dispatch('UPDATE_DONATIONREPORT_DATA', data.donationReportData)

        

        self.loading = false;         
        this.activeStep = 4;
        self.setAlert(false);
      })      
    },
    refreshChurchToolsAddisonData: function () {     
      var self = this;

      let data = {
        addisonData: self.addisonData,
        ctPersons: self.persons
      }

      ipcRenderer.send('start-parse-donor-data', data)
      ipcRenderer.on('parsed-donor-data-saved', (event, data) => {
        self.$store.dispatch('UPDATE_MATCHINGADDISONIDS_DATA', data.matchingAddisonSpenderIdInChurchtools)
        self.$store.dispatch('UPDATE_NOMATCHINGADDISONIDS_DATA', data.noMatchingAddisonSpenderIdInChurchtools)
        self.$store.dispatch('UPDATE_NOADDISONIDSINCT_DATA', data.noAddisonSpenderIdInChurchtools)
        self.$store.dispatch('UPDATE_NOADDISONIDSINCTLIST_DATA', data.noAddisonSpenderIdInChurchtoolsIdList)
        self.$store.dispatch('UPDATE_DUPLICATECTSPENDERID_DATA', data.duplicateCTSpenderIDs)
        self.$store.dispatch('UPDATE_DUPLICATEDONORSPENDERID_DATA', data.duplicateDonorSpenderIDs)
        self.$store.dispatch('UPDATE_MISMATCHEDSPENDERIDSINADDISON_DATA', data.misMatchedSpenderIDsInAddison)
        self.$store.dispatch('UPDATE_DONATIONREPORT_DATA', data.donationReportData)
        self.loading = false;
        self.refreshPersons = false;
        self.setAlert(true, "Data Updated", "success");
      })      
    },    
    generateExcel: function() {
      let self = this
      this.loadingExcel = true;
      ipcRenderer.send('start-generate-excel', this.donationReportData)  
      ipcRenderer.on('generated-excel-saved', (event, file_path) => {
        self.loadingExcel = false
        self.setAlert(false);
      })
    },
    generatePDF: function() {
      let self = this
      this.loadingPdf = true
      ipcRenderer.send('start-generate-report', this.donationReportData)  
      ipcRenderer.on('generated-report-saved', (event, file_path) => {
        self.loadingPdf = false
        self.setAlert(false);
      })
    },
    toggleTemplateDialog: function() {
      document.documentElement.classList.toggle('noScroll');
      this.dialog = !this.dialog;
      window.scrollTo(0, 0);
    },
    restart: function() {
        this.loading = false;         
        this.activeStep = 1;
        this.loggedIn = false;
        this.$store.dispatch('UPDATE_PERSONS', [])
        this.$store.dispatch('UPDATE_ADDISON_DATA', [])
        this.$store.dispatch('UPDATE_MATCHINGADDISONIDS_DATA', [])
        this.$store.dispatch('UPDATE_NOMATCHINGADDISONIDS_DATA', [])
        this.$store.dispatch('UPDATE_NOADDISONIDSINCT_DATA', [])
        this.$store.dispatch('UPDATE_NOADDISONIDSINCTLIST_DATA', [])
        this.$store.dispatch('UPDATE_DUPLICATECTSPENDERID_DATA', [])
        this.$store.dispatch('UPDATE_DUPLICATEDONORSPENDERID_DATA', [])
        this.$store.dispatch('UPDATE_MISMATCHEDSPENDERIDSINADDISON_DATA', [])
        this.$store.dispatch('UPDATE_DONATIONREPORT_DATA', [])
        this.setAlert(false);
    },    
    processExcelUploadFileChange: function(e) {
      this.file = e.target.files[0]
    },
    processReportFileChange: function(e) {
      this.reportFile = e.target.files[0]
    }
  },
  beforeMount(){
    this.setErrorWatch()
  },
  computed: mapState([
    'persons',
    'addisonData',
    'matchingAddisonSpenderIdInChurchtools',
    'noMatchingAddisonSpenderIdInChurchtools',
    'noAddisonSpenderIdInChurchtools',
    'noAddisonSpenderIdInChurchtoolsIdList',
    'duplicateCTSpenderIDs',
    'duplicateDonorSpenderIDs',
    'misMatchedSpenderIDsInAddison',
    'donationReportData'
  ])
};
</script>

<style>
.noScroll {
  overflow: hidden !important;
}
.headline {
  flex-direction: column;
  align-items: left;
}
.headline .v-subheader {
  padding: 0;
}
.initial-slider--line {
  border-bottom: 2px solid #BF360C !important;
}
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
.subdued {
  background-color: rgba(255, 255, 255, 0.5) !important;
  color: #555 !important;
}
.toolbar--midpage .v-toolbar__content {
  padding: 0px !important;
}
.tab--border-bottom .v-tabs__wrapper {
  border-bottom: 1px solid rgba(0,0,0,.12);
}
</style>