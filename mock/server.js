const express = require('express')
const https = require('https')
const httpsCredentials = require('./https.conf')
const app = express()
const port = 9800
const currencyFormatter = require('./lib/currency').formatter
const currencyParser = require('./lib/currency').parser

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/src', express.static('src'))
app.get('/mock/loans', (req, res) => {
  enableCorsNaive(req, res)
  let value = {
    amount: 200000,
    payment: 2723,
    duration: 93,
    durationFormatted: {
      years: 7,
      months: 9
    }
  }

  if (req.query.amount) {
    value.amount = (currencyParser(req.query.amount) || 0)
  }
  if (req.query.payment) {
    value.payment = (currencyParser(req.query.payment) || 0)
  }

  if (req.query.actionButton === 'amountPlus') {
    value.amount = (currencyParser(req.query.amount) || 0) + 1
  } else if (req.query.actionButton === 'amountMinus') {
    value.amount = (currencyParser(req.query.amount) || 0) - 1
  } else if (req.query.actionButton === 'paymentPlus') {
    value.payment = (currencyParser(req.query.payment) || 0) + 1
  } else if (req.query.actionButton === 'paymentMinus') {
    value.payment = (currencyParser(req.query.payment) || 0) - 1
  } 

  value.amount = currencyFormatter(value.amount)
  value.payment = currencyFormatter(value.payment)

  res.send(JSON.stringify(value))
})

app.get('/mock/params', (req, res) => {
  enableCorsNaive(req, res)
  const value = {
    url1: "https://www.csas.cz/1",
    url2: "https://www.csas.cz/2"
  }

  res.send(JSON.stringify(value))
})

app.post('/mock/merged.json', (req, res) => {
  enableCorsNaive(req, res)
  console.log('req.body: ', req.body)
  res.send(JSON.stringify(
    {
      "amount": "200 001",
      "payment": "2 723",
      "duration": 93,
      "durationInYears": 7,
      "durationInMonths": 9
    }
  ))
})

function enableCorsNaive(req, res, origin, opt_exposeHeaders) {
  if (req.headers['amp-same-origin'] == 'true') {
    origin = req.query.__amp_source_origin;
  } else {
    origin = req.headers.origin;
  } 
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Expose-Headers',
      ['AMP-Access-Control-Allow-Source-Origin']
          .concat(opt_exposeHeaders || []).join(', '));
  if (req.query.__amp_source_origin) {
    res.setHeader('AMP-Access-Control-Allow-Source-Origin',
        req.query.__amp_source_origin);
  }
}

const httpsServer = https.createServer(httpsCredentials, app)

httpsServer.listen(port, () => console.log(`Example app listening on port ${port}!`))
