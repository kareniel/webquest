var choo = require('choo')
var css = require('sheetify')

css('tachyons')

var app = choo()

app.use(require('choo-devtools')())
app.use(require('./store'))

app.route('/', require('./routes/root'))
app.route('/:slug', require('./routes/viewExercise'))
app.route('/:slug/verify', require('./routes/verify'))
app.route('/setuserdir', require('./routes/setUserDir'))
app.route('/setlocale', require('./routes/setLocale'))

app.mount('body')
