const yargs = require('yargs')
const level = require('level')
const mkdirp = require('mkdirp')
const path = require('path')

class WQ {
  constructor (opts = {}) {
    opts.pkg = require(path.join(__dirname, 'package.json'))

    if (!opts.name) 
      opts.name = opts.pkg.name
    
    opts.version = opts.pkg.version

    this.opts = opts
    this.exercises = []
    let storagePath = path.join((process.env.HOME || process.env.USERPROFILE), '.webquest')
    mkdirp.sync(storagePath)
    this.globalStorage = level(path.join(storagePath, 'webquest'))
    this.appStorage = level(path.join(storagePath, this.opts.name))
  }

  execute (args) {
    let argv = yargs(args)
      .usage('heyy test')
      .argv
    
    console.log('execute lol')
    this.cleanup()
  }

  cleanup () {
    this.globalStorage.close()
    this.appStorage.close()
  }
}

module.exports = opts => new WQ(opts)
