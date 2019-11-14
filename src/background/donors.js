const q = require('q')
const inWordsDe = require("in-words").de
import currencyFormater from '../utilities/currencyFormater'

let getChurchtoolsAndAddisonData = function(addison, ctPersons) {
  var deferred = q.defer();
  //#region constants
  const addisonSpenderID = "Belegnummer 2";

  const arrayFind = arr => fn =>
    arr.reduce((acc, item, index) => {
      //  We pass the finder function the item and the index
      if (fn(item, index)) acc.push(item);
      return acc;
    }, []);
  //#endregion

  const _addisonData = Object.values(addison);
  const _ctPersons = Object.values(ctPersons);
  
  const addisonFinder = arrayFind(_addisonData);
  const ctPersonFinder = arrayFind(_ctPersons);
  const donorSpenderIds = [...new Set(_addisonData.map(item => item[addisonSpenderID]))];
  const donorSpenderIdFinder = arrayFind(donorSpenderIds);
 
  const matchingAddisonSpenderIdInChurchtools = () => {
    let ctMatches = _ctPersons.reduce((matches, person) => {
      let donorMatches = donorSpenderIdFinder(spenderId => spenderId == person.optigem_nr);
      if (donorMatches.length > 0) matches.push(person);
      return matches;
    }, []);
    return ctMatches;
  };

  const noMatchingAddisonSpenderIdInChurchtools = () => {
    let noCtMatches = _ctPersons.reduce((matches, person) => {
      let donorMatches = donorSpenderIdFinder(spenderId => spenderId == person.optigem_nr);
      if (donorMatches.length == 0) matches.push(person);
      return matches;
    }, []);
    return noCtMatches;
  };

  const noAddisonSpenderIdInChurchtools = () => {
    let missingCtOptigenNrs = donorSpenderIds.reduce((matches, spenderId) => {
      let matchingRecords = ctPersonFinder(person => person.optigem_nr == spenderId);
      if (matchingRecords.length == 0) {
        let addisonMissingInCT = addisonFinder(rec => rec[addisonSpenderID] == spenderId);
        addisonMissingInCT.map((item) => {matches.push(item)});
      }
      return matches;
    }, []);
    return missingCtOptigenNrs;
  };

  const noAddisonSpenderIdInChurchtoolsIdList = () => {
    let missingCtOptigenNrs = donorSpenderIds.reduce((matches, spenderId) => {
      let matchingRecords = ctPersonFinder(person => person.optigem_nr == spenderId);
      if (matchingRecords.length == 0) { matches.push(spenderId) }
      return matches;
    }, []);
    return missingCtOptigenNrs;
  };

  const getDuplicateCtSpenderIDs = () => {
    const map = new Map();
    const duplicateSpenderIDs = []
    for (const item of _ctPersons) {
        if(map.has(item.optigem_nr) && item.optigem_nr != ""){        
          let _duplicates = ctPersonFinder(person => person.optigem_nr == item.optigem_nr);
          let _item = {
            "duplicateID": item.optigem_nr,
            "duplicates": _duplicates
          }
          duplicateSpenderIDs.push( _item)
        }
        else  {
          map.set(item.optigem_nr, true);
        }
    }
    return duplicateSpenderIDs
  }

  const getDonationReportData = () => {

    let donors = matchingAddisonSpenderIdInChurchtools();

    let reportData = donors.map((donor) => {
      var donations = addisonFinder(donation => donation[addisonSpenderID] == donor.optigem_nr)

      let totalDonations = Math.abs(donations.reduce((total, donation) => {
        return total + parseFloat(donation.Betrag)
        }, 0.00
      ));
      
      var splitTotal = totalDonations.toFixed(2).toString().split('.')  
      var totalEuro = inWordsDe(parseInt(splitTotal[0]))        
      var totalCent = inWordsDe(parseInt(splitTotal[1]))
      var totalDonationsText = ""
      if (totalCent != 'null') {
          totalDonationsText = inWordsDe(parseInt(splitTotal[0])) + "," + inWordsDe(parseInt(splitTotal[1]))
      }
      else {
          totalDonationsText = inWordsDe(parseInt(splitTotal[0]))
      }

      var exportData = {
        optigem_nr: donor.optigem_nr,
        name: donor.name,
        vorname: donor.vorname,
        anrede: (donor.geschlecht_no == 1) ? "Herr" : (donor.geschlecht_no == 2) ? "Frau" : '' ,
        ort: donor.ort,
        plz: donor.plz.toString(),
        strasse: donor.strasse,
        zusatz: donor.zusatz,
        total: currencyFormater.formatEuro(totalDonations.toFixed(2)),
        totalText: totalDonationsText,
      }
      for(var i = 0; i < 40; i++) {
        if (donations[i] != null) {
            exportData['datum_'+i.toString().padStart(2,0)] = (donations[i].Datum == undefined) ? donations[i].Belegdatum : donations[i].Datum
            exportData['spende_'+i.toString().padStart(2,0)] = currencyFormater.formatEuro(Math.abs(parseFloat(donations[i].Betrag)))
            exportData['artderzuwendung_'+i.toString().padStart(2,0)] = "Geldzuwendung"
            exportData['verzichtauferstattung_'+i.toString().padStart(2,0)] = "nein"
        }
        else {
            exportData['datum_'+i.toString().padStart(2,0)] = null
            exportData['spende_'+i.toString().padStart(2,0)] = null
            exportData['artderzuwendung_'+i.toString().padStart(2,0)] = null
            exportData['verzichtauferstattung_'+i.toString().padStart(2,0)] = null
        }
      }
      return exportData
    });

    reportData.sort(function (a, b) {
      var x =  a.name.toLowerCase();
      var y =  b.name.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });

    return reportData;
  };

  const getDuplicateDonorSpenderIDs = () => {
    const map = new Map();
    const duplicateSpenderIDs = []
    for (const item of getDonationReportData()) {
      if(map.has(item.optigem_nr) && item.optigem_nr != ""){        
        let _duplicates = ctPersonFinder(person => person.optigem_nr == item.optigem_nr);
        let _item = {
          "duplicateID": item.optigem_nr,
          "duplicates": _duplicates
        }
        duplicateSpenderIDs.push( _item)
      }
      else  {
        map.set(item.optigem_nr, true);
      }
    }
    return duplicateSpenderIDs
  }

  let mergeChurchtoolsAndAddison  = () => {
    let matchingAddisonSpender = matchingAddisonSpenderIdInChurchtools()
    let noMatchingAddisonSpender = noMatchingAddisonSpenderIdInChurchtools()
    let noAddisonSpender = noAddisonSpenderIdInChurchtools()
    let noAddisonSpenderIdList= noAddisonSpenderIdInChurchtoolsIdList()
    let donationReportDataList = getDonationReportData()
    let duplicateCTSpenderIDs = getDuplicateCtSpenderIDs()
    let duplicateDonorSpenderIDs = getDuplicateDonorSpenderIDs()

    let data = {
      matchingAddisonSpenderIdInChurchtools: matchingAddisonSpender,
      noMatchingAddisonSpenderIdInChurchtools: noMatchingAddisonSpender,
      noAddisonSpenderIdInChurchtools: noAddisonSpender,
      noAddisonSpenderIdInChurchtoolsIdList: noAddisonSpenderIdList,
      donationReportData: donationReportDataList,
      duplicateCTSpenderIDs: duplicateCTSpenderIDs,
      duplicateDonorSpenderIDs: duplicateDonorSpenderIDs
    };

    return data;
  }

  deferred.resolve(mergeChurchtoolsAndAddison());
  return  deferred.promise;
}

module.exports = {
  getChurchtoolsAndAddisonData: getChurchtoolsAndAddisonData
}