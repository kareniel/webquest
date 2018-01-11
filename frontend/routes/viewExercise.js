var html = require('choo/html')
var raw = require('choo/html/raw')
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    function onclick () {
      emit(state.events.PUSHSTATE, `/${exercise.slug}/verify`)
    }

    var exercise = state.exercises.find(function (e) {
      return e.slug === state.params.slug
    })
    if (exercise.name !== state.title) {
      emit(state.events.FETCHTRANSLATIONS, 'viewExercise')
      emit(state.events.DOMTITLECHANGE, exercise.name)
    }

    return html`
      <div>
        <h1 class="f1">${exercise.name}</h1>
        <p class="f4 lh-copy measure">${raw(exercise.problem)}</p>
        <a 
          class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" 
          onclick=${onclick}>
          ${state.translations['runOrVerify']}
        </a>
      </div>
    `
  })
}
