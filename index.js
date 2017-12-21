const yargs = require('yargs')
const level = require('level')
const mkdirp = require('mkdirp')
const path = require('path')

class WQ {
  constructor (opts = {}) {
    if (opts.appDir) {
      opts.appDir = path.join(opts.appDir, '.')
    } else {
      opts.appDir = process.cwd()
    }

    opts.pkg = require(path.join(opts.appDir, 'package.json'))

    if (!opts.name) {
      opts.name = opts.pkg.name
    }
    if (!opts.exerciseDir) {
      opts.exerciseDir = path.join(opts.appDir, 'exercises')
    }
    opts.version = opts.pkg.version
    opts.dir = __dirname

    this.opts = opts
    this.exercises = this.opts.exercises || []
    this.firstTime = false
    let storagePath = path.join((process.env.HOME || process.env.USERPROFILE), '.webquest')
    mkdirp.sync(storagePath)
    this.appStorage = level(path.join(storagePath, this.opts.name))

    this.appStorage.get('userDir')
      .catch(err => {
        if (err.type === 'NotFoundError') {
          this.firstTime = true
        }
      })
    
    this.appStorage.get('locale')
      .then(locale => {
        this.locale = locale
      })
      .catch(err => {
        this.locale = 'en'
      })
  }

  async addExercise (exercise) {
    await this.loadExercise(exercise)
  }

  async addExercises (exercises) {
    exercises.forEach(async exercise => {
      await this.loadExercise(exercise)
    })
  }

  execute (args) {
    this.argv = yargs(args)
      .usage('Usage: $0 [locale]')
      .option('n', {
        alias: 'no-tab',
        boolean: true,
        describe: `don't automatically open a browser tab`
      })
      .argv

    if (!this.locale) {
      this.locale = this.argv._[0] || 'en'
    }
    this.loadI18n()
    this.runServer()
  }

  cleanup () {
    this.appStorage.close()
  }
}

WQ.prototype.runServer = require('./lib/server')
WQ.prototype.loadExercise = require('./lib/loadExercise')
WQ.prototype.loadI18n = require('./lib/loadI18n')

module.exports = opts => new WQ(opts)
