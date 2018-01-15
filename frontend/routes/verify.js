var html = require('choo/html')
var raw = require('choo/html/raw')
var path = require('path')
var c = require('../common')
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
      var ex = state.exercises.find(function (e) {
        return e.slug === state.params.slug
      })
      emit(state.events.RESETMESSAGES)
      emit(state.events.RUN, [ex.name, state.verify.file])
    }

    function onBackClick () {
      emit(state.events.PUSHSTATE, '/')
    }

    var title = `run or verify ${exercise.name}`
    if (title !== state.title) {
      emit(state.events.RESETVERIFY)
      emit(state.events.SETCURRENTDIR, state.userDir)
      emit(state.events.REFRESHDIRS, [state.currentDir, false])
      emit(state.events.FETCHTRANSLATIONS, 'verify')
      emit(state.events.DOMTITLECHANGE, title)
    }

    var component
    if (!state.verify.running && !state.verify.done && state.verify.file) {
      component = html`
        <div>
          <div class="f1">
            <pre class="dib">${path.basename(state.verify.file)}</pre>
            ${state.translations['selected']}
            <small class="f5">(<a href="#" class="link blue" onclick=${onResetClick}>${state.translations['change']}</a>)</small>
          </div>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer mr3" 
            onclick=${onVerifyClick}>
            ${state.translations['verify']}
          </a>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" 
            onclick=${onRunClick}>
            ${state.translations['run']}
          </a>
        </div>
      `
    } else if (state.verify.running || state.verify.done) {
      var statusMessage
      if (state.verify.mode === 'verify' && !state.verify.running) {
        if (state.verify.success) {
          statusMessage = html`<b class="pa3 pa4-ns db f3 mb1 green">${state.translations['passMessage']}</b>`
        } else {
          statusMessage = html`<b class="pa3 pa4-ns db f3 mb1 red">${state.translations['failMessage']}</b>`
        }
      }
      if (state.verify.mode === 'verify' && state.verify.running) {
        statusMessage = html`<b class="pa3 pa4-ns db f3 mb1">${state.translations['runningMessage']}</b>`
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
            onclick=${state.verify.mode === 'verify' ? onVerifyClick : onRunClick}>
            ${c.r(state.translations['again'], { action: state.verify.mode === 'verify' ? state.translations['verify'] : state.translations['run'] })}
          </a>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer mr3" 
            onclick=${state.verify.mode === 'verify' ? onRunClick : onVerifyClick}>
            ${c.r(state.translations['instead'], { action: state.verify.mode === 'verify' ? state.translations['run'] : state.translations['verify'] })}
          </a>
          <a 
            class="f5 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" 
            onclick=${onBackClick}>
            ${state.translations['backToOverview']}
          </a>
        </div>
      `
    } else {
      component = c.ls(state, emit, false)
    }

    return html`
      <div>
        <h1 class="f1">${exercise.name}</h1>
        ${component}
      </div>
    `
  })
}
