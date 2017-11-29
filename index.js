const yargs = require('yargs')
const level = require('level')
const mkdirp = require('mkdirp')
const path = require('path')

class WQ {
  constructor (opts = {}) {
    opts.pkg = require(path.join(process.cwd(), 'package.json'))

    if (!opts.name) 
      opts.name = opts.pkg.name
    if (!opts.exerciseDir)
      opts.exerciseDir = path.join(process.cwd(), 'exercises')
    opts.version = opts.pkg.version

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

  execute (args) {
    this.argv = yargs(args)
      .option('n', {
        boolean: true,
        describe: `don't automatically open a browser tab`
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

module.exports = opts => new WQ(opts)
