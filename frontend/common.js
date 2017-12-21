var html = require('choo/html')
var mustache = require('mustache')
var path = require('path')

module.exports.r = function (template, replacements) {
  return mustache.render(template || '', replacements)
}

module.exports.ls = function ls (state, emit, dirsonly) {
  function onclick (e) {
    var name = e.target.innerHTML
    var lastElement = name.split('.')[name.split('.').length - 1]
    if (lastElement !== 'js') {
      emit(state.events.SETCURRENTDIR, path.join(state.currentDir, name))
      emit(state.events.REFRESHDIRS, [state.currentDir, dirsonly])
    } else {
      emit(state.events.SELECTFILE, path.join(state.currentDir, name))
    }
  }

  function li (onclick, content) {
    return html`
      <li
        onclick=${onclick}
        class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30 bg-animate hover-bg-blue hover-white pl3 pointer">
        ${content}
      </li>
    `
  }

  return html`
    <div class="pa3">
      <div class="f3">${state.currentDir}</div>
      <ul class="list pl0 measure">
        ${li(onclick.bind(this, {target: {innerHTML: '.'}}), 'Refresh Directory')}
        ${li(onclick.bind(this, {target: {innerHTML: '..'}}), 'Parent Directory')}
        ${state.fileList.map(function (file) {
          return li(onclick, file)
        })}
      </ul>
    </div>
  `
}
