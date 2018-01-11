const yargs = require('yargs')
const level = require('level')
const mkdirp = require('mkdirp')
const path = require('path')

const availableLocales = require('./availableLocales.json')

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
    this.errorMessage = ''
    let storagePath = path.join((process.env.HOME || process.env.USERPROFILE), '.webquest')
    mkdirp.sync(storagePath)
    this.appStorage = level(path.join(storagePath, this.opts.name))

    this.appStorage.get('userDir')
      .catch(err => {
        if (err.type === 'NotFoundError') {
          this.firstTime = true
        }
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
      .option('r', {
        alias: 'reset-locale',
        boolean: true,
        describe: `reset the locale back to english`
      })
      .option('v', {
        alias: 'verbose',
        boolean: true,
        describe: `output more information about compilation`
      })
      .argv

    if (this.argv._[0]) {
      if (!availableLocales.find(e => e === this.argv._[0])) {
        console.log(`Please input a valid locale name.`)
        process.exit(0)
      }
      if (this.argv.r) {
        this.argv._[0] = 'en'
      }

      this.appStorage.put('locale', this.argv._[0])
        .then(() => {
          this.locale = this.argv._[0]
          this.loadI18n()
          this.runServer()
        })
    } else {
      this.appStorage.get('locale')
        .then(locale => {
          if (this.argv.r) {
            locale = 'en'
          }

          this.locale = locale
          this.loadI18n()
          this.runServer()
        })
        .catch(err => {
          this.locale = 'en'
          this.loadI18n()
          this.runServer()  
        })
    }
  }

  cleanup () {
    this.appStorage.close()
  }
}

WQ.prototype.runServer = require('./lib/server')
WQ.prototype.loadExercise = require('./lib/loadExercise')
WQ.prototype.loadI18n = require('./lib/loadI18n')

module.exports = opts => new WQ(opts)
