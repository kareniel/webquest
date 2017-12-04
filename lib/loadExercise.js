const fs = require('fs-extra')
const slugify = require('slugify')
const remark = require('remark')
const remarkHtml = require('remark-html')
const path = require('path')

module.exports = async function (name) {
  const filepath = path.join(this.opts.exerciseDir, slugify(name))
  const solution = require(path.join(filepath, 'exercise.js'))
  const problem = await fs.readFile(path.join(filepath, 'problem.md'), 'utf-8')
  const md = remark().use(remarkHtml).processSync(problem)
  this.exercises.push({
    name,
    slug: slugify(name),
    solution,
    problem: md.toString()
  })
}
