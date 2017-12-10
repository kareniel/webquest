const html = require('choo/html')
const raw = require('choo/html/raw')

module.exports = function (state, emit) {
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
}
