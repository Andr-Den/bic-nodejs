import fetch from 'node-fetch'
const url = 'http://www.cbr.ru/s/newbik'

fetch(url)
.then(res => {
  res.body.pipe(fs.createWriteStream('bics.zip'))
})

import AdmZip from 'adm-zip'
const zip = new AdmZip('./bics.zip');
const newZip = new AdmZip();

const zipEntries = zip.getEntries();

zipEntries.forEach(function(zipEntry) {
  const fileName = zipEntry.entryName;
  const fileContent = zip.readFile(fileName)
  const newFileContent = iconv.decode(fileContent, 'win1251');
  const newFileName = 'zip_content.xml'
  newZip.addFile(newFileName, newFileContent, '')
});

newZip.extractAllTo('./', true)

const str = newZip.readAsText('zip_content.xml')

import xml2js from 'xml2js'

xml2js.parseString(str, (err, result) => {
  if (err) {
    throw err
  }
  const resultFile = result.ED807.BICDirectoryEntry.map((bic) => (
    bic.Accounts?.map((account) => (
      {
        bic: bic.$.BIC,
        name: bic.ParticipantInfo[0].$.NameP,
        corrAccount: account.$.Account
      }
    ))
  )).flat(1).filter(Boolean)
})