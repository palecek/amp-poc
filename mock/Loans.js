module.exports = exports = {
 Loans: Loans 
}

function Loans(loansJson) {
  const _amountPaymentLookup = loansJson.reduce((acc, cur) => {
    const payments = acc[cur.amount] || {}
    payments[cur.monthlyPayment] = cur
    acc[cur.amount] = payments
    return acc
  }, {})

  this.getLoanByAmountAndPayment = function(amount, payment) {
    const nearestAmount = Object.keys(_amountPaymentLookup).sort((a, b) => {
      return Math.abs(amount - +a) - Math.abs(amount - +b)
    })[0]

    const nearestPayment = Object.keys(_amountPaymentLookup[nearestAmount]).sort((a, b) => {
      return Math.abs(payment - +a) - Math.abs(payment - +b)
    })[0]
    return _amountPaymentLookup[nearestAmount][nearestPayment]
  }
  
  this.getNextAmount = function (amount) {
    const amounts = Object.keys(_amountPaymentLookup)
    const index = amounts.indexOf(amount.toString())
    return index + 1 >= amounts.length ? amounts[index] : amounts[index + 1] 
  }

  this.getPrevAmount = function (amount) {
    const amounts = Object.keys(_amountPaymentLookup)
    const index = amounts.indexOf(amount.toString())
    return index - 1 < 0 ? amounts[index] : amounts[index - 1] 
  }
  
  this.getNextPayment = function (amount, payment) {
    const payments = Object.keys(_amountPaymentLookup[amount])
    const index = payments.indexOf(payment.toString())
    return index + 1 >= payments.length ? payments[index] : payments [index + 1]
  }

  this.getPrevPayment = function (amount, payment) {
    const payments = Object.keys(_amountPaymentLookup[amount])
    const index = payments.indexOf(payment.toString())
    return index - 1 < 0 ? payments[index] : payments [index - 1]
  }
}
