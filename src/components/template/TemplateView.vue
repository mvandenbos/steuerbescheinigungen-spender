<template>
  <v-card>
    <v-toolbar dark fixed color="accent">
      <v-toolbar-title>{{$t('editTemplate')}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat @click="close()">
          <v-icon>close</v-icon>&nbsp;{{ $t('cancel') }}
        </v-btn>
        <v-btn dark flat @click="save">
          <v-icon>save</v-icon>&nbsp;{{ $t('save') }}
        </v-btn>
        <v-menu bottom left style="z-index:999;">
          <v-btn slot="activator" icon dark>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-subheader>{{$t('editTemplate')}}</v-subheader>
            <v-list-tile  @click="importSettings()">
              <v-list-tile-avatar>
                <v-icon primary >import_export</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{$t('import')}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile  @click="exportSettings()">
              <v-list-tile-avatar>
                <v-icon primary fab>get_app</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{$t('export')}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile  @click="resetLocalTemplate()">
              <v-list-tile-avatar>
                <v-icon primary fab>refresh</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{$t('resetToDefault')}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>        
      </v-toolbar-items>            
    </v-toolbar>
    <v-layout fluid wrap style="background-color: #EFEFEF; margin-top: 65px;">
      <v-flex lg6>
        <div class="ma-4">
          <h2 class="my-4">Report Year</h2>
          <v-card>
            <v-card-text>
              <v-text-field
                label="Year"
                v-model="template.year"
                @focus="highlightElement('template-year')"
                template-year         
              ></v-text-field>
            </v-card-text>
          </v-card>
          <h2 class="my-4">Letter Head</h2>
          <v-card>
            <v-card-text>
              <v-text-field
                label="LetterHead"
                v-model="template.name"
                @focus="highlightElement('template-name')"
                template-name         
              ></v-text-field>
              <div v-for="(item, key) in template.letterhead" v-bind:key="key">
                <v-text-field
                  :label="key"
                  :value="item"
                  v-model="template.letterhead[key]"
                  @focus="highlightElement('template-letterhead-' + key)"
                  v-bind="attributes(`template-letterhead-${key}`)"
                ></v-text-field>
              </div>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
          <h2 class="my-4">Letter</h2>
          <v-card>
            <v-card-text>
              <div v-for="(item, key) in template.letter" v-bind:key="key">
                <div v-if="typeof item == 'object'">
                  <div v-for="(subitem, subkey) in item" v-bind:key="subkey">
                    <div v-if="typeof subitem == 'object'">
                      <div v-for="(childitem, childkey) in subitem" v-bind:key="childkey">
                        <v-text-field
                          :label="childkey"
                          :value="childitem"
                          v-model="template.letter[key][subkey][childkey]"
                          @focus="highlightElement('template-letter-' + key + '-' + subkey + '-' + childkey)"
                          v-bind="attributes(`template-letter-${key}-${subkey}-${childkey}`)"
                        ></v-text-field>
                      </div>
                    </div>
                    <v-textarea v-else-if="key=='body'"
                      :label="subkey"
                      :value="subitem"
                      v-model="template.letter[key][subkey]"
                      @focus="highlightElement('template-letter-' + key + '-' + subkey)"
                      v-bind="attributes(`template-letter-${key}-${subkey}`)"
                    >
                    </v-textarea>
                    <v-text-field v-else
                      :label="subkey"
                      :value="subitem"
                      v-model="template.letter[key][subkey]"
                      @focus="highlightElement('template-letter-' + key + '-' + subkey)"
                      v-bind="attributes(`template-letter-${key}-${subkey}`)"
                    ></v-text-field>
                  </div>
                </div>
                <v-text-field v-else
                  :label="key"
                  :value="item"
                  v-model="template.letter[key]"
                  @focus="highlightElement('template-letter-' + key)"
                  v-bind="attributes(`template-letter-${key}`)"
                ></v-text-field>
              </div>
            </v-card-text>
          </v-card>
          <h2 class="my-4">Report</h2>
          <v-card>
            <v-card-text>
              <div v-for="(item, key) in template.report" v-bind:key="key">           
                <v-text-field
                  :label="key"
                  :value="item"
                  v-model="template.report[key]"
                  @focus="highlightElement('template-report-' + key)"
                  v-bind="attributes(`template-report-${key}`)"
                ></v-text-field>
              </div>
              <h3>Options</h3>
              <v-checkbox
                v-model="template.reportsettings.showSpenderNr"
                :value="template.reportsettings.showSpenderNr"
                label="Show Spender-Nr. in Report"
                type="checkbox"
                required
              ></v-checkbox>
            </v-card-text>
          </v-card>
          <h2 class="my-4">Footer</h2>
          <v-card>
            <v-card-text>
              <v-text-field
                label="Footer Title"
                v-model="template.footer.title"
                @focus="highlightElement('template-footer-title')"
                v-bind="attributes(`template-report-title`)"
              >
              </v-text-field>
              <div v-for="(item, key) in template.footer.content" v-bind:key="key">           
                <v-textarea
                  :label="key"
                  :value="item"
                  v-model="template.footer.content[key]"
                  @focus="highlightElement('template-footer-content-' + key)"
                  v-bind="attributes(`template-footer-content-${key}`)"
                ></v-textarea>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-flex>

      <!-- REPORT PREVIEW -->

      <v-flex lg6>
        <div  class="report">
          <h2 class="ma-4">
            <v-icon>print</v-icon>
            Report Preview
          </h2>
          <div class="pa-4 printpreview">
            <v-card class="report--page pa-4 mb-4">
              <v-card-text class="">
                <div class="text-xs-center">
                  <h3 id="template.name" template-name class="mb-2">{{template.name}}</h3>
                  <div class="letterhead--subheader">
                    <p v-for="(p, key) in template.letterhead" v-bind:key="key" v-if="p!=''"  :id="'template.letterhead.'+ key" v-bind="attributes(`template-letterhead-${key}`)">{{p}}</p> 
                  </div>
                </div>
                <div class="mt-4">
                  <br>
                  <br>
                  Herr<br>
                  Max Musterman<br>
                  Strasse 61<br>
                  11111 Frankfurt
                  <br>
                  <br>
                  <br>
                </div>
                <div class="mt-4 text-xs-center letter--header">
                  <h4 id="template.letter.header.title" template-letter-header-title>{{template.letter.header.title}}</h4>
                  <p v-for="(subheader, key) in template.letter.header.subheaders" v-bind:key="key" v-if="subheader!=''" v-bind="attributes(`template-letter-header-subheaders-${key}`)"><small>{{subheader}}</small></p>
                  <hr class="mt-1">
                </div>
                <div class="mt-4">
                  <p>
                    <span id="template.letter.formOfAddress" template-letter-formOfAddress>{{template.letter.formOfAddress}}</span><br>
                    Herr Max Musterman, Strases 61, 11111 Frankfurt
                  </p>
                  <p>
                    <span id="template.letter.totalAmountText" template-letter-totalAmountText>{{template.letter.totalAmountText}}</span><br>
                    *** 1.400,00 € *** / ***eintausendvierhundert Euro*** / 01.01.<span template-year>{{template.year}}</span> bis 31.12.<span template-year>{{template.year}}</span>
                  </p>
                </div>
                <div class="mt-4">
                  <p v-for="(p, key) in template.letter.body" v-bind:key="key" v-if="p!=''"  :id="'template.letter.body.'+ key" v-bind="attributes(`template-letter-body-${key}`)">{{p}}</p>
                </div>
                <div class="mt-4">
                  <v-layout>
                    <v-flex xs-6>
                      <span id="template.letter.signature.city" template-letter-signature-city>{{template.letter.signature.city}}</span> den <span template-letter-signature-date>{{getFullDate(template.letter.signature.date)}}</span>
                    </v-flex>
                    <v-flex xs-6 class="text-xs-center signature-block" v-if="template.letter.signature.cashier != ''">
                      <hr>
                      <span id="template.letter.signature.cashier" template-letter-signature-cashier>{{template.letter.signature.cashier}}</span><br>
                      <span template-name>{{template.name}}</span>
                    </v-flex>
                    <v-flex xs-6 class="text-xs-center signature-block" v-if="template.letter.signature.pastor != ''">
                      <hr>
                      <span id="template.letter.signature.pastor" template-letter-signature-pastor>{{template.letter.signature.pastor}}</span><br v-if="template.letter.signature.pastor != ''">
                      <span template-name>{{template.name}}</span>
                    </v-flex>
                    <v-flex xs-6 class="text-xs-center signature-block" v-if="template.letter.signature.pastor == '' && template.letter.signature.cashier == ''">
                      <hr>
                      <span template-name>{{template.name}}</span>
                    </v-flex>
                  </v-layout>
                </div>
                <div class="footer">
                  <p class="footer--title" id="template.footer.title" template-footer-title>{{template.footer.title}}</p>
                  <p v-for="(item, key) in template.footer.content" v-bind:key="key"  v-if="item!=''"  :id="'template.footer.content.'+ key" v-bind="attributes(`template-footer-content-${key}`)">{{item}}</p>
                </div>
              </v-card-text>
            </v-card>
            <v-divider></v-divider>
            <v-card class="report--page pa-4">
              <v-card-text class="">
                <h3 id="template.report.title" template-report-title>{{template.report.title}}</h3>
                <v-layout class="my-4">
                  <v-flex xs2><span  id="template.report.formOfAddress" template-report-formOfAddress>{{template.report.formOfAddress}}</span></v-flex>
                  <v-flex xs6>
                    Herr<br>
                    Max Musterman<br>
                    Strases 61<br>
                    11111 Frankfurt
                  </v-flex>
                  <v-flex xs4 class="text-xs-right"><span v-show="template.reportsettings.showSpenderNr">Spender-Nr: 1</span></v-flex>
                </v-layout>
                <table class="templateTable mt-4">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>
                        Art der Zuwendung<br>
                        <span class="subheader">(Geldzuwendung/ Mitgliedsbeitrag)</span>
                      </th>
                      <th>
                        Verzicht auf die Erstattung<br>
                        von Aufwendungen <span class="subheader">(ja/nein)</span>
                      </th>
                      <th class="text-xs-right">Betrag</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in [
                    {'date': `01.01.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},              
                    {'date': `01.02.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.03.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.04.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.05.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.06.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.07.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.08.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.09.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.10.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.11.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    {'date': `01.12.${getLastYear()}`, 'type': 'Geldzuwendung', 'waive': 'nein', 'amount': '200,00 €'},
                    ]" v-bind:key="item.date"
                    >
                    <td class="text-xs-left">{{ item.date }}</td>
                    <td class="text-xs-left">{{ item.type }}</td>
                    <td class="text-xs-left">{{ item.waive }}</td>
                    <td class="text-xs-right">{{ item.amount }}</td>
                    </tr>
                    <tr class="totalRow">
                      <td>Gesamtsumme</td>
                      <td></td>
                      <td></td>
                      <td class="text-xs-right">1.400,00 €</td>
                    </tr>
                  </tbody>
                </table>
                <div class="footer">
                  <p class="footer--title" template-footer-title>{{template.footer.title}}</p>
                  <p v-for="(item, key) in template.footer.content" v-bind:key="key" v-if="item!=''"  v-bind="attributes(`template-footer-content-${key}`)">{{item}}</p>
                </div>
              </v-card-text>
            </v-card>        
          </div> 
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>
 
<script> 
import { mapState } from 'vuex'
const path = require("path");
const fs = require('fs');
const filePath = path.join(__dirname, "..", "../template/template.json");
import keys from '../../config/LocalForageKeys'
import localFileManager from '../../utilities/localFileManager'

export default {
  name: "TemplateView",
  data() {
    return {
    }
  },
  computed: mapState([
    'template'
  ]),
  methods: {
    loadData: function() {
      let rawdata = fs.readFileSync(filePath);  
      let data = JSON.parse(rawdata);  
      this.template = data
    },
    close() {
      this.$emit('close')
    },
    save: function() {
      localFileManager.save(localStore, keys.TEMPLATE, this.template)   
      this.$store.dispatch('UPDATE_TEMPLATE', this.template)
      this.$emit('close')
    },
    highlightElement: function(el) {
      var elements = document.getElementsByClassName('highlight');
      while(elements.length > 0){
          elements[0].classList.remove('highlight');
      }

      var elementsToHighlight = document.querySelectorAll(`[${el}]`);
      for (var i = 0; i < elementsToHighlight.length; i++) {
        elementsToHighlight[i].classList.add('highlight');
      }
    },
    attributes: function(root) {
      return {[`${root}`]: ''}
    },
    getCurrentYear: function() {
      return (new Date()).getFullYear()
    },
    getLastYear: function() {
      return (new Date()).getFullYear() - 1
    },
    getFullDate: function(date) {  
      if (date != "" && date != undefined) {
        return date;
      }
      else {
        let _date = new Date()
        return _date.getDate().toString().padStart(2, "0") + '.' + (_date.getMonth() + 1).toString().padStart(2, "0") + '.' + _date.getFullYear()
      }
    },
    resetLocalTemplate: function () {
      localFileManager.resetItem(localStore, keys.TEMPLATE, this.$store, 'UPDATE_TEMPLATE')
    },
    importSettings: function () {
      localFileManager.importJSONFile(localStore, keys.TEMPLATE, this.$store, 'UPDATE_TEMPLATE')
    },
    exportSettings: function () {
      localFileManager.exportJSONFile(localStore, keys.TEMPLATE);
    },
  },
  beforeMount(){
    //this.loadData()
  },
}
</script> 

<style scoped>
  .report {
    position: sticky;
    top: 8px;
  }
  .printpreview {
    background-color: #cccccc;
    box-shadow: inset 0 0 10px #aaa;
    max-width: 842px;   
  }
  .report--page {
    min-height: 1123px; 
    max-height: 1123px;
    height: 1123px;    
    max-width: 794px;
    min-width: 794px;  
    width: 794px;  
    padding-bottom: 250px !important;    
  }
  .letter--header p { 
    margin: 0px;
    padding: 0px;
    line-height: 100%;
  }
  .letterhead--subheader, .letterhead--subheader p {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 5px;
    padding: 0px;
  }
  .signature-block{
    padding: 20px 0 0 5px;
  }
  .templateTable {
    border-collapse: collapse;
    font-size: 12px;
    width: 100%;
    margin-top: 50px !important;
  }
  .templateTable th{
    text-align: left;
    border-bottom: 2px solid #555;
  }
  .templateTable th .subheader {
    font-size: 11px;
    color: #aaa;
  }
  .templateTable td{
    padding: 5px 3px;
    border-bottom: 1px solid #ccc;
  }
  .templateTable .totalRow {
    border-top: 2px solid #555;
    border-bottom: 0px !important;
    font-weight: bold;
  }
  .templateTable .totalRow td {
    border-bottom: 0px !important;
  }
  .footer {
    margin-top: 40px;
    border: 1px solid #555;
    font-size: 11px;
    padding: 11px;
    position: absolute;
    bottom: 50px;
    width: calc(100% - 80px);
  }
  .footer--title {
    font-size: 11px;
    font-weight: bold;
  }
  .footer p {
    margin-bottom: 10px;
  }
</style>
<style>
  textarea {
    line-height: 24px !important;
  }   
  .highlight {
    /* background-color: #07204e !important;
    color: #FFF !important; */
  }
  p.highlight, span.highlight, div.highlight, h3.highlight, h4.highlight {
    margin-top: -3px;
    margin-left: -3px;
    margin-right: -3px;
    /* padding-left: 10px;
    padding-right: 10px; */
    border: 3px dotted #BF360C;
    color: #BF360C !important;
  }
</style>
