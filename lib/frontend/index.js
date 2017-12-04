var choo = require('choo')
var html = require('choo/html')
var raw = require('choo/html/raw')
var css = require('sheetify')
var fetch = window.fetch

css('tachyons')

var app = choo()
if (process.env.NODE_ENV !== 'prod') {
  app.use(require('choo-devtools')())
}

app.use(function (state, emitter) {
  state = Object.assign(state, {
    opts: {},
    firstTime: false,
    exercises: []
  })

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    fetch('/api/initialize')
      .then(res => res.json())
      .then(body => {
        Object.assign(state, body)
        if (state.firstTime) {
          emitter.emit(state.events.PUSHSTATE, '/welcome')
        }
        emitter.emit(state.events.RENDER)
      })
  })
})

app.route('/', function (state, emit) {
  const title = state.opts.name
  if (title && state.title !== title) emit(state.events.DOMTITLECHANGE, title)
  return html`
    <body class="sans-serif mv4 mh5">
      <h1 class="f1">${state.opts.name}</h1>
      ${state.exercises.map(function (exercise) {
        return html`
          <a class="link" href="/${exercise.slug}">
            <div class="bg-dark-pink near-white pv3 ph3 w-30 grow pointer mb4">
              <h1 class="f5">${exercise.name}</h1>
              <p>${exercise.matter.summary ? exercise.matter.summary : 'A cool exercise!'}</p>
            </div>
          </a>
        `
      })}
    </body>
  `
})

app.route('/:slug', function (state, emit) {
  const exercise = state.exercises.find(function (e) {
    return e.slug === state.params.slug
  })
  if (exercise.name !== state.title) emit(state.events.DOMTITLECHANGE, exercise.name)
  return html`
    <body class="sans-serif mv4 mh5">
      <h1 class="f1">${exercise.name}</h1>
      <p class="f4 lh-measure">${raw(exercise.problem)}</p>
    </body>
  `
})

app.route('/welcome', function (state, emit) {
  return html`
    <body>whatup lol</body>
  `
})

app.mount('body')
