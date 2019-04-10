#!/usr/bin/env node

const { removeFromArray } = require('./utils')
const run = require('./run')
const parseAocPuzzleDate = require('./aoc-date-parser')
const { puzzleIncludeDate, puzzleExcludeDate } = require('./cmdline')

const toRun = parseAocPuzzleDate(puzzleIncludeDate)
const toExclude = parseAocPuzzleDate(puzzleExcludeDate)

const toExcludeDate = toExclude.get('date')
for (const y of toExclude.get('year')) {
    if (toExcludeDate.length <= 1) {
        removeFromArray(y, toRun.get('year'))
        continue
    }
    for (const d of toExclude.get('day')) {
        if (toExcludeDate.length <= 2) {
            removeFromArray(d, toRun.get('day'))
            continue
        }
        for (const p of toExclude.get('part')) {
            removeFromArray(p, toRun.get('part'))
        }
    }
}

for (const y of toRun.get('year')) {
    for (const d of toRun.get('day')) {
        for (const p of toRun.get('part')) {
            run({ year: y, day: d, part: p })
        }
    }
}
