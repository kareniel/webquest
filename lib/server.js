const bankai = require('bankai/http')
const serverRouter = require('server-router')
const getBody = require('get-body')
const open = require('opn')
const boxen = require('boxen')
const dedent = require('dedent')
const nanobus = require('nanobus')

const fs = require('fs')
const path = require('path')
const http = require('http')
const querystring = require('querystring')
const url = require('url')

module.exports = function () {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'index.js')
  const compiler = bankai(frontendPath, { quiet: !this.argv.v })
  this.server = http.createServer()
  this.router = serverRouter()

  this.router.route('GET', '/api/initialize', async (req, res) => {
    let userDir
    try {
      userDir = await this.appStorage.get('userDir')
    } catch (e) {
      userDir = ''
    }

    this.exercises = []
    await Promise.all(this.exerciseNames.map(ex => {
      return this.loadExercise(ex)
    }))

    const response = {
      opts: this.opts,
      firstTime: this.firstTime,
      exercises: this.exercises,
      currentDir: process.cwd(),
      userDir,
      locale: this.locale,
      errorMessage: this.errorMessage,
      errorTranslations: this.__('webquest.error')
    }
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(response))
  })

  this.router.route('GET', '/api/scandir', (req, res) => {
    const query = querystring.parse(url.parse(req.url).query)
    const dir = query.dir || __dirname
    const dirsonly = JSON.parse(query.dirsonly) || false
    let files = fs.readdirSync(dir)
    if (dirsonly) {
      files = files.filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    }
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(files))
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

  this.router.route('GET', '/api/verify', (req, res) => {
    const { exercise: exerciseName, file } = querystring.parse(url.parse(req.url).query)
    const exercise = this.exercises.find(e => e.name === exerciseName)
    const bus = nanobus()
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.write('{"messages":[')
    let f = false
    bus.on('message', msg => {
      if (!f) {
        res.write(`"${msg}"`)
        f = true
      } else {
        res.write(`,"${msg}"`)
      }
    })
    bus.on('end', success => {
      if (success) {
        this.appStorage.put(`passed[${exercise.slug}]`, true)
          .then(() => {
            res.end(`],"success":"${success}"}`)
          })
      } else {
        res.end(`],"success":"${success}"}`)
      }
    })
    if (Object.keys(require.cache).includes(file))
      delete require.cache[file]
    exercise.solution.verify(this, exercise.slug, bus, file)
  })

  this.router.route('GET', '/api/run', (req, res) => {
    const { exercise: exerciseName, file } = querystring.parse(url.parse(req.url).query)
    const exercise = this.exercises.find(e => e.name === exerciseName)
    const bus = nanobus()
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.write('{"messages":[')
    let f = false
    bus.on('message', msg => {
      if (!f) {
        res.write(`"${msg}"`)
        f = true
      } else {
        res.write(`,"${msg}"`)
      }
    })
    bus.on('end', () => {
      res.end(`]}`)
    })
    if (Object.keys(require.cache).includes(file))
      delete require.cache[file]
    exercise.solution.run(this, exercise.slug, bus, file)
  })

  this.router.route('GET', '/api/fetchTranslations', (req, res) => {
    const { name } = querystring.parse(url.parse(req.url).query)
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(this.__(`webquest.${name}`)))
  })

  this.router.route('GET', '/api/setLocale', (req, res) => {
    const { locale } = querystring.parse(url.parse(req.url).query)
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    this.appStorage.put('locale', locale)
      .then(() => {
        res.end('ok')
        setTimeout(() => {
          process.exit(0)
        }, 1000)
      })
  })

  this.router.route('GET', '/*', (req, res) => {
    compiler(req, res, () => {
      res.statusCode = 404
      res.end('not found')
    })
  })

  this.server.on('request', this.router.start())

  const port = this.argv.p || 8080
  this.server.listen(port, () => {
    let url = `http://localhost:${port}`
    let words = this.__('webquest.internal.serverStarted', { name: this.opts.name, url })
    console.log(boxen(words, {
      padding: 1,
      borderColor: 'green'
    }))

    if (!this.argv.n) open(url)
  })
}
