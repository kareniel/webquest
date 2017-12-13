var html = require('choo/html')

module.exports = function (state, emit) {
  var exercise = state.exercises.find(function (e) {
    return e.slug === state.params.slug
  })
  var title = `verify or run ${exercise.name}`
  if (title !== state.title) emit(state.events.DOMTITLECHANGE, title)
  return html`
    <body class="sans-serif mv4 mh5 mw7">
      hello
    </body>
  `
}
