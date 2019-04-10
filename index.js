#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const AOC_STARTING_YEAR = 2015
const AOC_CURRENT_YEAR_IN_PROGRESS = 2018
const CURRENT_WORKING_DIR = process.cwd()

const aocRunnerconfig = require(path.join(
    CURRENT_WORKING_DIR,
    'aoc-runner.config.js'
))

const argv = process.argv.slice(2)
const [puzzle = '', repeatAmount = 1] = argv.filter(v => !v.startsWith('-'))
const verbose = argv.includes('-v')

const [year, day, part] = puzzle.split('.')
const input = [
    ['year', year, AOC_STARTING_YEAR, AOC_CURRENT_YEAR_IN_PROGRESS],
    ['day', day, 1, 25],
    ['part', part, 1, 2]
]

const toRun = new Map()

for (const [name, part, min, max] of input) {
    toRun.set(name, [])
    if (!part) {
        for (let i = min; i <= max; i++) {
            toRun.get(name).push(i)
        }
    } else {
        part.replace(/\,[\s]*$/, '')
            .split(',')
            .map(Number)
            .forEach(value => toRun.get(name).push(value))
    }
}

function run(aocPuzzle) {
    const solutionId = `${aocPuzzle.year}.${aocPuzzle.day}.${aocPuzzle.part}`.padEnd(9, ' ')

    const solutionPath = path.join(
        CURRENT_WORKING_DIR,
        (() => {
            if (typeof aocRunnerconfig.path === 'object') {
                return ['year', 'day', 'part']
                    .map(item => {
                        const configPathResolver = aocRunnerconfig.path[item]
                        if (typeof configPathResolver === 'function') {
                            return configPathResolver(aocPuzzle)
                        } else if (typeof configPathResolver === 'string') {
                            return configPathResolver.replace(
                                '$',
                                aocPuzzle[item]
                            )
                        }
                        return aocPuzzle[item]
                    })
                    .join(path.sep)
            } else if (typeof aocRunnerconfig.path === 'string') {
                const aocPuzzlePathValues = Object.values(aocPuzzle)
                let path = aocRunnerconfig.path
                aocPuzzlePathValues.forEach(item => {
                    path = path.replace('$', item)
                })
                return path
            }
        })()
    )
    const inputPath = path.join(
        path.dirname(solutionPath),
        aocRunnerconfig.input
    )

    if (!fs.existsSync(solutionPath)) {
        if (verbose) {
            console.warn(
                '\x1b[31m%s\x1b[0m',
                `❌  ${' '.repeat(
                    10
                )} ${solutionId} => Unable to resolve, file doesn't exist.`
            )
        }
        return
    }

    const input = fs.readFileSync(inputPath, { encoding: 'UTF-8' })
    const solver = require(solutionPath)

    const solve = solver.bind(null, input)
    const output = solve()
    const maxRepeatAmount = Math.abs(repeatAmount)

    const start = process.hrtime()
    for (let i = 0; i < maxRepeatAmount; i++) {
        solve()
    }
    const diff = process.hrtime(start)
    const diffInMs = diff[0] * 1e3 + diff[1] / 1e6

    const ms = ((diffInMs / maxRepeatAmount).toFixed(3) + 'ms')
        .replace('.', ',')
        .padEnd(10, ' ')

    console.log(`✅  ${ms} ${solutionId} => ${output}`)
}

for (const y of toRun.get('year')) {
    for (const d of toRun.get('day')) {
        for (const p of toRun.get('part')) {
            run({ year: y, day: d, part: p })
        }
    }
}
