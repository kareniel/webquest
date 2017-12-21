var html = require('choo/html')
var flag = require('country-emoji').flag
var view = require('../view')
var locales = require('../../availableLocales.json')

module.exports = function (state, emit) {
  return view(state, function () {
    var title = 'set locale'
    if (title !== state.title) {
      emit(state.events.FETCHTRANSLATIONS, 'setLocale')
      emit(state.events.DOMTITLECHANGE, title)
    }

    function onclick (evt) {
      const locale = evt.target.getAttribute('alt')
      emit(state.events.SETLOCALE, locale)
    }

    let component
    if (state.localeChanged) {
      component = html`
        <p class="measure lh-copy">${state.translations['success']}</p>
      `
    } else {
      component = html`
      <ul class="list pv3">
        ${locales.map(function (l) {
          const locale = l === 'en' ? 'uk' : l
          return html`
            <li class="dib f1 mr4 dim pointer" alt="${l}" onclick=${onclick}>${flag(locale.toUpperCase())}</li>
          `
        })}
      </ul>
      `
    }

    return html`
      <body class="sans-serif mv4 mh5 w-30">
        <h1 class="f1 mb1">${state.translations['header']}</h1>
        ${component}
      </body>
    `
  })
}
