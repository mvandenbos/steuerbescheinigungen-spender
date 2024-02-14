const ipcRenderer = require('electron').ipcRenderer;
const addisonparser = require('./addisonparser');
const excelreport = require('./excelreport');
const pdfreport = require('./pdfreport')
const donors = require('./donors');
const existingreport = require('./existingreport');

ipcRenderer.on("generate-excel", (event, data) => {
  excelreport.generateExcelReport(data).then((file_path) => {
    ipcRenderer.send("generate-excel-complete", file_path);
  }, function(err) {
    ipcRenderer.send("background-error", err)
  })
})

ipcRenderer.on("generate-report", (event, reports) => {
  pdfreport.generatePDFReport(reports).then((file_path) => {
    ipcRenderer.send("generate-report-complete", file_path);
  }, function(err) {
    ipcRenderer.send("background-error", err)
  })
})


ipcRenderer.on("generate-individual-reports", (event, reports) => {
  pdfreport.generateIndividualPDFReports(reports).then((file_path) => {
    ipcRenderer.send("generate-individual-reports-complete", file_path);
  }, function(err) {
    ipcRenderer.send("background-error", err)
  })
})

ipcRenderer.on("parse-addison-data", (event, file_path) => {
  addisonparser.getDonorsFromAddisonExport(file_path).then((data)=> {
    ipcRenderer.send("parse-addison-data-complete", data);
  }, function(err) {
    ipcRenderer.send("background-error", err)
  })
})

ipcRenderer.on("parse-donor-data", (event, data) => {
  donors.getChurchtoolsAndAddisonData(data.addisonData, data.ctPersons).then((data)=> {
    ipcRenderer.send("parse-donor-data-complete", data);
  }, function(err) {
    ipcRenderer.send("background-error", err)
  })
})

ipcRenderer.on("parse-existing-report", (event, file_path) => {
  existingreport.getDatafromExistingReport(file_path).then((data)=> {
    ipcRenderer.send("parse-existing-report-complete", data);
  }, function(err) {
    ipcRenderer.send("background-error", err)
  })
})
