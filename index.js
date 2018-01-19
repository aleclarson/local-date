
const wrapDefaults = require('wrap-defaults')
const noop = require('noop')

const days = new Array(7)
const months = new Array(12)

module.exports = localDate

function localDate(date, opts) {
  if (typeof opts.format != 'string') {
    throw Error('Expected `format` to be a string')
  }
  return parseFormat(opts.format, (val, key) => {
    return key ? val(date, opts) : val
  }).join('')
}

localDate.fn = function(format, defaults) {
  defaults = defaults ? wrapDefaults(defaults) : noop.arg1
  format = parseFormat(format, (val, key) => {
    return key ? `symbols['${key}'](date, opts)` : `'${val}'`
  }).join(', ')
  return new Function('defaults', 'symbols',
    `return function(date, opts) {
      opts = defaults(opts || {})
      return [${format}].join('')
    }`)(defaults, symbols)
}

// Locale-specific strings must be configured beforehand.
localDate.init = function(config = {}) {
  if (typeof navigator == 'undefined') {
    var navigator = {language: 'en'}
  }
  const lang = config.lang || navigator.language || 'en'

  for (let i = 0; i < days.length; i++) {
    const d = new Date(0, 0, i)
    days[i] = {
      short: d.toLocaleString(lang, {weekday: 'short'}),
      long: d.toLocaleString(lang, {weekday: 'long'}),
    }
  }

  for (let i = 0; i < months.length; i++) {
    const d = new Date(0, i)
    months[i] = {
      short: d.toLocaleString(lang, {month: 'short'}),
      long: d.toLocaleString(lang, {month: 'long'}),
    }
  }
}

// Initialize using `navigator.language` by default
localDate.init()

//
// Helpers
//

// Returns an array of strings and functions.
function parseFormat(format, iterator) {
  let res = [], i = 0, match, re = /[a-z0-9]+/gi
  while (match = re.exec(format)) {
    if (i < match.index) {
      res.push(iterator(format.slice(i, match.index)))
      i = match.index
    }
    match = match[0]
    i += match.length
    if (!symbols.hasOwnProperty(match)) {
      throw Error(`Invalid date format: '${match}' in '${format}'`)
    }
    res.push(iterator(symbols[match], match))
  }
  return res
}

const symbols = localDate.symbols = {
  // Year (long)
  y: (date) => date.getFullYear(),
  // Month (short)
  m: (date) => months[date.getMonth()].short,
  // Day of the month
  d: (date) => date.getDate(),
  // Day of the week (short)
  w: (date) => days[date.getDay()].short,
  // Time of day
  t(date, opts) {
    const h12 = opts.hours != 24
    const hours = date.getHours()
    let time = h12 ? hours % 12 || 12 : hours
    if (opts.minutes != false) {
      const minutes = date.getMinutes()
      time += `:${minutes < 10 ? '0' : ''}${minutes}`
    }
    return h12 ? time + (hours < 12 ? ' AM' : ' PM') : time
  }
}
