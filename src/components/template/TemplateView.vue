<template>
  <v-card>
    <v-toolbar dark fixed color="accent">
      <v-toolbar-title>Edit Template</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat @click="save">
          <v-icon>save</v-icon>&nbsp;Save
        </v-btn>
        <v-btn dark flat @click="close()">
          <v-icon>close</v-icon>&nbsp;Cancel
        </v-btn>
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
                v-model="reportdata.year"
                @focus="highlightElement('reportdata-year')"
                reportdata-year         
              ></v-text-field>
            </v-card-text>
          </v-card>
          <h2 class="my-4">Letter Head</h2>
          <v-card>
            <v-card-text>
              <v-text-field
                label="LetterHead"
                v-model="reportdata.name"
                @focus="highlightElement('reportdata-name')"
                reportdata-name         
              ></v-text-field>
              <div v-for="(item, key) in reportdata.letterhead" v-bind:key="key">
                <v-text-field
                  :label="key"
                  :value="item"
                  v-model="reportdata.letterhead[key]"
                  @focus="highlightElement('reportdata-letterhead-' + key)"
                  v-bind="attributes(`reportdata-letterhead-${key}`)"
                ></v-text-field>
              </div>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
          <h2 class="my-4">Letter</h2>
          <v-card>
            <v-card-text>
              <div v-for="(item, key) in reportdata.letter" v-bind:key="key">
                <div v-if="typeof item == 'object'">
                  <div v-for="(subitem, subkey) in item" v-bind:key="subkey">
                    <div v-if="typeof subitem == 'object'">
                      <div v-for="(childitem, childkey) in subitem" v-bind:key="childkey">
                        <v-text-field
                          :label="childkey"
                          :value="childitem"
                          v-model="reportdata.letter[key][subkey][childkey]"
                          @focus="highlightElement('reportdata-letter-' + key + '-' + subkey + '-' + childkey)"
                          v-bind="attributes(`reportdata-letter-${key}-${subkey}-${childkey}`)"
                        ></v-text-field>
                      </div>
                    </div>
                    <v-textarea v-else-if="key=='body'"
                      :label="subkey"
                      :value="subitem"
                      v-model="reportdata.letter[key][subkey]"
                      @focus="highlightElement('reportdata-letter-' + key + '-' + subkey)"
                      v-bind="attributes(`reportdata-letter-${key}-${subkey}`)"
                    >
                    </v-textarea>
                    <v-text-field v-else
                      :label="subkey"
                      :value="subitem"
                      v-model="reportdata.letter[key][subkey]"
                      @focus="highlightElement('reportdata-letter-' + key + '-' + subkey)"
                      v-bind="attributes(`reportdata-letter-${key}-${subkey}`)"
                    ></v-text-field>
                  </div>
                </div>
                <v-text-field v-else
                  :label="key"
                  :value="item"
                  v-model="reportdata.letter[key]"
                  @focus="highlightElement('reportdata-letter-' + key)"
                  v-bind="attributes(`reportdata-letter-${key}`)"
                ></v-text-field>
              </div>
            </v-card-text>
          </v-card>
          <h2 class="my-4">Report</h2>
          <v-card>
            <v-card-text>
              <div v-for="(item, key) in reportdata.report" v-bind:key="key">           
                <v-text-field
                  :label="key"
                  :value="item"
                  v-model="reportdata.report[key]"
                  @focus="highlightElement('reportdata-report-' + key)"
                  v-bind="attributes(`reportdata-report-${key}`)"
                ></v-text-field>
              </div>
              <h3>Options</h3>
              <v-checkbox
                v-model="reportdata.reportsettings.showSpenderNr"
                :value="reportdata.reportsettings.showSpenderNr"
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
                v-model="reportdata.footer.title"
                @focus="highlightElement('reportdata-footer-title')"
                v-bind="attributes(`reportdata-report-title`)"
              >
              </v-text-field>
              <div v-for="(item, key) in reportdata.footer.content" v-bind:key="key">           
                <v-textarea
                  :label="key"
                  :value="item"
                  v-model="reportdata.footer.content[key]"
                  @focus="highlightElement('reportdata-footer-content-' + key)"
                  v-bind="attributes(`reportdata-footer-content-${key}`)"
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
                  <h3 id="reportdata.name" reportdata-name class="mb-2">{{reportdata.name}}</h3>
                  <div class="letterhead--subheader">
                    <p v-for="(p, key) in reportdata.letterhead" v-bind:key="key" v-if="p!=''"  :id="'reportdata.letterhead.'+ key" v-bind="attributes(`reportdata-letterhead-${key}`)">{{p}}</p> 
                  </div>
                </div>
                <div class="mt-4">
                  <br>
                  <br>
                  Herr<br>
                  Max Musterman<br>
                  Strases 61<br>
                  11111 Frankfurt
                  <br>
                  <br>
                  <br>
                </div>
                <div class="mt-4 text-xs-center letter--header">
                  <h4 id="reportdata.letter.header.title" reportdata-letter-header-title>{{reportdata.letter.header.title}}</h4>
                  <p v-for="(subheader, key) in reportdata.letter.header.subheaders" v-bind:key="key" v-if="subheader!=''" v-bind="attributes(`reportdata-letter-header-subheaders-${key}`)"><small>{{subheader}}</small></p>
                  <hr class="mt-1">
                </div>
                <div class="mt-4">
                  <p>
                    <span id="reportdata.letter.formOfAddress" reportdata-letter-formOfAddress>{{reportdata.letter.formOfAddress}}</span><br>
                    Herr Max Musterman, Strases 61, 11111 Frankfurt
                  </p>
                  <p>
                    <span id="reportdata.letter.totalAmountText" reportdata-letter-totalAmountText>{{reportdata.letter.totalAmountText}}</span><br>
                    *** 1.400,00 € *** / ***eintausendvierhundert Euro*** / 01.01.<span reportdata-year>{{reportdata.year}}</span> bis 31.12.<span reportdata-year>{{reportdata.year}}</span>
                  </p>
                </div>
                <div class="mt-4">
                  <p v-for="(p, key) in reportdata.letter.body" v-bind:key="key" v-if="p!=''"  :id="'reportdata.letter.body.'+ key" v-bind="attributes(`reportdata-letter-body-${key}`)">{{p}}</p>
                </div>
                <div class="mt-4">
                  <v-layout>
                    <v-flex xs-6>
                      <span id="reportdata.letter.signature.city" reportdata-letter-signature-city>{{reportdata.letter.signature.city}}</span> den <span reportdata-letter-signature-date>{{getFullDate(reportdata.letter.signature.date)}}</span>
                    </v-flex>
                    <v-flex xs-6 class="text-xs-center">
                      <hr>
                      <span id="reportdata.letter.signature.pastor" reportdata-letter-signature-pastor>{{reportdata.letter.signature.pastor}}</span><br v-if="reportdata.letter.signature.pastor != ''">
                      <span reportdata-name>{{reportdata.name}}</span>
                    </v-flex>
                  </v-layout>
                </div>
                <div class="footer">
                  <p class="footer--title" id="reportdata.footer.title" reportdata-footer-title>{{reportdata.footer.title}}</p>
                  <p v-for="(item, key) in reportdata.footer.content" v-bind:key="key"  v-if="item!=''"  :id="'reportdata.footer.content.'+ key" v-bind="attributes(`reportdata-footer-content-${key}`)">{{item}}</p>
                </div>
              </v-card-text>
            </v-card>
            <v-divider></v-divider>
            <v-card class="report--page pa-4">
              <v-card-text class="">
                <h3 id="reportdata.report.title" reportdata-report-title>{{reportdata.report.title}}</h3>
                <v-layout class="my-4">
                  <v-flex xs2><span  id="reportdata.report.formOfAddress" reportdata-report-formOfAddress>{{reportdata.report.formOfAddress}}</span></v-flex>
                  <v-flex xs6>
                    Herr<br>
                    Max Musterman<br>
                    Strases 61<br>
                    11111 Frankfurt
                  </v-flex>
                  <v-flex xs4 class="text-xs-right"><span v-show="reportdata.reportsettings.showSpenderNr">Spender-Nr: 1</span></v-flex>
                </v-layout>
                <table class="reportDataTable mt-4">
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
                      <td>Totalsumme</td>
                      <td></td>
                      <td></td>
                      <td class="text-xs-right">1.400,00 €</td>
                    </tr>
                  </tbody>
                </table>
                <div class="footer">
                  <p class="footer--title" reportdata-footer-title>{{reportdata.footer.title}}</p>
                  <p v-for="(item, key) in reportdata.footer.content" v-bind:key="key" v-if="item!=''"  v-bind="attributes(`reportdata-footer-content-${key}`)">{{item}}</p>
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
const path = require("path");
const fs = require('fs');
const filePath = path.join(__dirname, "..", "../template/template.json");

export default {
  name: "TemplateView",
  data: () => ({
    reportdata: {}
  }),
  methods: {
    loadData: function() {
      let rawdata = fs.readFileSync(filePath);  
      let data = JSON.parse(rawdata);  
      this.reportdata = data
    },
    close() {
      this.$emit('close')
    },
    save: function() {
      let data = JSON.stringify(this.reportdata)
      this.$emit('close')
      fs.writeFile(filePath, data , function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });
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
    }
  },
  beforeMount(){
    this.loadData()
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

  .reportDataTable {
    border-collapse: collapse;
    font-size: 12px;
    width: 100%;
    margin-top: 50px !important;
  }
  .reportDataTable th{
    text-align: left;
    border-bottom: 2px solid #555;
  }
  .reportDataTable th .subheader {
    font-size: 11px;
    color: #aaa;
  }
  .reportDataTable td{
    padding: 5px 3px;
    border-bottom: 1px solid #ccc;
  }
  .reportDataTable .totalRow {
    border-top: 2px solid #555;
    border-bottom: 0px !important;
    font-weight: bold;
  }
  .reportDataTable .totalRow td {
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
