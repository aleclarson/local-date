
# local-date v0.0.1

Simple `Date` formatting with locale support. The user's timezone is always taken into account.

**NOTE:** NodeJS only supports the `en-US` locale by default. You should [manually
build Node](https://github.com/nodejs/node/issues/8500#issuecomment-246432058) or
install the [full-icu](https://www.npmjs.com/package/full-icu) package if you need
other locales.

This package should work perfectly within browsers, but please file an
issue if you find a bug!

```js
const localDate = require('local-date')

// Parse a format on-the-fly.
localDate(new Date(), {format: 'm d, y'}) // => 'Jan 19, 2018'

// Parse the format beforehand, and use an optimized function.
const formatDate = localDate.fn('m d, y', defaults)

// The `opts` object inherits from the `defaults` object.
formatDate(date, opts) // => string
```

The generated `formatDate` function above is identical to this:
```js
function(date, opts) {
  // Apply the default values.
  opts = defaults(opts || {})
  // Build the date string.
  return [month(date, opts), ' ', day(date, opts), ', ', year(date, opts)].join('')
}
```

That's as optimized as it gets! 😎

### Built-in symbols

The weekday and month strings are always localized.

- **w**: The (shortened) day of the week (eg: Mon, Tue, Wed)
- **m**: The (shortened) month (eg: Jan, Feb, Mar)
- **d**: The day of the month (starts from 1)
- **y**: The full year (eg: 2018)
- **t**: The time of day (eg: "2:10 PM" or "20:00")

### Options

Pass `hours: 24` to use a 24-hour cycle. Otherwise, a 12-hour cycle is used.

Pass `minutes: false` to format the time as "2 PM" or "20".
