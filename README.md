# aoc-runner.js

Install:

```
npm i aod/aoc-runner.js
```

# Usage

```
SYNTAX:
npx aoc-runner [-v] {[:][,...year].[,...day].[,...part]} [repeat]

USAGE:
  -v             : enables verboseness i.e. displays warning messages.
  args[0]        : the solution to run.
                   e.g. ".1,2,3,7.1" will run day 1, 2, 3 & 7 part 1 for
                   year 2015 through 2018.
                   To select a range of values use "-".
                   e.g. ".1-3,7-22.1"
                   To exclude solutions use the optional ":" notation after
                   the first date.
                   e.g. .1-3,7.1:2017.2-5 will exclude day 2 through 5
                   for year 2017.
  args[1] repeat : repeats every solution matched N times.
```

# Quick start

Create `aoc-runner.config.js` in the root of your project.


## Usage

```ts
// file: /aoc-runner.config.js

module.exports = {
  // AoC solution file resolver (per part):
  path: string | {
    year: string | (year: number) => string
    day: string | (day: number) => string
    part: string | (part: number) => string
  },
  // The input path relative to the resolved solution path:
  input: string
}
```

Example:

```js
// file: /aoc-runner.config.js

module.exports = {
    // Using a string:
    path: '$/day$/part$.js',

    // Using a custom resolver object:
    path: {
        day: ({ day }) => `day${('' + day).padStart(2, '0')}`,
        part: 'part$.js'
    },

    input: './input.txt'
}
```
