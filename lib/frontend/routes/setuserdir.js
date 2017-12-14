var html = require('choo/html')
var slugify = require('slugify')
var ls = require('../common').ls
var view = require('../view')

module.exports = function (state, emit) {
  return view(state, function () {
    function onclick () {
      emit(state.events.SETUSERDIR, state.currentDir)
    } 

    var title = 'set user directory'
    if (title !== state.title) {
      emit(state.events.REFRESHDIRS, [state.currentDir, true])
      emit(state.events.DOMTITLECHANGE, title)
    }
    return html`
      <body class="sans-serif mv4 mh5">
        <p class="lh-copy measure">
          Welcome to ${state.opts.name}! Before we can get started, you need to set the directory from which
          you want to complete the exercises. This can be any directory, but it's recommended to make
          a new one specifically for this questline, for example called 
          <span class="b">${slugify(state.opts.name)}_solutions</span>.
        </p>
        ${ls(state, emit, true)}
        <a class="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue pointer" onclick=${onclick}>use this directory</a>
      </body>
    `
  })
}
