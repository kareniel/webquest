const yargs = require('yargs')
const level = require('level')
const mkdirp = require('mkdirp')
const path = require('path')

class WQ {
  constructor (opts = {}) {
    opts.pkg = require(path.join(process.cwd(), 'package.json'))

    if (!opts.name) 
      opts.name = opts.pkg.name
    
    opts.version = opts.pkg.version

    this.opts = opts
    this.exercises = this.opts.exercises || []
    let storagePath = path.join((process.env.HOME || process.env.USERPROFILE), '.webquest')
    mkdirp.sync(storagePath)
    this.globalStorage = level(path.join(storagePath, 'webquest'))
    this.appStorage = level(path.join(storagePath, this.opts.name))
  }

  execute (args) {
    let argv = yargs(args)
      .usage('heyy test')
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
