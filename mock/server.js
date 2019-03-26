const express = require('express')
const https = require('https')
const httpsCredentials = require('./https.conf')
const app = express()
const port = 9800
const currencyFormatter = require('./lib/currency').formatter
const currencyParser = require('./lib/currency').parser
const durationFormatter = require('./lib/duration').formatter
const Loans = require('./Loans').Loans
const loans = new Loans(require('./loans.json'))

app.use('/', express.static('src'))
app.get('/mock/loans', (req, res) => {
  enableCorsNaive(req, res)
  let amount = req.query.fAmount ? currencyParser(req.query.fAmount) || 0 : 0
  let payment = req.query.fPayment ? currencyParser(req.query.fPayment) || 0 : 0
  let loan = loans.getLoanByAmountAndPayment(amount, payment)

  if (req.query.actionButton === 'amountPlus') {
    loan = loans.getLoanByAmountAndPayment(loans.getNextAmount(amount), payment)
  } else if (req.query.actionButton === 'amountMinus') {
    loan = loans.getLoanByAmountAndPayment(loans.getPrevAmount(amount), payment)
  } else if (req.query.actionButton === 'paymentPlus') {
    loan = loans.getLoanByAmountAndPayment(amount, loans.getNextPayment(amount, payment))
  } else if (req.query.actionButton === 'paymentMinus') {
    loan = loans.getLoanByAmountAndPayment(amount, loans.getPrevPayment(amount, payment))
  }

  loan.fAmount = currencyFormatter(loan.amount)
  loan.fPayment = currencyFormatter(loan.monthlyPayment)
  loan.fDuration = durationFormatter(loan.duration)
  loan.fbPaymentAmount = currencyFormatter(loan.bPaymentAmount)

  res.send(JSON.stringify(loan))
})

app.get('/mock/params', (req, res) => {
  enableCorsNaive(req, res)
  const value = {
    url1: "https://www.csas.cz/1",
    url2: "https://www.csas.cz/2"
  }

  res.send(JSON.stringify(value))
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

httpsServer.listen(port, () => console.log(`App: https://localhost:${port}!`))
