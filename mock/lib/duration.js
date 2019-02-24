module.exports = exports = {
  formatter: formatter
}

function formatter (months) {
  return {
    years: months / 12 | 0,
    months: months % 12
  }
}
