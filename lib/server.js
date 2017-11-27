const express = require('express')
const browserify = require('browserify-middleware')
const path = require('path')

module.exports = function () {
  const frontendPath = path.join(__dirname, 'frontend')
  this.server = express()

  this.server.use(express.static(frontendPath))
  this.server.use(browserify(path.join(frontendPath, 'index.js'), {
    transform: ['sheetify']
  }))

  this.server.listen(8080)
}
