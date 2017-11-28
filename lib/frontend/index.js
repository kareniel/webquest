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
      .then(body => {
        Object.assign(state, body)
        emitter.emit(state.events.RENDER)
      })
  })
})

app.route('/', function (state, emit) {
  return html`
    <body class="sans-serif mv4 mh5">
      <h1 class="f1">${state.name}</h1>
      ${state.exercises.map(function (exercise) {
        return html`
          <div class="bg-dark-pink near-white pv3 ph3 w-30">
            <h1 class="f5"><i>${exercise.id}</i> ${exercise.title}</h1>
            <p>${exercise.description}</p>
          </div>
        `
      })}
    </body>
  `
})

app.mount('body')
