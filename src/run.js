const fs = require('fs')
const path = require('path')

const { repeatAmount, verbose } = require('./cmdline')

const aocRunnerconfig = require(path.join(
    process.cwd(),
    'aoc-runner.config.js'
))

module.exports = aocPuzzle => {
    const solutionId = `${aocPuzzle.year}.${aocPuzzle.day}.${aocPuzzle.part}`.padEnd(9, ' ')

    const solutionPath = path.join(
        process.cwd(),
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
                `❌ ${' '.repeat(
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
    const ms = (diffInMs / maxRepeatAmount).toFixed(3)

    const [digit, decimal] = ms.toString().split('.')
    const msText = `${digit.padStart(4, ' ')},${decimal.padEnd(3, '0')}ms`

    const [solutionIdYear, solutionIdDay, solutionIdPart] = solutionId.split('.')
    const solutionIdText = `${solutionIdYear}.${solutionIdDay.padStart(2, ' ')}.${solutionIdPart}`.trim()

    console.log(`✅ ${msText} ${solutionIdText} => ${output}`)
}
