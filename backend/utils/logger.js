// Logs informational messages.
const info = (...params) => {
  console.log(...params)
}

// Logs error messages.
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info,
  error
}
