var html = require('choo/html')

module.exports = function (state, emit) {
  var title = state.opts.name
  if (title && state.title !== title) emit(state.events.DOMTITLECHANGE, title)
  return html`
    <body class="sans-serif mv4 mh5 w-30">
      <h1 class="f1 mb1">${state.opts.name}</h1>
      <p class="lh-copy measure">User directory: ${state.userDir}</p>
      ${state.exercises.map(function (exercise) {
        return html`
          <a class="link" href="/${exercise.slug}">
            <div class="bg-dark-pink near-white pv3 ph3 w-100 grow pointer mb4">
              <h1 class="f5">${exercise.name}</h1>
              <p>${exercise.matter.summary ? exercise.matter.summary : 'A cool exercise!'}</p>
            </div>
          </a>
        `
      })}
    </body>
  `
}
