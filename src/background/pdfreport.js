const q = require('q');
const dialog = require('electron').remote.dialog
const fs = require('fs')
const PDFDocument = require('./pdfkit-tables')
const errors = require("../config/errors").default;
const isDevMode = process.execPath.match(/[\\/]electron/);
const path = require("path");

const fontSizeHeader = 14
const fontSizeSubHeader = 12
const fontSizeDefault = 10
const fontSizeSmall = 8
const pageMargin = 40
const pageWidth = 595.28 - (pageMargin * 2)
const filePath = path.join(__dirname, "..", "/template/template.json");

import keys from '../config/LocalForageKeys'
import localFileManager from '../utilities/localFileManager'

let fonts;

if (isDevMode) {
  fonts = {
    Roboto: {
      normal: 'src/background/fonts/Roboto-Regular.ttf',
      bold: 'src/background/fonts/Roboto-Medium.ttf',
      italics: 'src/background/fonts/Roboto-Italic.ttf',
      bolditalics: 'src/background/fonts/Roboto-Italic.ttf'
    },
  };
}
else {
  fonts = {
    Roboto: {
      normal: `${__dirname}\\fonts\\Roboto-Regular.ttf`,
      bold: `${__dirname}\\fonts\\Roboto-Medium.ttf`,
      italics: `${__dirname}\\fonts\\Roboto-Italic.ttf`,
      bolditalics: `${__dirname}\\fonts\\Roboto-Italic.ttf`
    },
};
}

function getTemplateData () {
  let data = localFileManager.get(window.localStorage, keys.TEMPLATE);
  return data
}

function addLetterHead(doc, templateData) {
  doc.fontSize(fontSizeHeader)
  .text(templateData.name, {'align': 'center'})
  doc.moveDown(0.25)
  doc.fontSize(fontSizeDefault)
  Object.keys(templateData.letterhead).forEach(function(key) {
    if (templateData.letterhead[key] != "") {
      doc.text(templateData.letterhead[key], {'align': 'center'});
    } 
  });
}
function addAddress(doc, person, mitAnrede = true) {
  doc.fontSize(fontSizeDefault)
  if (person.anrede && mitAnrede) {
    doc.text(person.anrede, {'align': 'left'})
  }
  doc.text(person.vorname + " " + person.name)
  if (person.zusatz) {
    doc.text(person.zusatz)
  }
  doc.text(person.strasse)
  doc.text(person.plz + " " + person.ort)
}
function addHeader(doc, templateData) {
  doc.font('FontBold').fontSize(fontSizeSubHeader)
  .text(templateData.letter.header.title, {'align': 'center'});

  Object.keys(templateData.letter.header.subheaders).forEach(function(key) {
    if (templateData.letter.header.subheaders[key] != "") {
      doc.font('FontNormal').fontSize(fontSizeSmall).text(templateData.letter.header.subheaders[key], {'align': 'center'});
    } 
  });
}
function addFormOfAddress(doc, person, templateData) {
  doc.fontSize(fontSizeDefault)
  .text(templateData.letter.formOfAddress, {'align': 'left'})
  .text(person.vorname + " " + person.name + ", " + person.strasse + ", " + person.plz + " " + person.ort, {'align': 'left'})
}
function addDonationAsText(doc, person, templateData) {
  //let year = (new Date()).getFullYear()
  doc.fontSize(fontSizeDefault)
  .text(templateData.letter.totalAmountText, {'align': 'left'})
  .text('***' + person.total + '*** / *** ' + person.totalText + ' Euro*** /  01.01.' + templateData.year + ' bis 31.12.' + templateData.year, {'align': 'left'})
}
function addBodyText(doc, templateData) {
  doc.fontSize(fontSizeDefault);

  Object.keys(templateData.letter.body).forEach(function(key) {
    if (templateData.letter.body[key] != "") {
      doc.text(templateData.letter.body[key], {'align': 'left'});
      doc.moveDown();
    } 
  });
}
function addSignatureBlock(doc, templateData) {
  let x = doc.x;
  let y = doc.y;
  let fullDate;
  let signatureLineStart = (pageWidth / 3)
  let signatureLineEnd = ((pageWidth / 3) * 2)
  let signatureWidth = ((pageWidth / 3) * 2)

  if (templateData.letter.signature.cashier != "" && templateData.letter.signature.pastor != "") {
    signatureWidth = (pageWidth / 3)
  }

  if (templateData.letter.signature.date != "" && templateData.letter.signature.date != undefined) {
    fullDate = templateData.letter.signature.date 
  }
  else {
    let date = new Date() 
    fullDate = date.getDate().toString().padStart(2, "0") + '.' + (date.getMonth() + 1).toString().padStart(2, "0") + '.' + date.getFullYear()
  }
  doc.fontSize(fontSizeDefault)

  doc.text(templateData.letter.signature.city + ' den ' + fullDate, doc.x, doc.y, { 'width': signatureWidth, 'align': 'left'})
  .moveDown(0.75);

  //Draw Lines
  if (templateData.letter.signature.pastor != "" && templateData.letter.signature.cashier != "") {
    doc.moveTo(doc.x + signatureLineStart, doc.y - fontSizeDefault)
    .lineTo( doc.x + signatureLineEnd  - 5, doc.y - fontSizeDefault)
    .lineWidth(1)
    .stroke()
    
    doc.moveTo(doc.x + signatureLineEnd + 5, doc.y - fontSizeDefault)
    .lineTo( doc.x + signatureLineEnd + signatureWidth, doc.y - fontSizeDefault)
    .lineWidth(1)
    .stroke()
  }
  else {
    doc.moveTo(doc.x + signatureLineStart, doc.y - fontSizeDefault)
    .lineTo( doc.x + signatureLineStart + signatureLineEnd, doc.y - fontSizeDefault)
    .lineWidth(1)
    .stroke()
  }
  //Add Text
  if (templateData.letter.signature.pastor != "" && templateData.letter.signature.cashier != "") {
    doc.text(templateData.letter.signature.cashier, doc.x + signatureWidth - 5, doc.y - 2, { 'width': signatureWidth, 'align': 'center'})
    .text(templateData.name  + " 1", doc.x, doc.y, { 'width': signatureWidth, 'align': 'center'})
    .moveUp(2)
    doc.text(templateData.letter.signature.pastor, doc.x + signatureWidth + 5, doc.y - 2, { 'width': signatureWidth, 'align': 'center'})
    .text(templateData.name  + " 1", doc.x, doc.y, { 'width': signatureWidth, 'align': 'center'})
    .moveUp(2);
  }
  else {
    if (templateData.letter.signature.pastor != "" || templateData.letter.signature.cashier != "") {
      let _text = templateData.letter.signature.pastor != "" ? templateData.letter.signature.pastor : templateData.letter.signature.cashier
      doc.text( _text, doc.x + signatureWidth / 2, doc.y, { 'width': signatureWidth, 'align': 'center'});
      doc.text(templateData.name, doc.x, doc.y, { 'width': signatureWidth, 'align': 'center'});
    }
    else {
      doc.text(templateData.name, doc.x + signatureWidth / 2, doc.y, { 'width': signatureWidth, 'align': 'center'});
    }
  }
}
function addAnlageHeader(doc, person, templateData) {
  
  doc.fontSize(fontSizeDefault).font('FontBold')
  .text(templateData.report.title, { 'width': pageWidth, 'align': 'left'})
  .font('FontNormal')
  .text(templateData.report.subtitle, { 'width': pageWidth, 'align': 'left'})
  .moveDown(2);

  let startX = doc.x;
  let startY = doc.y;
  doc.font('FontNormal')
  .text(templateData.report.formOfAddress, startX, startY, { 'width': 75, 'align': 'left'})
  doc.x = startX + 75;
  doc.y = startY;
  addAddress(doc, person, false)

  if (templateData.reportsettings.showSpenderNr) {
    doc.text('Spender-Nr.: ' + person.optigem_nr, startX + (pageWidth - 100), startY, { 'width': 100, 'align': 'right'})
  }
  
  doc.x = startX;
}
function addAnlageTable(doc, report) {
  const table = {
    headers: [
      'Datum der Zuwendung', 
      'Art der Zuwendung', 
      'Verzicht auf die Erstattung von Aufwendungen', 
      'Betrag'
    ],
    rows: [
    ],
    subheaders: [
      '',
      '(Geldzuwendung/Mitgliedsbeitrag)',
      ' (ja/nein)',
      ''
    ]
  };

  for (let i = 0; i <= 39; i++) {
    if (report["datum_" + i.toString().padStart(2, 0)] != null) {
      table.rows.push([report["datum_" + i.toString().padStart(2, 0)], report["artderzuwendung_" + i.toString().padStart(2, 0)], report["verzichtauferstattung_" + i.toString().padStart(2, 0)], report["spende_" + i.toString().padStart(2, 0)] ]);
    }
  } 
  table.rows.push(['Gesamtsumme', '', '', report.total ])

  doc.table(table, {
      prepareHeader: () => doc.font('FontBold').fontSize(8).lineGap(1),
      prepareRow: (row, i) => doc.font('FontNormal').fontSize(8).lineGap(0)
  });
}
function addFooter(doc, templateData) {
  doc.rect(pageMargin, 691.89, pageWidth, 100)
  .stroke();  
  doc.x = pageMargin + 10;
  doc.y = 701.89;
  doc.fontSize(fontSizeSmall)
  .font('FontBold')
  .text(templateData.footer.title, { 'width': pageWidth - 20, 'align': 'left'})
  .font('FontNormal')

  Object.keys(templateData.footer.content).forEach(function(key) {
    if (templateData.footer.content[key] != "") {
      doc.text(templateData.footer.content[key], { 'width': pageWidth - 20, 'align': 'left'});
      doc.moveDown();
    } 
  });
}
function getPDFDocument(reports, templateData) {
  let numberOfReports = reports.length;
  let doc = new PDFDocument({size: 'A4', margin: pageMargin})
  doc.registerFont('FontNormal', fonts.Roboto.normal)
  doc.registerFont('FontBold', fonts.Roboto.bold)
  doc.lineGap(1);

  doc.font('FontNormal');
  reports.forEach((report, index) => {
    addLetterHead(doc, templateData);
    doc.moveDown(5);
    addAddress(doc, report);
    doc.moveDown(5);
    addHeader(doc, templateData);
    doc.moveDown(0.5);
    doc.moveTo(pageMargin, doc.y)
      .lineTo(pageMargin + pageWidth , doc.y)
      .lineWidth(1)
      .stroke()
    doc.moveDown(2);
    addFormOfAddress(doc, report, templateData);
    doc.moveDown();
    addDonationAsText(doc, report, templateData);
    doc.moveDown();
    addBodyText(doc, templateData);
    doc.moveDown(2);
    addSignatureBlock(doc, templateData);
    addFooter(doc, templateData);
    doc.addPage()
    addAnlageHeader(doc, report, templateData)
    doc.moveDown(4)
    addAnlageTable(doc, report, templateData);    
    addFooter(doc, templateData);

    if(index < (numberOfReports - 1)){
      doc.addPage()
    }
  })
  // Finalize PDF file
  doc.end()
  return doc
}

async function generatePDFReport (reports) {
  var deferred = q.defer();
  let templateData = getTemplateData();
  let pdf = getPDFDocument(reports, templateData)
  let year = (new Date()).getFullYear();
  let filePath = (reports.length > 1) ? "~/fcg-spendenbescheinigung-" + templateData.year + ".pdf" : "~/fcg-spendenbescheinigung-" + templateData.year + "-" + reports[0].name + "-(" + reports[0].optigem_nr  + ").pdf"
  
  dialog.showSaveDialog(
    {
      defaultPath: filePath,
      filters: [{
        name: 'Adobe PDF',
        extensions: ['pdf']
      }]
    }, function(file_path) {
      if (file_path) {
        const writeStream = fs.createWriteStream(file_path);
        pdf.pipe(writeStream);
    
        writeStream.on("finish", function() {
          deferred.resolve(file_path);
        });
    
        writeStream.on("error", function(error) {
          deferred.reject({message: error });
        });
      }
      else {
        deferred.reject({message: errors.E002});
      }
    })
  return deferred.promise;
};

module.exports = {
  generatePDFReport: generatePDFReport
}