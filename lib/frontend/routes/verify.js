var html = require('choo/html')
var path = require('path')
var ls = require('../common').ls
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    function onResetClick () {
      emit(state.events.CLEARSELECTEDFILE)
    }

    function onVerifyClick () {
      
    }

    var exercise = state.exercises.find(function (e) {
      return e.slug === state.params.slug
    })
    var title = `verify or run ${exercise.name}`
    if (title !== state.title) {
      emit(state.events.SETCURRENTDIR, state.userDir)
      emit(state.events.REFRESHDIRS, [state.currentDir, false])
      emit(state.events.DOMTITLECHANGE, title)
    }

    let component
    if (state.verify.file) {
      component = html`
        <div>
          <div class="f1">
            <pre class="dib">${path.basename(state.verify.file)}</pre>
            selected
            <small class="f5">(<a href="#" class="link blue" onclick=${onResetClick}>change</a>)</small>
          </div>

          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" 
            onclick=${onVerifyClick}>
            verify
          </a>
        </div>
      `
    } else {
      component = ls(state, emit, false)
    }

    return html`
      <body class="sans-serif mv4 mh5 mw7">
        <h1 class="f1">${exercise.name}</h1>
        ${component}
      </body>
    `
  })
}
