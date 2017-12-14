const yargs = require('yargs')
const level = require('level')
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const path = require('path')

class WQ {
  constructor (opts = {}) {
    opts.pkg = require(path.join(process.cwd(), 'package.json'))

    if (!opts.name) 
      opts.name = opts.pkg.name
    if (!opts.exerciseDir)
      opts.exerciseDir = path.join(process.cwd(), 'exercises')
    opts.version = opts.pkg.version
    opts.dir = __dirname

    this.opts = opts
    this.exercises = this.opts.exercises || []
    this.firstTime = false
    let storagePath = path.join((process.env.HOME || process.env.USERPROFILE), '.webquest')
    mkdirp.sync(storagePath)
    this.globalStorage = level(path.join(storagePath, 'webquest'))
    this.appStorage = level(path.join(storagePath, this.opts.name))

    this.appStorage.get('firstTime')
      .catch(err => {
        if (err.type === 'NotFoundError') {
          this.firstTime = true
          return this.appStorage.put('firstTime', true)
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
      .option('t', {
        boolean: true,
        describe: `don't automatically open a browser tab`
      })
      .option('b', {
        boolean: true,
        describe: `don't use browserify in the included server`
      })
      .argv
    
    this.runServer()
  }

  cleanup () {
    this.globalStorage.close()
    this.appStorage.close()
  }
}

WQ.prototype.runServer = require('./lib/server')
WQ.prototype.loadExercise = require('./lib/loadExercise')

module.exports = opts => new WQ(opts)
