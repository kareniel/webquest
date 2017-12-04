const fs = require('fs-extra')
const slugify = require('slugify')
const markdown = require('markdown-it')()
const matter = require('gray-matter')
const path = require('path')

module.exports = async function (name) {
  const filepath = path.join(this.opts.exerciseDir, slugify(name))
  const solution = require(path.join(filepath, 'exercise.js'))
  const problem = await fs.readFile(path.join(filepath, 'problem.md'), 'utf-8')
  const { content, data } = matter(problem)
  const md = markdown.render(content)
  console.log(data)
  this.exercises.push({
    name,
    slug: slugify(name),
    solution,
    problem: md,
    matter: data
  })
}
