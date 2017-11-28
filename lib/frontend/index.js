var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var fetch = window.fetch

css('tachyons')

var app = choo()
if (process.env.NODE_ENV !== 'prod') {
  app.use(require('choo-devtools')())
}

app.use(function (state, emitter) {
  state = Object.assign(state, {
    name: '',
    exercises: []
  })

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    fetch('/api/initialize')
      .then(res => res.json())
      .then(body => console.log(body))
  })
})

app.route('/', function (state, emit) {
  return html`
    <body>
      <h1>${state.name}</h1>
      ${state.exercises.forEach(function (exercise) {
        return html`
          hello
        `
      })}
    </body>
  `
})

app.mount('body')
