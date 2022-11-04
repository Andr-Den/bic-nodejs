import fetch from 'node-fetch'
const url = 'http://www.cbr.ru/s/newbik'

fetch(url)
.then(res => {
  res.body.pipe(fs.createWriteStream('bics.zip'))
})
