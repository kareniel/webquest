var html = require('choo/html')
var ls = require('../common').ls
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    var exercise = state.exercises.find(function (e) {
      return e.slug === state.params.slug
    })
    var title = `verify or run ${exercise.name}`
    if (title !== state.title) {
      emit(state.events.SETCURRENTDIR, state.userDir)
      emit(state.events.REFRESHDIRS, [state.currentDir, false])
      emit(state.events.DOMTITLECHANGE, title)
    }
    return html`
      <body class="sans-serif mv4 mh5 mw7">
        <h1 class="f1">${exercise.name}</h1>
        ${ls(state, emit, false)}
      </body>
    `
  })
}
