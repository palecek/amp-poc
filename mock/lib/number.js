module.exports = exports = {
  formatter: formatter,
  parser: parser
}

function formatter(input, fractionSize) {
  if (!input) {
    return input
  }

  input = roundTo(input, fractionSize).toFixed(fractionSize)

  var ret = input.toString().replace('.', ',')
  var pattern = /(-?\d+)(\d{3})/

  while (pattern.test(ret)) {
    ret = ret.replace(pattern, '$1 $2')
  }
  return ret
}

function roundTo (n, digits) {
  if (digits === undefined) {
    digits = 0
  }

  var multiplicator = Math.pow(10, digits)
  n = parseFloat((n * multiplicator).toFixed(11))
  return Math.round(n) / multiplicator
}

function parser(input) {
  // remove all-nondigits
  var value = input.toString().replace(/\D/g, '')

  // remove all leading zeros
  if (value) {
    value = Number(value).toString()
  }

  return parseFloat(value)
}
