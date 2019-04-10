const argv = process.argv.slice(2)
const verbose = argv.includes('-v')
const [puzzle = '', repeatAmount = 1] = argv.filter(v => !v.startsWith('-'))
const [puzzleIncludeDate, puzzleExcludeDate] = puzzle.split(':')

module.exports = {
  puzzleIncludeDate,
  puzzleExcludeDate,
  repeatAmount,
  verbose
}
