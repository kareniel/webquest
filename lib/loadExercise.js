const fs = require('fs-extra')
const slugify = require('slugify')
const path = require('path')

module.exports = async function (name) {
  const filepath = path.join(this.opts.exerciseDir, slugify(name))
  const solution = require(path.join(filepath, 'exercise.js'))
  const problem = await fs.readFile(path.join(filepath, 'problem.md'), 'utf-8')
  this.exercises.push({
    name,
    solution,
    problem: problem.trim()
  })
}
