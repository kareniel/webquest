const wq = require('./index')

let cool = wq({
  name: 'test'
})

cool.execute(process.argv.slice(2))
