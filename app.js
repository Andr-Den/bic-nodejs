import express from 'express';
import getInfo from './getInfo.js';
import cron from 'node-cron'

const app = express(); 

const { PORT = 3000 } = process.env;

cron.schedule('0 4 * * *', () => {
  getInfo()
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
