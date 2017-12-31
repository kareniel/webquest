var html = require('choo/html')
var raw = require('choo/html/raw')
var slugify = require('slugify')
var c = require('../common')
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    function onclick () {
      emit(state.events.SETUSERDIR, state.currentDir)
    }

    var title = 'set user directory'
    if (title !== state.title) {
      emit(state.events.FETCHTRANSLATIONS, 'setUserDir')
      emit(state.events.REFRESHDIRS, [state.currentDir, true])
      emit(state.events.DOMTITLECHANGE, title)
    }
    return html`
      <body class="sans-serif mv4 mh5 w-30-l w-70">
        <p class="lh-copy measure">
          ${raw(c.r(state.translations['welcome'], { name: state.opts.name, slug: slugify(state.opts.name) }))}
        </p>
        ${c.ls(state, emit, true)}
        <a class="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" onclick=${onclick}>${state.translations['useButton']}</a>
      </body>
    `
  })
}
