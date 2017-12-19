var html = require('choo/html')
var raw = require('choo/html/raw')
var path = require('path')
var ls = require('../common').ls
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    var exercise = state.exercises.find(function (e) {
      return e.slug === state.params.slug
    })

    function onResetClick () {
      emit(state.events.CLEARSELECTEDFILE)
    }

    function onVerifyClick () {
      var ex = state.exercises.find(function (e) {
        return e.slug === state.params.slug
      })
      emit(state.events.RESETMESSAGES)
      emit(state.events.VERIFY, [ex.name, state.verify.file])
    }

    function onRunClick () {

    }

    function onBackClick () {
      emit(state.events.PUSHSTATE, '/')
    }

    var title = `verify or run ${exercise.name}`
    if (title !== state.title) {
      emit(state.events.RESETVERIFY)
      emit(state.events.SETCURRENTDIR, state.userDir)
      emit(state.events.REFRESHDIRS, [state.currentDir, false])
      emit(state.events.DOMTITLECHANGE, title)
    }

    var component
    if (!state.verify.running && !state.verify.done && state.verify.file) {
      component = html`
        <div>
          <div class="f1">
            <pre class="dib">${path.basename(state.verify.file)}</pre>
            selected
            <small class="f5">(<a href="#" class="link blue" onclick=${onResetClick}>change</a>)</small>
          </div>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer mr3" 
            onclick=${onVerifyClick}>
            verify
          </a>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" 
            onclick=${onRunClick}>
            run
          </a>
        </div>
      `
    } else if (state.verify.running || state.verify.done) {
      var statusMessage
      if (state.verify.success) {
        statusMessage = html`<b class="pa3 pa4-ns db f3 mb1 green">You passed this exercise!</b>`
      } else {
        statusMessage = html`<b class="pa3 pa4-ns db f3 mb1 red">You failed this exercise...</b>`
      }
      component = html`
        <div>
          <ul class="list">
            ${state.verify.messages.map(function (message) {
              return html`
                <li class="pa3 pa4-ns bb b--black-10">
                  <b class="db f3 mb1">${raw(message)}</b>
                </li>
              `
            })}
          </ul>
          ${statusMessage}
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer mr3" 
            onclick=${onVerifyClick}>
            verify again
          </a>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" 
            onclick=${onBackClick}>
            back to exercise overview
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
