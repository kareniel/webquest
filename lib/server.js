const express = require('express')
const browserify = require('browserify-middleware')
const open = require('opn')
const boxen = require('boxen')
const dedent = require('dedent')
const sheetify = require('sheetify')
const fs = require('fs')
const path = require('path')

module.exports = function () {
  const frontendPath = path.join(__dirname, 'frontend')
  this.server = express()

  this.server.get('/api/initialize', (req, res) => {
    const response = {
      opts: this.opts,
      firstTime: this.firstTime,
      exercises: this.exercises
    }
    res.status(200)
    res.json(response)
    res.end()
  })

  this.server.get('/api/scandir', (req, res) => {
    const dir = req.query.dir || __dirname
    const dirsonly = req.query.dirsonly || false
    let dirs = fs.readdirSync(dir)
    if (dirsonly)
      dirs = dirs.filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    res.status(200)
    res.json(dirs)
    res.end()
  })

  this.server.use(express.static(frontendPath, { maxAge: '2h' }))
  this.server.get('/bundle.js', browserify(path.join(frontendPath, 'index.js'), {
    transform: [sheetify]
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

    if (!this.argv.n)
      open(url)
  })
}
