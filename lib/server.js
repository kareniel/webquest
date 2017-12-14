const bankai = require('bankai/http')
const serverRouter = require('server-router')
const getBody = require('get-body')
const open = require('opn')
const boxen = require('boxen')
const dedent = require('dedent')

const fs = require('fs')
const path = require('path')
const http = require('http')
const querystring = require('querystring')
const url = require('url')

module.exports = function () {
  const frontendPath = path.join(__dirname, 'frontend')
  const compiler = bankai(frontendPath, { quiet: true })
  this.server = http.createServer()
  this.router = serverRouter()

  this.router.route('GET', '/api/initialize', async (req, res) => {
    const response = {
      opts: this.opts,
      firstTime: this.firstTime,
      exercises: this.exercises,
      currentDir: process.cwd(),
      userDir: await this.appStorage.get('userDir')
    }
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(response))
  })

  this.router.route('GET', '/api/scandir', (req, res) => {
    const query = querystring.parse(url.parse(req.url).query)
    const dir = query.dir || __dirname
    const dirsonly = query.dirsonly || false
    let dirs = fs.readdirSync(dir)
    if (dirsonly)
      dirs = dirs.filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(dirs))
  })

  this.router.route('PUT', '/api/setuserdir', async (req, res) => {
    const { dir } = await getBody.json(req, req.headers)
    this.appStorage.put('userDir', dir)
      .then(() => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({dir}))
      })
      .catch(err => {
        res.writeHead(500, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({error: err}))
      })
  })

  this.router.route('GET', '/*', (req, res) => {
    compiler(req, res, () => {
      res.statusCode = 404
      res.end('not found')
    })
  })

  this.server.on('request', this.router.start())

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
