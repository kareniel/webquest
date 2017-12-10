var choo = require('choo')
var css = require('sheetify')

css('tachyons')

var app = choo()
if (process.env.NODE_ENV !== 'prod') {
  app.use(require('choo-devtools')())
}

app.use(require('./store'))

app.route('/', require('./routes/root'))
app.route('/:slug', require('./routes/viewExercise'))
app.route('/setdir', require('./routes/setdir'))

app.mount('body')
