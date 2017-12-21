var html = require('choo/html')
var flag = require('country-emoji').flag
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    var locale = state.locale === 'en' ? 'UK' : state.locale.toUpperCase()
    var title = state.opts.name
    if (title && state.title !== title) {
      emit(state.events.FETCHTRANSLATIONS, 'root')
      emit(state.events.DOMTITLECHANGE, title)
    }
    return html`
      <body class="sans-serif mv4 mh5 w-30">
        <h1 class="f1 mb1">${state.opts.name}</h1>
        <p class="lh-copy measure">
          <div class="f3 dib v-mid">${flag(locale)}</div>
          <a class="link blue ml2" href="/setlocale">(${state.translations['changeLocale']})</a>
        </p>
        <p class="lh-copy measure">${state.translations['userDirectory']}: ${state.userDir}</p>
        ${state.exercises.map(function (exercise) {
          return html`
            <a class="link" href="/${exercise.slug}">
              <div class="${exercise.passed ? 'bg-green' : 'bg-dark-pink'} near-white pv3 ph3 w-100 grow pointer mb4">
                <h1 class="f5">${exercise.name}</h1>
                <p>${exercise.matter.summary ? exercise.matter.summary : state.translations['descriptionPlaceholder']}</p>
              </div>
            </a>
          `
        })}
      </body>
    `
  })
}
