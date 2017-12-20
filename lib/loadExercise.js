const fs = require('fs-extra')
const slugify = require('slugify')
const markdown = require('markdown-it')()
const matter = require('gray-matter')
const path = require('path')

module.exports = async function (name) {
  const filepath = path.join(this.opts.exerciseDir, slugify(name))
  const solution = require(path.join(filepath, 'exercise.js'))
  const problemPrefix = this.locale === 'en' ? '' : `${this.locale}.`
  const problem = await fs.readFile(path.join(filepath, `problem.${problemPrefix}md`), 'utf-8')
  const { content, data } = matter(problem)
  const md = markdown.render(content)
  const slug = slugify(name)
  let passed
  try {
    passed = JSON.parse(await this.appStorage.get(`passed[${slug}]`))
  } catch (e) {
    passed = false
  }
  this.exercises.push({
    name,
    slug,
    solution,
    problem: md,
    matter: data,
    passed
  })
}
