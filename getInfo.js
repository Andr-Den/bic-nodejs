import fetch from 'node-fetch'
import fs from 'fs'
import iconv from 'iconv-lite'
import AdmZip from 'adm-zip'
import xml2js from 'xml2js'

const url = 'http://www.cbr.ru/s/newbik'

fetch(url)
.then(res => {
  res.body.pipe(fs.createWriteStream('bics.zip'))
})

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
  fs.writeFileSync('result.txt', JSON.stringify(resultFile, null, 2) , 'utf-8');
})