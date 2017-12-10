const html = require('choo/html')
const path = require('path')

module.exports.ls = function ls (state, emit, dirsonly) {
  function onclick (e) {
    emit(state.events.SETCURRENTDIR, path.join(state.currentDir, e.target.innerHTML))
    emit(state.events.REFRESHDIRS, state.currentDir, dirsonly)
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

  if (state.fileList.length === 0) emit(state.events.REFRESHDIRS, state.currentDir, dirsonly)
  return html`
    <div class="pa3">
      <ul class="list pl0 measure">
        ${li(onclick.bind(this, {target:{innerHTML: '.'}}), 'Refresh Directory')}
        ${li(onclick.bind(this, {target:{innerHTML: '..'}}), 'Parent Directory')}
        ${state.fileList.map(function (file) {
          return li(onclick, file)
        })}
      </ul>
    </div>
  `
}
