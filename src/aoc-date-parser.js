const {
    AOC_STARTING_YEAR,
    AOC_CURRENT_YEAR_IN_PROGRESS
} = require('./constants')

module.exports = date => {
    const toRun = new Map([['year', []],['day', []],['part', []]])

    if (!date) {
        return toRun
    }

    toRun.set('date', date.split('.'))

    const [year, day, part] = date.split('.')
    const input = [
        ['year', year, AOC_STARTING_YEAR, AOC_CURRENT_YEAR_IN_PROGRESS],
        ['day', day, 1, 25],
        ['part', part, 1, 2]
    ]

    for (const [name, part, min, max] of input) {
        const toRunValues = []
        toRun.set(name, toRunValues)

        if (!part) {
            for (let i = min; i <= max; i++) {
                toRunValues.push(i)
            }
        } else {
            part
                .replace(/\,[\s]*$/, '')
                .split(',')
                .forEach(value => {
                    if (value.includes('-')) {
                        let [min, max] = value.split('-')
                        min = Math.abs(min)
                        max = Math.min(Math.max(max, min), 25)
                        for (let i = Math.abs(min); i <= max; i++) {
                            toRunValues.push(i)
                        }
                    } else {
                        toRunValues.push(parseInt(value, 10))
                    }
                })
        }
    }

    return toRun
}
