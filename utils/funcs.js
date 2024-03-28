function clearDelimiters(value) {
  const delimiters = /[\/:,.-]/g
  return value.replace(delimiters, '')
}

function isNumeric(value) {
  return /^\d+$/.test(value)
}

module.exports = {
  isNumeric,
  clearDelimiters,
}
