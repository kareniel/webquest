const express = require('express')
const browserify = require('browserify-middleware')
const open = require('opn')
const boxen = require('boxen')
const dedent = require('dedent')
const path = require('path')

module.exports = function () {
  const frontendPath = path.join(__dirname, 'frontend')
  this.server = express()

  this.server.get('/api/initialize', (req, res) => {
    const response = {
      name: this.opts.name,
      exercises: this.exercises
    }
    res.status(200)
    res.json(response)
    res.end()
  })

  this.server.use(express.static(frontendPath))
  this.server.use(browserify(path.join(frontendPath, 'index.js'), {
    transform: ['sheetify']
  }))

  this.server.listen(8080, () => {
    let url = `http://localhost:8080`
    let words = dedent`
      Welcome to ${this.opts.name}!
      We have automatically opened the questline in your
      browser. If you accidentally close it, just type in
      ${url}.

      To quit ${this.opts.name}, just type Ctrl+C.
    `
    console.log(boxen(words, {
      padding: 1,
      borderColor: 'green'
    }))
    open(url)
  })
}
