
const tp = require('testpass')

const localDate = require('.')

const date = new Date(0)

tp.test('year', (t) => {
  t.eq(localDate(date, {format: 'y'}), '1969')
})

tp.test('month (short)', (t) => {
  t.eq(localDate(date, {format: 'm'}), 'Dec')
})

tp.test('month (long)', (t) => {
  t.eq(localDate(date, {format: 'M'}), 'December')
}).catch(`Invalid date format: 'M' in 'M'`)

tp.test('weekday (short)', (t) => {
  t.eq(localDate(date, {format: 'w'}), 'Wed')
})

tp.test('weekday (long)', (t) => {
  t.eq(localDate(date, {format: 'W'}), 'Wednesday')
}).catch(`Invalid date format: 'W' in 'W'`)

tp.test('day', (t) => {
  t.eq(localDate(date, {format: 'd'}), '31')
})

tp.test('12 hour cycle', (t) => {
  t.eq(localDate(date, {format: 't'}), '7:00 PM')
})

tp.test('24 hour cycle', (t) => {
  t.eq(localDate(date, {format: 't', hours: 24}), '19:00')
})

tp.test('no minutes', (t) => {
  t.eq(localDate(date, {format: 't', minutes: false}), '7 PM')
  t.eq(localDate(date, {format: 't', hours: 24, minutes: false}), '19')
})

tp.test('generated function', (t) => {
  const format = localDate.fn('w, m d, y, t', {minutes: false})
  t.eq(format(date, {minutes: true}), 'Wed, Dec 31, 1969, 7:00 PM')
})
