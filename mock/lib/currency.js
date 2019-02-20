module.exports = exports = {
  formatter: formatter,
  parser: parser
}

function formatter(input) {
  return input ? input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : input
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
