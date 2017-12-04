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
    exercises: [],
    fileList: [],
    currentDir: ''
  })

  state.events = Object.assign(state.events, {
    REFRESHDIRS: 'refreshDirs'
  })

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    fetch('/api/initialize')
      .then(res => res.json())
      .then(body => {
        Object.assign(state, body)
        state.currentDir = state.opts.dir
        if (state.firstTime)
          emitter.emit(state.events.PUSHSTATE, '/setdir')
        else
          emitter.emit(state.events.RENDER)
      })
  })

  emitter.on(state.events.REFRESHDIRS, function (dir, dirsonly) {
    fetch(`/api/scandir?dir=${dir}&dirsonly=${dirsonly}`)
      .then(res => res.json())
      .then(body => {
        state.fileList = body
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
      <a class="link" href="/setdir">set dir</a>
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

app.route('/setdir', function (state, emit) {
  return html`
    <body class="sans-serif mv4 mh5">
      ${ls(state, emit, true)}
    </body>
  `
})

function ls (state, emit, dirsonly) {
  function onclick (e) {
    console.log(e)
  }

  if (state.fileList.length === 0) emit(state.events.REFRESHDIRS, state.currentDir, dirsonly)
  return html`
    <div class="pa3">
      <ul class="list pl0 measure">
        ${state.fileList.map(function (file) {
          return html`<li onclick=${onclick} class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">${file}</li>`
        })}
      </ul>
    </div>
  `
}

app.mount('body')
